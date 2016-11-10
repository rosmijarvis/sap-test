var xmpp  = require('../index');
var config  = require('../../config');
var ltx = require('ltx');
var ldap = require('ldapjs');
var util = require('util');
var otplib = require('otplib');
var logger       = require('../../utility/logger');
var EventEmitter = require('events').EventEmitter;
var smtp = require("../../lib/smtp").transport;
var client_ldap = ldap.createClient({
  url: 'ldap://127.0.0.1:389'
});

// server.router = new Router(server); // Using the right C2S Router.


/**
* C2S Router */
function Registration(server) {
    this.server = server;
}
util.inherits(Registration, EventEmitter);

exports.configure = function(server) {
    
    var registration = new Registration(server); 
    server.on('connect', function(client) {
            
        client.on("register", function(opts, cb) {
            logger.info('ok');
			if(opts.action_type == 'register')
			{
				if(opts.action_type == null)
				{
					logger.info('Action type is null');
					cb({error_type: 'registration_error', condition: 'gone', code: 302, type: 'MODIFY', message: 'Action type is empty' });
				}
				else 
				{
					if(opts.imei_number == null && opts.action_type == 'register')
					{
						logger.info('IMEI number is empty!');
						cb({error_type: 'registration_error', condition: 'gone', code: 302, type: 'MODIFY', message: 'Empty IMEI number' });
					}
					else 
					{
						/* Bind Ldap admin credentials */
						client_ldap.bind('cn=root,dc=lnt,dc=com', 'admin123', function(err, result) {
						   	logger.info("bind err ::"+ JSON.stringify(err));
							client_ldap.compare('uid='+opts.imei_number+',ou=People,dc=lnt,dc=com', 'uid', opts.imei_number, function(err, matched) {
								logger.info(opts);
								
								if(!matched || matched == 'undefined')
								{
									logger.info('imei invalid');
									cb({error_type: 'registration_error', condition: 'gone', code: 302, type: 'MODIFY', message: 'invalids IMEI number' });
								}
								else 
								{
									client_ldap.compare('uid='+opts.imei_number+',ou=People,dc=lnt,dc=com', 'mail', opts.email, function(err, matched) {
										if(!matched || matched == 'undefined')
										{
											logger.info('email invalid');
										  	cb({error_type: 'registration_error', condition: 'gone', code: 302, type: 'MODIFY', message: 'invalid email address for specified IMEI number' });
										}
										else {
											client_ldap.compare('uid='+opts.imei_number+',ou=People,dc=lnt,dc=com', 'mobile', opts.mobile_number, function(err, matched) {
												if(!matched || matched == 'undefined')
												{
													logger.info('mob invalid');
			cb({error_type: 'registration_error', condition: 'gone', code: 302, type: 'MODIFY', message: 'invalid mobile number for specified IMEI number' });
												}
												else {
													// Add new OTP for IMEI number -- opts.imei_number
													// otp generation m1
													otp = otplib.totp;
													var secret=otp.utils.generateSecret();
													var code=otp.generate(secret);
													logger.info('OTP code: '+code); //To be sent via SMTP to opts.email
													logger.info('Done');
													
													// Add OTP to LDAP
													var otp_variable = {
														otp: code
													}
													var change = new ldap.Change({
														operation: 'replace', // "add" should be placed if new field is needed
														modification: otp_variable
													});

													client_ldap.modify('uid='+opts.imei_number+',ou=People,dc=lnt,dc=com', change, function(err) {
														logger.info("update OTP err ::"+ JSON.stringify(err));
														// Add OTP Created Date to LDAP
														var otp_date_variable = {
															otpcreateddate: new Date()
														}
														var change = new ldap.Change({
															operation: 'replace', // "add" should be placed if new field is needed
															modification: otp_date_variable
														});

														client_ldap.modify('uid='+opts.imei_number+',ou=People,dc=lnt,dc=com', change, function(err) {
															logger.info("update OTP created date err ::"+ JSON.stringify(err));
															cb(null,opts);
														});
													});
													
													//setup e-mail data with unicode symbols
													/* var mailOptions = {
														from: config.links.support,
														to: 'thaleslnt2016@gmail.com',  //list of receivers
														subject: 'Message through SMTP LNT SERVER TEAM. ', // Subject line
														text: 'Your OTP for THALES', // plaintext body
														html: '<b>Your OTP: '+code+'</b>'  // html body
													};
													logger.info('here');
													// send mail with defined transport object
													smtp.sendMail(mailOptions, function(error, info){
														logger.info('sending mail..');
														if(error){
															return logger.info(error);
														}
														logger.info('Message sent: ' + info.response);
														cb(false);
													}); 
												}
											});
										}
									});
								}
							});
						});
					}
				}
			}
        });

    });



    server.registration = registration; 
 
}
 
exports.otp = function(server) {

	var registration = new Registration(server);
    server.on('connect', function(client) {
        client.on("register", function(opts, cb) {
			//logger.info(opts);
			if(opts.action_type == null)
			{
				logger.info('Action type is null');
				cb({error_type: 'registration_error', condition: 'gone', code: 302, type: 'MODIFY', message: 'Action type is empty' });
			}
			else 
			{
				
				if(opts.imei_number == null && opts.action_type == 'otp')
				{
					logger.info('IMEI number is empty!');
					cb({error_type: 'registration_error', condition: 'gone', code: 302, type: 'MODIFY', message: 'Empty IMEI number' });
				}
				else if(opts.action_type == 'otp') {
					/* Bind Ldap admin credentials */
					client_ldap.bind('cn=Manager,dc=lnt,dc=com', 'admin123', function(err, result) {
						logger.info("bind err ::"+ JSON.stringify(err));
						client_ldap.compare('uid='+opts.imei_number+',ou=People,dc=lnt,dc=com', 'otp', opts.otp, function(err, matched) {
							logger.info(matched);
							if(!matched || matched == 'undefined')
							{
								cb({error_type: 'registration_error', condition: 'gone', code: 302, type: 'MODIFY', message: 'Incorrect OTP' });
							}
							else {
								cb(false);
							}
						});
					});
				}
			}
 		});

    });
	server.registration = registration;
}

exports.password = function(server) {

	var registration = new Registration(server);
    server.on('connect', function(client) {
        client.on("register", function(opts, cb) {
			logger.info(opts);
			if(opts.action_type == null)
			{
				logger.info('Action type is null');
				cb({error_type: 'registration_error', condition: 'gone', code: 302, type: 'MODIFY', message: 'Action type is empty' });
			}
			else 
			{
				
				if(opts.imei_number == null && opts.action_type == 'updatePassword')
				{
					logger.info('IMEI number is empty!');
					cb({error_type: 'registration_error', condition: 'gone', code: 302, type: 'MODIFY', message: 'Empty IMEI number' });
				}
				else if(opts.action_type == 'updatePassword') {
					/* Bind Ldap admin credentials */
					client_ldap.bind('cn=Manager,dc=lnt,dc=com', 'admin123', function(err, result) {

						// Add Password to LDAP
						var password_variable = {
							userPassword: opts.userpassword
						}
						var change = new ldap.Change({
							operation: 'replace', // "add" should be placed if new field is needed
							modification: password_variable
						});
						client_ldap.modify('uid='+opts.imei_number+',ou=People,dc=lnt,dc=com', change, function(err) {
							logger.info("update password err ::"+ JSON.stringify(err));
						});

						// Add Password Created Date to LDAP
						var password_date_variable = {
							passwordcreateddtime: new Date()
						}
						var change = new ldap.Change({
							operation: 'replace', // "add" should be placed if new field is needed
							modification: password_date_variable
						});
						client_ldap.modify('uid='+opts.imei_number+',ou=People,dc=lnt,dc=com', change, function(err) {
							logger.info("update password created date err ::"+ JSON.stringify(err));
							if(!err){
								cb(false);
							}
						});
					});
					
				}
			}
 		});

    });
	server.registration = registration;
}

