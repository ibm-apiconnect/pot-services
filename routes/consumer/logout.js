var express = require('express');
var router = express.Router();
var session;

/* GET request for login screen */
router.get('/', function (req, res) {
  session = req.session;

  delete session.config;
  delete session.oauth2token;
  
  res.redirect('/');
});

module.exports = router;