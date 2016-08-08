var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// additions for oauthtester
var jade = require('jade');
var session = require('express-session');
var open = require('open');

// define route fns
var auth = require('./routes/auth');
var financing = require('./routes/financing');
var oauthtester = require('./routes/oauthtester');
var shipping = require('./routes/shipping');

var app = express();

// additions for oauthtester
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text({ type: '*/xml' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// additions for oauthtester
app.use(session({
  secret: 'ibmApim4me2',
  resave: false,
  saveUninitialized: true
}));
global.sess;

// set routes
app.use('/auth', auth);
app.use('/financing', financing);
app.use('/oauthtester', oauthtester);
app.use('/shipping', shipping);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;