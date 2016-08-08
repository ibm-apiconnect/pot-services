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

router.get('/', oauth.displayIndex);
router.post('/clientSetupFormSubmit', oauth.clientSetupFormSubmit);
router.post('/apiReqSubmit', oauth.apiReqSubmit);
router.get('/swapCode', oauth.swapCode);
router.get('/:page', oauth.displayForm);

module.exports = router;