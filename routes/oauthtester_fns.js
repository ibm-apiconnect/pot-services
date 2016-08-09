/*************************************************************************
*
* Module Dependencies
*
*************************************************************************/

var request = require('request');
//var session = require('./oauthtester_session');

/*************************************************************************
*
* Exported Functions
*
*************************************************************************/

module.exports.displayForm = function (req, res) {
	// Reset the session
	req.session.destroy(function(err) {});

	// Display the setup form
	var options = {
		header: 'Resource Owner Password',
		subHeader: 'Grant Type',
		formType: 'ro_cred'
	};

	res.render('clientSetupForm.jade', options);
};

module.exports.clientSetupFormSubmit = function(req, res) {
	
	// Update the session variables with the req.body values
	var sess = req.session;
	sess.oauth_token_url = req.body.oauth_token_url;
	sess.ro_id = req.body.ro_id;
	sess.ro_pwd = req.body.ro_pwd;
	sess.client_id = req.body.client_id;
	sess.client_secret = req.body.client_secret;
	sess.req_scope = req.body.req_scope;

	var tokenReqOptions = {
		url: sess.oauth_token_url,
		strictSSL: false,
		form: {
			'grant_type' : 'password',
			'username' : sess.ro_id,
			'password' : sess.ro_pwd,
			'scope' : sess.req_scope
		},
		auth: {
			user: sess.client_id,
			pass: sess.client_secret
		}
	};

	// Set up the api request URL basd on what we know, this will be used later
	var apiReqUrl = sess.oauth_token_url.replace("oauth2/token", "inventory/items");

	// Send the Token Request to API Connect Gateway
	request.post(tokenReqOptions, function(err, httpResponse, body){
		if (!err) {
			console.log('response body: ' + body);
			console.log('the token is: ' + JSON.parse(body).access_token);

			// render it in a new page
			res.render('showToken.jade', {
				header: 'Access Token',
				rspBody: JSON.parse(body),
				apiReqUrl: apiReqUrl
			});
		} else {
			console.log('--- err: \n' + err);
		}
	});
};

module.exports.apiReqSubmit = function(req, res) {

	var sess = req.session;

	console.log("session = " + JSON.stringify(sess));

	console.log("setting request options");
	
	var req_options;
	
	switch (req.body.req_method) {
		case 'GET':
			// No request body needed
			req_options = {
				method: req.body.req_method,
				url: req.body.req_api_url,
				strictSSL: false,
				auth: {
					bearer: req.body.oauth_access_token
				},
				headers: {
					'X-IBM-Client-Id': sess.client_id,
					'X-IBM-Client-Secret': sess.client_secret
				}
			};
			break;
		default:
			switch (req.body.req_content_type) {
				case 'application/json':
					req_options = {
						method: req.body.req_method,
						url: req.body.req_api_url,
						strictSSL: false,
						auth: {
							bearer: req.body.oauth_access_token
						},
						headers: {
							'X-IBM-Client-Id': sess.client_id,
							'X-IBM-Client-Secret': sess.client_secret
						},
					  body: JSON.parse(req.body.req_body),
					  json: true
					};
					break;
				default:
					req_options = {
						method: req.body.req_method,
						url: req.body.req_api_url,
						strictSSL: false,
						auth: {
							bearer: req.body.oauth_access_token
						},
					  headers: {
					  	'Content-Type': req.body.req_content_type,
							'X-IBM-Client-Id': sess.client_id,
							'X-IBM-Client-Secret': sess.client_secret
					  },
					  body: req.body.req_body
					};
					break;
			}
			break;
	}
		
	console.log("---req_options: " + JSON.stringify(req_options));
	
	// Send the API request to APIM
	request(req_options, function (err, httpResponse, body) {
		if (! err) {
			console.log('response content-type: ' + httpResponse.headers['content-type']);
			
			var rsp_body_parsed;
			if (httpResponse.headers['content-type'].indexOf('json') > -1) {
				console.log('parsing response as JSON');
				if (typeof body === "string") {
					rsp_body_parsed = JSON.stringify(JSON.parse(body), null, 3);
				} else {
					rsp_body_parsed = JSON.stringify(body, null, 3);
				}
			} else {
				rsp_body_parsed = body;
			}
			
			console.log('response body: ' + rsp_body_parsed);
			
			var displayValues = {
				access_token: req.body.oauth_access_token,
				req_method: req.body.req_method,
				req_content_type: req.body.req_content_type,
				req_api_url: req.body.req_api_url,
				req_body: req.body.req_body,
				rsp_body: rsp_body_parsed
			};
			
			// display the response in the text area
			res.render('showToken.jade', {
				header: 'Access Token',
				rspBody: displayValues
			});
		} else {
			console.log('--- err: \n' + err);
		}
	});
};