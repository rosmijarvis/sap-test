var express = require('express');
var router = express.Router();
var logger = require('../utility/logger');
var message = require("../controllers/message");
var authentication = require("../controllers/authentication");
var validateHelper = require("../utility/ValidateHelper");
var Config      = require("../tables/config.js").Config;

// router.get('/messages', authentication.authenticate, function(req, res, next) {

// 		logger.info("Route: GET /messages");
// 		logger.info("Parameters : req.params: " + JSON.stringify(req.params));

// 		// //req.assert("message_id", "Please input message_id").notEmpty();

// 		// var errors = validateHelper.makeErrors(req.validationErrors());

// 		// if(Object.keys(errors).length > 0 ){
// 		// 	var response = {};
// 		// 	response.status = "error";
// 		// 	response.message = "Please input "+Object.keys(errors).join(", ");
// 		// 	response.errors = errors;
// 		// 	next(response);
// 		// 	return;
// 		// 
// 		next();

// }, message.getMessages);

// router.post('/saveconfig', authentication.authenticate, function(req, res, next) {
// 	var config = new Config({
//         id: 'superman is awesome',
//         password_expiry_period: req.body.password_expiry_period,
//         otp_expiry_period: req.body.otp_expiry_period,
//         message_expiry_period: req.body.message_expiry_period,
//         lock_out_time: req.body.lock_out_time,
//         number_of_login_attempts: req.body.number_of_login_attempts,
//         number_of_password_recovery_requests: req.body.number_of_password_recovery_requests,
//         log_off: req.body.log_off

//     });	
//     console.log(req.body);

//     config.editConfig(null, function(error, result) {
//     	console.log('test');
//     });
// 	logger.info("asdasdsdasd: GET /messages");
// 	logger.info("Parameters : req.params: " + JSON.stringify(req.params));
// 	console.log(message);
// 	res.redirect('/');
// });
module.exports = router;