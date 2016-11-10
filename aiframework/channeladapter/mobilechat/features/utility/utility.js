'use strict';

// Instance of Mongo DB adapter
var SessionsUtility = require('../../../../lib/sessions-utility.js').SessionsUtility;
var sessionsUtility = new SessionsUtility();

var PropertiesReader = require('properties-reader');
var sharedProperties = PropertiesReader('./config/shared-properties.js');

// Instance of Use interaction
var UserInteraction = require('../../../../lib/user-interaction-interface.js').UserInteraction;

var logger = require('../../../../config/logger.js');


var xmpp = require('node-xmpp-server')
var Client = require('node-xmpp-client');
var datetime = require('node-datetime');


// Instance of HTML channel adapter
class Utility{
	
constructor(conf){
	
	this.conf = conf;
	
}
	
	// Fetch a client for this medium
	getResponseToSend(data, sentTime, enrichedResponse){
		
			logger.debug('------------Preparing response--------------');
			logger.debug('data==='+data+'========sentTime====='+sentTime+"=========enrichedResponse=="+enrichedResponse)
		    var responseToSend = new xmpp.Element('message', {
                            id:  (new Date()).getTime(),//Date.now() , // guid,
                            to:  data.attrs.from, //'t10616370@54.83.75.126', // We send it back to the sender
                            from: data.attrs.to, //+ '/Smack',
                            type: 'chat'
					}); 
		 
					var responseDate = new Date (sentTime);	
					var addTime = parseInt(sentTime) + 1000;	
					
					responseToSend.c('body').t(enrichedResponse);
					
					var status1 = responseToSend.c('status', {xmlns: 'status:namespace'});
					status1.c('message_id').t('').up();
					status1.c('received').t('0').up();
					status1.c('receivedTime').t('0');
					status1.c('read').t('0');
					status1.c('readTime').t('0');
					status1.c('sentTime').t(addTime);
					status1.c('receivedConfirm').t('1');
					status1.c('readConfirm').t('1'); 
					var senderinfo = responseToSend.c('senderinfo', {xmlns: 'senderinfo:namespace'});
					senderinfo.c('senderid').t('t111111');
					senderinfo.c('sendername').t('');
					
				return 	responseToSend;
		
	}
	
	
}	
	
	
	
	


module.exports.Utility = Utility;