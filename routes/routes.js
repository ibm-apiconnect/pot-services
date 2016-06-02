var express = require('express');
var router = express.Router();

var consumer_index = require('./consumer/index');
var consumer_config = require('./consumer/config');
var consumer_inventory = require('./consumer/inventory');
var consumer_item = require('./consumer/item');
var consumer_login = require('./consumer/login');
var consumer_logout = require('./consumer/logout');
var consumer_logistics = require('./consumer/logistics');
var consumer_financing = require('./consumer/financing');
var financing_calculate = require('./financing/calculate');
var shipping_calculate = require('./shipping/calculate');

/* Index Routes */
router.route('/')
  .get(consumer_index)
  .post(financing_calculate);

/* Consumer App Routes */
router.use('/config', consumer_config);
router.use('/inventory', consumer_inventory);
router.use('/item', consumer_item);
router.use('/login', consumer_login);
router.use('/logout', consumer_logout);
router.use('/logistics', consumer_logistics);
router.use('/financing', consumer_financing);

/* Shipping Calculator Routes */
router.use('/calculate', shipping_calculate);

module.exports = router;