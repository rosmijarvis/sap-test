var xmpp  = require('../index');
var ltx = require('ltx');
var config = require('../../config');
var Config = require("../../tables/config.js").Config;
var util = require('util');
var ldap = require('ldapjs');
var EventEmitter = require('events').EventEmitter;
var otplib = require('otplib');
var smtp = require("../../lib/smtp").transport;
var logger = require('../../utility/logger');
var client_ldap = ldap.createClient({
    url: config.ldap.ip+':'+config.ldap.port
})
var Users = require("../../tables/users.js").Users;

function Login(server) {
    this.server = server;
}
util.inherits(Login, EventEmitter);


exports.configure = function(server) {
    
    var login = new Login(server); 
    server.on('connect', function(client) {

        // Allows the developer to authenticate users against anything they want.
        client.on('authenticate', function (opts, cb) {
            
            logger.info('Server:', opts.username, 'AUTHENTICATING....');
            logger.info('UserName: '+opts.username);
            logger.info('Password: '+opts.password);
            client_ldap.bind(config.ldap.dn, config.ldap.password, function(err, result) {
                client_ldap.compare('uid='+opts.username+','+config.ldap.ou, 'userPassword', opts.password, function(err, matched) {
                    if(!matched || matched == 'undefined')
                    {
                        logger.info('Server:', opts.username, ' Authentication failed')
                        //cb({error_type: 'login_error', condition: 'gone', code: 302, type: 'MODIFY', message: 'Incorrect password' });
                        var iq = new xmpp.Element('iq', {
                            id:   '8592p-13',
                            type: 'error'
                        });
                        var error = iq.c('error', { type: 'modify'});
                        error.c("gone", { xmlns: 'urn:ietf:params:xml:ns:xmpp-stanzas' }).t('Incorrect password').up()
                        .c("text", { xmlns: 'urn:ietf:params:xml:ns:xmpp-stanzas' })
                        .t('Incorrect password').up();
                        logger.info('Authentication Failed');
                        logger.info(iq.toString());
                        client.send(iq);
                    }
                    else 
                    {
                        var config_db =  new Config({
                            user_id: opts.username
                        });
                        config_db.getParticularUserdata(null, function(error, result) {
                            logger.verbose(result[0]);
                            if(result[0].is_active == 1)
                            {
                                config_db.updateUserRecovery();
                                logger.verbose("bind err ::"+ JSON.stringify(err));

                                var search = {
                                  filter: '(uid='+ opts.username +')',
                                  scope: 'sub',
                                  attributes: ['passwordcreateddtime','mail']
                                };
                                
                                var config_dn = config.ldap.dn;
                                var config_array = config_dn.split(',');
                                config_array.shift();
                                var config_final = config_array.join();

                                client_ldap.search(config_final, search, function(err, res) {
                                    logger.verbose("search err ::"+ JSON.stringify(err));

                                    res.on('searchEntry', function(entry) {
                                        logger.verbose('entry: ' + JSON.stringify(entry.object));
                                        var ldap_fields = entry.object;
                                        logger.verbose('mail::'+ldap_fields.mail);
                                        logger.verbose('passwordcreateddtime::'+ldap_fields.passwordcreateddtime);

                                        var expiry_date = new Date(ldap_fields.passwordcreateddtime);
                                        var config_db = new Config();
                                        config_db.getConfigData(null, function(error, result_configuration) {
                                        
                                            expiry_date.setDate(expiry_date.getDate() + parseInt(result_configuration[0].password_expiry_period));
                                            if(expiry_date.getTime() < new Date().getTime() && result_configuration[0].password_expiry_period != '')
                                            {
                                                var iq = new xmpp.Element('iq', {
                                                    id:   '8592p-14',
                                                    type: 'error'
                                                });
                                                var error = iq.c('error', { type: 'modify'});
                                                error.c("gone", { xmlns: 'urn:ietf:params:xml:ns:xmpp-stanzas' }).t('Password Expired').up()
                                                .c("text", { xmlns: 'urn:ietf:params:xml:ns:xmpp-stanzas' })
                                                .t('Password Expired').up();
                                                logger.verbose(iq.toString());
                                                client.send(iq);

                                                otp = otplib.totp;
                                                var secret = otp.utils.generateSecret();
                                                var code = otp.generate(secret);
                                                logger.verbose('Login - Password expiry OTP code: ' + code); //To be sent via SMTP to opts.email

                                                // Add OTP to LDAP
                                                var otp_variable = {
                                                    otp: code
                                                }
                                                var change = new ldap.Change({
                                                    operation: 'replace', // "add" should be placed if new field is needed
                                                    modification: otp_variable
                                                });

                                                client_ldap.modify('uid=' + opts.username + ','+config.ldap.ou, change, function(err) {
                                                    logger.verbose("update OTP err ::" + JSON.stringify(err));
                                                    // Add OTP Created Date to LDAP
                                                    var otp_date_variable = {
                                                        otpcreateddate: new Date()
                                                    }
                                                    var change = new ldap.Change({
                                                        operation: 'replace', // "add" should be placed if new field is needed
                                                        modification: otp_date_variable
                                                    });

                                                    client_ldap.modify('uid=' + opts.username + ','+config.ldap.ou, change, function(err) {
                                                        logger.verbose("update OTP created date err ::" + JSON.stringify(err));
                                                        //cb(null, opts);
                                                    });
                                                });
                                                var config_db = new Config({
                                                    user_id: opts.username
                                                });  
                                                config_db.getParticularUserdata(null, function(error, result_user) {
                                                    var config_db = new Config();
                                                    config_db.getEmailContent(null, function(error, emailContent) {
                                                        if(emailContent && emailContent[0])
                                                        {
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
                                                            });
                                                        }
                                                    });
                                                });
                                            }
                                            else {  
                                                logger.info('Server:', opts.username, 'Authentication success');
                                                cb(null, opts);
                                            }
                                        });
                                    });
                                    res.on('searchReference', function(referral) {
                                        logger.verbose('referral: ' + referral.uris.join());
                                    });
                                    res.on('error', function(err) {
                                        console.error('error: ' + err.message);
                                    });
                                    res.on('end', function(result) {
                                        logger.verbose('status: ' + result.status);
                                    });
                                });
                            }
                            else {
                                var iq = new xmpp.Element('iq', {
                                    id:   '8592p-13',
                                    type: 'error'
                                });
                                var error = iq.c('error', { type: 'modify'});
                                error.c("gone", { xmlns: 'urn:ietf:params:xml:ns:xmpp-stanzas' }).t('User is not active, please contact local admin').up()
                                .c("text", { xmlns: 'urn:ietf:params:xml:ns:xmpp-stanzas' })
                                .t('User is not active, please contact local admin').up();
                                logger.info('Authentication Failed');
                                logger.info(iq.toString());
                                client.send(iq);
                            }
                        });
                    }
                });
            });

        })

    });

    server.login = login; 
 
}
 


