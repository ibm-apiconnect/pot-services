var express = require('express');
var router = express.Router();
var UrlPattern = require('url-pattern');
var session;

/* GET config page. */
router.get('/', function (req, res) {
  var default_host = (process.env.NODE_ENV == 'bluemix') ? "https://api.us.apiconnect.ibmcloud.com" : "https://api.think.ibm";
  var default_org = (process.env.NODE_ENV == 'bluemix') ? "YOUR BLUEMIX ORG" : "sales";

  res.render('config', {
    title: 'ThinkIBM Consumer App Config',
    host: default_host,
    org: default_org
  });
});

/* POST config setup */
router.post('/', function (req, res) {
  session = req.session;
  var form_body = req.body;
  var apic_uri_pattern = new UrlPattern('(:host)(/:org)(/:cat)');
  var apic_uri = apic_uri_pattern.stringify({
    host: form_body['apic-host'],
    org: form_body['apic-org'],
    cat: form_body['apic-catalog']
  });
  
  session.config = {
    'client_id': form_body['client-id'],
    'client_secret': form_body['client-secret'],
    'apic_uri': apic_uri
  };
  
  res.redirect('/');
});

module.exports = router;
