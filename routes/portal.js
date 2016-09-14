var express = require('express');
var router = express.Router();
var xml2js = require('xml2js');

var theme = "";

/* Get portal-theme.zip */
router.route('/theme.zip')
  .get(function (req, res) {

    var options = {
      root: './public/files/portal'
    };

    res.sendFile('theme.zip', options);
  })
  .head(function (req, res) {
    res.send(200);
  });

module.exports = router;