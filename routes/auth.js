var express = require('express');
var router = express.Router();

router.use('/', function(req, res) {
  res.sendStatus(200);
});

module.exports = router;