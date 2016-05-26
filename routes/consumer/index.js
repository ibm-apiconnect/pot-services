var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  session = req.session;

  if (req.hostname == 'thinkibm-auth.mybluemix.net') {
    res.sendStatus(200);
  } else {
    if (typeof session.config !== 'undefined') {
      res.render('index', {title: 'ThinkIBM Consumer'});
    } else {
      res.redirect('/config');
    }
  }

});

module.exports = router;