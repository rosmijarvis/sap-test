var xmpp        = require('../index');
var ltx         = require('ltx');
var util        = require('util');
var EventEmitter = require('events').EventEmitter;
var logger       = require('../../utility/logger');
var Message      = require("../../tables/message.js").Message;
var GroupMessage = require("../../tables/groupmessage.js").GroupMessage;
var gcm = require('node-gcm');
var config_file = require('../../config');
var Users = require("../../tables/users.js").Users;
var async = require('async');

function Gcm(server) {
    this.server = server;
}
util.inherits(Gcm, EventEmitter);
/**
* GCM messages */
Gcm.prototype.sendGcmMessage = function(jids) {
    logger.info('GCM message is going to be sent');
    if(jids)
    {
        var jid = [];
        for(var j = 0; j < jids.length; j++)
        {
            jid.push("'"+jids[j]+"'");
        }
        var users = new Users({
            jid: jid
        });
        
        users.getRegistrationToken(null, function(error, token) {
            logger.info(token);
            if(token.length > 0)
            {
                // Create a message 
                // ... with default values 
                var message = new gcm.Message();
                 
                // ... or some given values 
                var message = new gcm.Message({
                  collapseKey: 'tchat'+jids[0],
                  priority: 'high',
                  contentAvailable: true,
                  delayWhileIdle: false,
                  //timeToLive: 10000,
                  restrictedPackageName: '',
                  dryRun: false
                });
                
                
                var notification_title = config_file.gcm.gcm_title ? config_file.gcm.gcm_title.replace(/\\'/g,"'") : '';
                var message_content = config_file.gcm.gcm_content ? config_file.gcm.gcm_content.replace(/\\'/g,"'") : '';
                // as object 
                message.addNotification({
                    title: notification_title,
                    body: '',
                    icon: 'notification',
                    tag: 'Hridesh',
                    sound: true
                });
                

                if(config_file.gcm.gcm_proxy_url != '')
                {
                    var prefix_credentials = '';
                    if(config_file.gcm.gcm_proxy_username && config_file.gcm.gcm_proxy_password)
                    {
                        prefix_credentials =  config_file.gcm.gcm_proxy_username+':'+config_file.gcm.gcm_proxy_password+'@';
                    }
                    else {
                        prefix_credentials = '';
                    }
                    // Set up the sender with you API key 
                    var requestOptions = {
                        proxy: 'http://'+prefix_credentials+config_file.gcm.gcm_proxy_url+':'+config_file.gcm.gcm_proxy_port
                        // strictSSL: false,
                        // method: 'POST'
                    };
                    logger.info(requestOptions);
                    var sender = new gcm.Sender(config_file.gcm.gcm_api , requestOptions);
                }
                else {
                    var sender = new gcm.Sender(config_file.gcm.gcm_api);
                }
                // Add the registration tokens of the devices you want to send to 
                var tokens = [];
                for(var t = 0; t < token.length; t++)
                {
                    tokens.push(token[t].gcm_token);
                }
                
                // Max devices per request    
                var batchLimit = 1000;

                // Batches will be added to this array
                var tokenBatches = [];

                // Traverse tokens and split them up into batches of 1,000 devices each  
                for ( var start = 0; start < tokens.length; start += batchLimit )
                {
                    // Get next 1,000 tokens
                    var slicedTokens = tokens.splice(start, start + batchLimit);

                    // Add to batches array
                    tokenBatches.push(slicedTokens);
                }
                // You can now send a push to each batch of devices, in parallel, using the caolan/async library
                async.each( tokenBatches, function( batch, callback )
                {
                    // Assuming you already set up the sender and message
                    sender.send(message, { registrationTokens: batch }, function(err, response) {  
                    
                        // Push failed?
                        if (err)
                        {
                            // Stops executing other batches
                            logger.info(err);
                            logger.info('GCM err');
                            logger.info(jids[0]);
                        }
                        else {
                            logger.info('GCM res');
                            logger.info(jids[0]);
                            logger.info(response);
                            // Canonical Id stuff
                            logger.info('response.canonical_ids');
                            logger.info(response.canonical_ids);
                            logger.info(jids[0]);
                            if(response.canonical_ids > 0)
                            {
                                logger.info('canonical ID found');
                                logger.info(response);
                                if(response.results[0].registration_id)
                                {
                                    var gcm_token = response.results[0].registration_id;
                                    var raw_token = response.results[0].registration_id;
                                    logger.info(jids[0]);
                                    logger.info(gcm_token);
                                    var users = new Users({
                                        jid: jids[0],
                                        reg_token: gcm_token,
                                        raw_token: raw_token
                                    });
                                    users.storeGcmToken(null, function(error, result, raw_token){
                                        logger.info(error);
                                        logger.info(result);
                                    });
                                }
                            }
                        }
                        // Done with batch
                        callback();
                    });
                },
                function( err )
                {
                    // Log the error to console
                    if ( err )
                    {
                        logger.info(err);
                    }
                });
            }
        });
    }
    // var Sender = require('node-xcs').Sender;
    // var Message = require('node-xcs').Message;
    // var Notification = require('node-xcs').Notification;
    // var Result = require('node-xcs').Result;
     
    // var xcs = new Sender('tchat-c7aae', 'AIzaSyCwKSOVuIv_MKt3haN6VexePo8-sOvsdYM');
     
    // xcs.on('message', function(messageId, from, data, category) {
    //     logger.info('received message', arguments);
    // });
     
    // xcs.on('receipt', function(messageId, from, data, category) {
    //     logger.info('received receipt', arguments);
    // });
     
    // var notification = new Notification("ic_launcher")
    //     .title("Hello buddy!")
    //     .body("node-xcs is awesome.")
    //     .build();
     
    // var message = new Message("messageId_1046")
    //     .priority("high")
    //     .dryRun(false)
    //     .addData("node-xcs", true)
    //     .addData("anything_else", false)
    //     .addData("awesomeness", 100)
    //     .deliveryReceiptRequested(true)
    //     .notification(notification)
    //     .build();
    // var to = {};
    // //to.topic('cy36RctYMcU:APA91bEacmztJi1j_T9As3HOgRwj9RZcQo8agUNWoZ1Q6plHywuhaggZSLAcNNMCGmZhhPoEP_oVh6T-bcswYkFwSdU3vY5VOfmjtAATcvatfbJHiasC5_z3lMDDUA92xwrcHKX6UjHZ');
    // xcs.sendNoRetry(message, 'cy36RctYMcU:APA91bEacmztJi1j_T9As3HOgRwj9RZcQo8agUNWoZ1Q6plHywuhaggZSLAcNNMCGmZhhPoEP_oVh6T-bcswYkFwSdU3vY5VOfmjtAATcvatfbJHiasC5_z3lMDDUA92xwrcHKX6UjHZ', function (result) {
    //     if (result.getError()) {
    //         console.error(result.getErrorDescription());
    //     } else {
    //         logger.info("message sent: #" + result.getMessageId());
    //     }
    // });

}

exports.configure = function(server) {
    var gcm = new Gcm(server);
    server.gcm = gcm;
}

