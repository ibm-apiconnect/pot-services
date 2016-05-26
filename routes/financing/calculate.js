var express = require('express');
var router = express.Router();
var xml2js = require('xml2js');

/* Calculate Financing Rate from SOAP input */
router.post('/', function (req, res) {
  console.log(req.body);

  var parseString = require('xml2js').parseString;
  var parseOptions = {
    trim: true,
    explicitArray: false,
    ignoreAttrs: true,
    explicitRoot: false
  };

  parseString(req.body, parseOptions, function (err, result) {
    console.log("XML as JSON:\n" + JSON.stringify(result));
    var soapBody = result['soapenv:Body'];
    var financingRequest = soapBody['ser:financingRequest'];
    var amount = financingRequest['ser:amount'];
    var duration = financingRequest['ser:duration'];
    var rate = financingRequest['ser:rate'];
    
    console.log("amount: " + amount);
    console.log("duration: " + duration);
    console.log("rate: " + rate);

    var P = amount;
    var N = duration;
    var J = rate / 100;
    J /= 12;
    var K = 1 / (Math.pow(1 + J, N));
    var quote = P * (J / (1 - K));
    var monthlyPaymentAmount = Math.round(quote * 100) / 100;

    res.set('content-type', 'application/xml');
    res.set('accept', 'application/xml');
    res.send("<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ser=\"http://services.think.ibm\"><soapenv:Body><ser:financingResult><ser:paymentAmount>" + monthlyPaymentAmount + "</ser:paymentAmount></ser:financingResult></soapenv:Body></soapenv:Envelope>");
  });

});

module.exports = router;