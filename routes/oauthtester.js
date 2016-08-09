/*************************************************************************
 *
 * Module Requirements
 *
 *************************************************************************/

var express = require('express');
var oauth = require('./oauthtester_fns');
var router = express.Router();

/*************************************************************************
 *
 * Module Routes
 *
 *************************************************************************/

router.get('/', oauth.displayForm);
router.post('/clientSetupFormSubmit', oauth.clientSetupFormSubmit);
router.post('/apiReqSubmit', oauth.apiReqSubmit);

module.exports = router;