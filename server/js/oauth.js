var Promise = require('promise');
var UrlPattern = require('url-pattern');
var ClientOAuth2 = require('client-oauth2');
var config = require('config');

var api_url = new UrlPattern('(:host)(:api)(:operation)');
var _apis = config.get('APIs');

module.exports.login = function (username, password, session) {

  return new Promise(function (fulfill, reject) {
    if (typeof session.oauth2token !== 'undefined') {
      console.log("Using OAuth Token: " + session.oauth2token);
      fulfill(session.oauth2token);
    }
    else {

      var authz_url = api_url.stringify({
        host: session.config.apic_uri,
        api: _apis.oauth20.base_path,
        operation: _apis.oauth20.paths.authz
      });

      var token_url = api_url.stringify({
        host: session.config.apic_uri,
        api: _apis.oauth20.base_path,
        operation: _apis.oauth20.paths.token
      });

      var thinkAuth = new ClientOAuth2({
        clientId: session.config.client_id,
        clientSecret: session.config.client_secret,
        accessTokenUri: token_url,
        authorizationUri: authz_url,
        authorizationGrants: _apis.oauth20.grant_types,
        redirectUri: _apis.oauth20.redirect_url,
        scopes: _apis.oauth20.scopes
      });

      // Set an option to disable the check for self-signed certificates
      var options = {
        options: {
          rejectUnauthorized: false
        }
      };

      thinkAuth.owner.getToken(username, password, options)
        .then(function (user) {
          session.oauth2token = user.accessToken;
          console.log("Using OAuth Token: " + session.oauth2token);
          fulfill(session.oauth2token);
        })
        .catch(function (reason) {
          reject(reason);
        });
    }
  });

};