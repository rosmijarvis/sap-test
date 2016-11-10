var xmpp = require('../index');
var config = require('../../config');
var Config = require("../../tables/config.js").Config;
var ltx = require('ltx');
var ldap = require('ldapjs');
var util = require('util');
var otplib = require('otplib');
var EventEmitter = require('events').EventEmitter;
var smtp = require("../../lib/smtp").transport;
var Users = require("../../tables/users.js").Users;
var logger = require('../../utility/logger');
var client_ldap = ldap.createClient({
    url: config.ldap.ip + ':' + config.ldap.port
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
            logger.info(opts);
            if (opts.action_type == 'register') {
                if (opts.action_type == null) {
                    logger.verbose('Action type is null');
                    cb({
                        error_type: 'registration_error',
                        condition: 'gone',
                        code: 302,
                        type: 'MODIFY',
                        message: 'Action type is empty'
                    });
                } else {
                    if (opts.thales_tgi == null && opts.action_type == 'register') {
                        logger.verbose('IMEI number is empty!');
                        cb({
                            error_type: 'registration_error',
                            condition: 'gone',
                            code: 302,
                            type: 'MODIFY',
                            message: 'Empty TGi number'
                        });
                    } else {
                        /* Bind Ldap admin credentials */
                        client_ldap.bind(config.ldap.dn, config.ldap.password, function(err, result) {
                            logger.verbose("bind err ::" + JSON.stringify(err));
                            client_ldap.compare('uid=' + opts.thales_tgi + ',' + config.ldap.ou, 'deviceimei', opts.imei_number, function(err, matched) {
                                logger.verbose('uid=' + opts.thales_tgi + ',' + config.ldap.ou + ' :: Compared with :: imei :: '+opts.imei_number);

                                if (!matched || matched == 'undefined') {
                                    logger.info('The device IMEI number does not match with the provided TGi');
                                    cb({
                                        error_type: 'registration_error',
                                        condition: 'gone',
                                        code: 302,
                                        type: 'MODIFY',
                                        message: 'The device IMEI number does not match with the provided TGi, please contact your local admin'
                                    });
                                } else {
                                    client_ldap.compare('uid=' + opts.thales_tgi + ',' + config.ldap.ou, 'mail', opts.email, function(err, matched) {
                                        if (!matched || matched == 'undefined') {
                                            logger.info('email invalid:: '+opts.email);
                                            cb({
                                                error_type: 'registration_error',
                                                condition: 'gone',
                                                code: 302,
                                                type: 'MODIFY',
                                                message: 'Invalid email address for specified IMEI number'
                                            });
                                        } else {
                                            client_ldap.compare('uid=' + opts.thales_tgi + ',' + config.ldap.ou, 'mobile', opts.mobile_number, function(err, matched) {
                                                if (!matched || matched == 'undefined') {
                                                    logger.info('mob invalid:: '+opts.mobile_number);
                                                    cb({
                                                        error_type: 'registration_error',
                                                        condition: 'gone',
                                                        code: 302,
                                                        type: 'MODIFY',
                                                        message: 'Invalid Phone Number'
                                                    });
                                                } else {
                                                    // Add new OTP for IMEI number -- opts.imei_number
                                                    // otp generation m1
                                                    otp = otplib.totp;
                                                    var secret = otp.utils.generateSecret();
                                                    var code = otp.generate(secret);
                                                   code = '000000'; 
                                                   logger.info('OTP code: ' + code); 

                                                    // Add OTP to LDAP
                                                    var otp_variable = {
                                                        otp: code
                                                    }
                                                    var change = new ldap.Change({
                                                        operation: 'replace', // "add" should be placed if new field is needed
                                                        modification: otp_variable
                                                    });

                                                    client_ldap.modify('uid=' + opts.thales_tgi + ',' + config.ldap.ou, change, function(err) {
                                                        logger.verbose("update OTP err ::" + JSON.stringify(err));
                                                        // Add OTP Created Date to LDAP
                                                        var otp_date_variable = {
                                                            otpcreateddate: new Date()
                                                        }
                                                        var change = new ldap.Change({
                                                            operation: 'replace', // "add" should be placed if new field is needed
                                                            modification: otp_date_variable
                                                        });

                                                        client_ldap.modify('uid=' + opts.thales_tgi + ',' + config.ldap.ou, change, function(err) {
                                                            logger.verbose("update OTP created date err ::" + JSON.stringify(err));
                                                            cb(null, opts);
                                                        });
                                                    });
                                                    var config_db = new Config({
                                                        user_id: opts.thales_tgi
                                                    });
                                                        
                                                    config_db.getParticularUserdata(null, function(error, result_user) {
                                                        var config_db = new Config();
                                                        config_db.getEmailContent(null, function(error, emailContent) {
                                                            if(emailContent && emailContent[0])
                                                            {
                                                                var config_db = new Config();
                                                                config_db.getConfigData(null, function(error, result_configuration) {
                                                                    var expiry_date = new Date();
                                                                    expiry_date.setDate(expiry_date.getDate() + parseInt(result_configuration[0].password_expiry_period));
                                                                    email_content = emailContent[0].user_regstrn_email_content;
                                                                    email_content = email_content.replace("<otp-code>", code);
                                                                    email_content = email_content.replace("<date-of-enrollment>", new Date());
                                                                    email_content = email_content.replace("<first-name>", result_user[0].first_name);
                                                                    email_content = email_content.replace("<last-name>", result_user[0].last_name);
                                                                    email_content = email_content.replace("<date-of-expiry>", expiry_date);
                                                                    email_content = email_content.replace("<mobile>", result_user[0].mobile);
                                                                    email_content = email_content.replace("<imei>", result_user[0].imei_number);
                                                                    subject = 'TAS: New user registration email';
                                                                    logger.verbose(email_content);
                                                                    logger.info('sending mail to:: '+opts.email);
                                                                    //setup e-mail data with unicode symbols
                                                                    var mailOptions = {
                                                                        from: config.links.support,
                                                                        to: opts.email, //list of receivers
                                                                        subject: subject, // Subject line
                                                                        html: email_content // html body
                                                                    };
                                                                    logger.verbose('here');
                                                                    // send mail with defined transport object
                                                                    smtp.sendMail(mailOptions, function(error, info) {
                                                                        logger.verbose('sending mail..');
                                                                        if (error) {
                                                                            return logger.verbose(error);
                                                                        }
                                                                        logger.verbose('Message sent: ' + info.response);
                                                                        cb(false);
                                                                    });
                                                                });
                                                            }
                                                        });
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
            //logger.verbose(opts);
            if (opts.action_type == null) {
                logger.verbose('Action type is null');
                cb({
                    error_type: 'registration_error',
                    condition: 'gone',
                    code: 302,
                    type: 'MODIFY',
                    message: 'Manoj -- Please -- Action type is empty'
                });
            } else {

                if (opts.thales_tgi == null && opts.action_type == 'otp') {
                    logger.verbose('TGi number is empty!');
                    cb({
                        error_type: 'registration_error',
                        condition: 'gone',
                        code: 302,
                        type: 'MODIFY',
                        message: 'Empty IMEI number'
                    });
                } else if (opts.action_type == 'otp') {
                    /* Bind Ldap admin credentials */
                    logger.verbose(opts);
                    client_ldap.bind(config.ldap.dn, config.ldap.password, function(err, result) {
                        logger.verbose("bind err ::" + JSON.stringify(err));
                        client_ldap.compare('uid=' + opts.thales_tgi + ',' + config.ldap.ou, 'otp', opts.otp, function(err, matched) {
                            logger.verbose(matched);
                            if (!matched || matched == 'undefined') {
                                cb({
                                    error_type: 'registration_error',
                                    condition: 'gone',
                                    code: 302,
                                    type: 'MODIFY',
                                    message: 'The OTP entered is incorrect'
                                });
                            } else {
                                //Add Mobile to to LDAP and DB
                                if (opts.mobile_new && opts.mobile_new != '') {
                                    var mobile_variable = {
                                        mobile: opts.mobile_new
                                    }

                                    var change = new ldap.Change({
                                        operation: 'replace', // "add" should be placed if new field is needed
                                        modification: mobile_variable
                                    });

                                    client_ldap.modify('uid=' + opts.thales_tgi + ',' + config.ldap.ou, change, function(err) {
                                        logger.info("Change mobile number err ::" + JSON.stringify(err));
                                        if (!err) {
                                            var users = new Users({
                                                mobile: opts.mobile_new,
                                                user_id: opts.thales_tgi
                                            });

                                            users.changeMobileNumber(null, function(error, result) {
                                                if (!error) {
                                                    logger.verbose('store mobile in mysql user table');
                                                    cb(false);
                                                } else {
                                                    logger.verbose(error);
                                                    cb(false);
                                                }
                                            });
                                        }
                                    });
                                } else if (opts.password_new && opts.password_new != '') {
                                    var password_variable = {
                                        mobile: opts.password_new
                                    }

                                    var change = new ldap.Change({
                                        operation: 'replace', // "add" should be placed if new field is needed
                                        modification: password_variable
                                    });

                                    client_ldap.modify('uid=' + opts.thales_tgi + ',' + config.ldap.ou, change, function(err) {
                                        logger.info("Change mobile number err ::" + JSON.stringify(err));
                                        if (!err) {
                                            cb(false);
                                        }
                                    });
                                } else {
                                    cb(false);
                                }
                            }
                        });
                    });
                }
            }
        });

    });
    server.registration = registration;
}
exports.changemobilenumber = function(server) {
    var registration = new Registration(server);
    server.on('connect', function(client) {
        client.on("register", function(opts, cb) {
            if (opts.action_type == null) {
                logger.verbose('Action type is null');
                cb({
                    error_type: 'registration_error',
                    condition: 'gone',
                    code: 302,
                    type: 'MODIFY',
                    message: 'Action type is empty'
                });
            } else {

                if (opts.thales_tgi == null && opts.action_type == 'changeMobileNumber') {
                    logger.verbose('IMEI number is empty!');
                    cb({
                        error_type: 'Modification Error',
                        condition: 'gone',
                        code: 302,
                        type: 'MODIFY',
                        message: 'Empty IMEI number'
                    });
                } else if (opts.action_type == 'changeMobileNumber') {
                    logger.info(opts);

                    logger.info('change mobile number');
                    if (opts.action_type == 'changeMobileNumber') {
                        /* Bind Ldap admin credentials */
                        client_ldap.bind(config.ldap.dn, config.ldap.password, function(err, result) {
                            client_ldap.compare('uid=' + opts.thales_tgi + ',' + config.ldap.ou, 'mobile', opts.mobile_old, function(err, matched) {
                                if (!matched || matched == 'undefined') {
                                    logger.verbose('Server:', opts.thales_tgi, ' you have entered wrong old mobile number')
                                    cb({
                                        error_type: 'login_error',
                                        condition: 'gone',
                                        code: 302,
                                        type: 'MODIFY',
                                        message: 'Incorrect mobile number'
                                    });
                                } else {
                                    otp = otplib.totp;
                                    var secret = otp.utils.generateSecret();
                                    var code = otp.generate(secret);
                                    logger.info('OTP code: ' + code); //To be sent via SMTP to opts.email
                                    logger.verbose('Done');

                                    // Add OTP to LDAP
                                    var otp_variable = {
                                        otp: code
                                    }
                                    var change = new ldap.Change({
                                        operation: 'replace', // "add" should be placed if new field is needed
                                        modification: otp_variable
                                    });

                                    client_ldap.modify('uid=' + opts.thales_tgi + ',' + config.ldap.ou, change, function(err) {
                                        logger.verbose("update OTP err ::" + JSON.stringify(err));
                                        // Add OTP Created Date to LDAP
                                        var otp_date_variable = {
                                            otpcreateddate: new Date()
                                        }
                                        var change = new ldap.Change({
                                            operation: 'replace', // "add" should be placed if new field is needed
                                            modification: otp_date_variable
                                        });

                                        client_ldap.modify('uid=' + opts.thales_tgi + ',' + config.ldap.ou, change, function(err) {
                                            logger.verbose("update OTP created date err ::" + JSON.stringify(err));
                                            cb(null, opts);
                                        });
                                    });
                                    var config_db = new Config({
                                        user_id: opts.thales_tgi
                                    });
                                        
                                    config_db.getParticularUserdata(null, function(error, result_user) {
                                        var config_db = new Config();
                                        config_db.getEmailContent(null, function(error, emailContent) {
                                            if(emailContent && emailContent[0])
                                            {
                                                var config_db = new Config();
                                                config_db.getConfigData(null, function(error, result_configuration) {
                                                    var expiry_date = new Date();
                                                    expiry_date.setDate(expiry_date.getDate() + parseInt(result_configuration[0].password_expiry_period));
                                                    email_content = emailContent[0].mobileno_change_content;
                                                    email_content = email_content.replace("<otp-code>", code);
                                                    email_content = email_content.replace("<date-of-enrollment>", new Date());
                                                    email_content = email_content.replace("<first-name>", result_user[0].first_name);
                                                    email_content = email_content.replace("<last-name>", result_user[0].last_name);
                                                    email_content = email_content.replace("<date-of-expiry>", expiry_date);
                                                    email_content = email_content.replace("<mobile>", result_user[0].mobile);
                                                    email_content = email_content.replace("<imei>", result_user[0].imei_number);
                                                    subject = 'TAS: Change mobile number OTP emails';
                                                    logger.info(email_content);
                                                    logger.info('sending mail to:: '+result_user[0].mail);
                                                    //setup e-mail data with unicode symbols
                                                    var mailOptions = {
                                                        from: config.links.support,
                                                        to: result_user[0].mail, //list of receivers
                                                        subject: subject, // Subject line
                                                        html: email_content // html body
                                                    };
                                                    logger.verbose('here');
                                                    // send mail with defined transport object
                                                    smtp.sendMail(mailOptions, function(error, info) {
                                                        logger.verbose('sending mail..');
                                                        if (error) {
                                                            return logger.verbose(error);
                                                        }
                                                        logger.verbose('Message sent: ' + info.response);
                                                        cb(false);
                                                    });
                                                });
                                            }
                                        });
                                    });
                                }
                            });
                        });

                    }
                }

            }

        });

    });
}
exports.password = function(server) {

    var registration = new Registration(server);
    server.on('connect', function(client) {
        client.on("register", function(opts, cb) {

            if (opts.action_type == null) {
                logger.verbose('Action type is null');
                cb({
                    error_type: 'registration_error',
                    condition: 'gone',
                    code: 302,
                    type: 'MODIFY',
                    message: 'Action type is empty'
                });
            } else {

                if (opts.thales_tgi == null && opts.action_type == 'updatePassword') {
                    logger.verbose('IMEI number is empty!');
                    cb({
                        error_type: 'registration_error',
                        condition: 'gone',
                        code: 302,
                        type: 'MODIFY',
                        message: 'Empty IMEI number'
                    });
                } else if (opts.action_type == 'updatePassword') {
                    /* Bind Ldap admin credentials */
                    client_ldap.bind(config.ldap.dn, config.ldap.password, function(err, result) {

                        // Add Password to LDAP
                        var password_variable = {
                            userPassword: opts.userpassword
                        }
                        var change = new ldap.Change({
                            operation: 'replace', // "add" should be placed if new field is needed
                            modification: password_variable
                        });
                        client_ldap.modify('uid=' + opts.thales_tgi + ',' + config.ldap.ou, change, function(err) {
                            logger.info("update password err ::" + JSON.stringify(err));
                        });

                        // Add Password Created Date to LDAP
                        var password_date_variable = {
                            passwordcreateddtime: new Date()
                        }
                        var change = new ldap.Change({
                            operation: 'replace', // "add" should be placed if new field is needed
                            modification: password_date_variable
                        });
                        client_ldap.modify('uid=' + opts.thales_tgi + ',' + config.ldap.ou, change, function(err) {
                            logger.verbose("update password created date err ::" + JSON.stringify(err));
                            if (!err) {
                                cb(false);
                                //Config Stanza : lock_out_time and log_off_time details
                                var config_table = new Config();
                                config_table.getlogOutAndLockOutTimes(null, function(error, result) {
                                    logger.verbose("The error and result is");
                                    logger.verbose(error);
                                    logger.verbose(result);

                                    if (!error) {
                                        var getConfigDataJson = JSON.stringify(result);
                                        var configDetails = getConfigDataJson.substring(1, getConfigDataJson .length-1);
                                        logger.verbose(configDetails);

                                        var iq = new xmpp.Element('iq', {
                                            id: 'h22xA-10',
                                            to: 'client@tchat',
                                            type: 'get',
                                        });

                                        var configuresettingIQ = iq.c('configuresettingIQ', {
                                            xmlns: 'urn:xmpp:GetConfigureSetting'
                                        });
                                        configuresettingIQ.c('settingDetails').t('').up()
                                        .c('action_type').t('ConfigureSetting').up()
                                        .c('response').t(configDetails).up();
                                        logger.verbose("The Config IQ stanza is");
                                        logger.verbose(iq.toString());
                                        client.send(iq);
                                    }
                                });
                            }
                        });
                    });
                } else if (opts.action_type == 'changePassword') {
                    logger.verbose(opts);

                    if (opts.action_type == 'changePassword') {
                        /* Bind Ldap admin credentials */
                        client_ldap.bind(config.ldap.dn, config.ldap.password, function(err, result) {
                            client_ldap.compare('uid=' + opts.thales_tgi + ',' + config.ldap.ou, 'userPassword', opts.oldpassword, function(err, matched) {
                                if (!matched || matched == 'undefined') {
                                    logger.verbose('Server:', opts.thales_tgi, ' you have entered wrong old password')
                                    cb({
                                        error_type: 'login_error',
                                        condition: 'gone',
                                        code: 302,
                                        type: 'MODIFY',
                                        message: 'Incorrect old password'
                                    });
                                } else {

                                    // Add Password to LDAP
                                    var password_variable = {
                                        userPassword: opts.newpassword
                                    }

                                    var change = new ldap.Change({
                                        operation: 'replace', // "add" should be placed if new field is needed
                                        modification: password_variable
                                    });

                                    client_ldap.modify('uid=' + opts.thales_tgi + ',' + config.ldap.ou, change, function(err) {
                                        logger.info("update password err ::" + JSON.stringify(err));
                                    });

                                    // Add Password Updated Date to LDAP
                                    var password_date_variable = {
                                        passwordcreateddtime: new Date()
                                    }
                                    var change = new ldap.Change({
                                        operation: 'replace', // "add" should be placed if new field is needed
                                        modification: password_date_variable
                                    });

                                    client_ldap.modify('uid=' + opts.thales_tgi + ',' + config.ldap.ou, change, function(err) {
                                        logger.verbose("update password created date err ::" + JSON.stringify(err));
                                        if (!err) cb(false);
                                    });
                                }
                            });
                        });

                    }
                } else if (opts.action_type == 'passwordRecovery') {
                    logger.verbose("Password Recovery");
                    otp = otplib.totp;
                    var secret = otp.utils.generateSecret();
                    var code = otp.generate(secret);
                    logger.verbose('Login - Password expiry OTP code: ' + code); //To be sent via SMTP to opts.email
                    client_ldap.bind(config.ldap.dn, config.ldap.password, function(err, result) {
                        // Add OTP to LDAP
                        var otp_variable = {
                            otp: code
                        }
                        var change = new ldap.Change({
                            operation: 'replace', // "add" should be placed if new field is needed
                            modification: otp_variable
                        });

                        client_ldap.modify('uid=' + opts.thales_tgi + ',' + config.ldap.ou, change, function(err) {
                            logger.verbose("update OTP err ::" + JSON.stringify(err));
                            // Add OTP Created Date to LDAP
                            var otp_date_variable = {
                                otpcreateddate: new Date()
                            }
                            var change = new ldap.Change({
                                operation: 'replace', // "add" should be placed if new field is needed
                                modification: otp_date_variable
                            });

                            client_ldap.modify('uid=' + opts.thales_tgi + ',' + config.ldap.ou, change, function(err) {
                                logger.verbose("update OTP created date err ::" + JSON.stringify(err));
                                cb(null, opts);
                            });
                        });
                        var config_db = new Config({
                            user_id: opts.thales_tgi
                        });  
                        config_db.getParticularUserdata(null, function(error, result_user) {
                            var config_db = new Config();
                            config_db.getEmailContent(null, function(error, emailContent) {
                                if(emailContent && emailContent[0])
                                {
                                    var config_db = new Config();
                                    config_db.getConfigData(null, function(error, result_configuration) {
                                        var expiry_date = new Date();
                                        expiry_date.setDate(expiry_date.getDate() + parseInt(result_configuration[0].password_expiry_period));
                                        email_content = emailContent[0].pswd_recovery_otp_content;
                                        email_content = email_content.replace("<otp-code>", code);
                                        email_content = email_content.replace("<date-of-enrollment>", new Date());
                                        email_content = email_content.replace("<first-name>", result_user[0].first_name);
                                        email_content = email_content.replace("<last-name>", result_user[0].last_name);
                                        email_content = email_content.replace("<date-of-expiry>", expiry_date);
                                        email_content = email_content.replace("<mobile>", result_user[0].mobile);
                                        email_content = email_content.replace("<imei>", result_user[0].imei_number);
                                        subject = 'TAS: Password recovery OTP email';
                                        logger.info(email_content);
                                        logger.info('sending mail to:: '+result_user[0].mail);
                                        //setup e-mail data with unicode symbols
                                        var mailOptions = {
                                            from: config.links.support,
                                            to: result_user[0].mail, //list of receivers
                                            subject: subject, // Subject line
                                            html: email_content // html body
                                        };
                                        logger.verbose('here');
                                        // send mail with defined transport object
                                        smtp.sendMail(mailOptions, function(error, info) {
                                            logger.verbose('sending mail..');
                                            if (error) {
                                                return logger.verbose(error);
                                            }
                                            logger.verbose('Message sent: ' + info.response);
                                            var config_db = new Config({
                                                user_id: opts.thales_tgi
                                            });  
                                            config_db.updateRecovery(null, function(error, result_recovery, recovery) {
                                                cb(false);
                                                if(recovery == 0)
                                                {
                                                    logger.info('send alert email now');
                                                    email_content = emailContent[0].alert_email_content?emailContent[0].alert_email_content:'';
                                                    email_content = email_content.replace("<otp-code>", code);
                                                    email_content = email_content.replace("<date-of-enrollment>", new Date());
                                                    email_content = email_content.replace("<first-name>", result_user[0].first_name);
                                                    email_content = email_content.replace("<last-name>", result_user[0].last_name);
                                                    email_content = email_content.replace("<date-of-expiry>", expiry_date);
                                                    email_content = email_content.replace("<mobile>", result_user[0].mobile);
                                                    email_content = email_content.replace("<imei>", result_user[0].imei_number);
                                                    var mailOptions = {
                                                        from: config.links.support,
                                                        to: config.global.email, //list of receivers
                                                        subject: 'Alert Email', // Subject line
                                                        html: email_content // html body
                                                    };
                                                    // send mail with defined transport object
                                                    smtp.sendMail(mailOptions, function(error, info) {
                                                        logger.info('sending mail..');
                                                        if (error) {
                                                            return logger.info(error);
                                                        }
                                                        logger.info('Message sent: ' + info.response);
                                                    });
                                                }
                                             });
                                        });
                                    });
                                }
                            });
                        });
                    });
                }
            }

        });

    });
    server.registration = registration;
}
