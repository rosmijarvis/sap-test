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
class MobileTextChannel{
	
constructor(conf){
	
	this.conf = conf;
	
}
	
	// Fetch a client for this medium
	getMediumClient(){
		
		    var HashMap = require('hashmap');
            var map = new HashMap();
			
			var userInteraction =  new UserInteraction(this.conf);
			let localConfiguration = this.conf; 
		    var channelAdaptor= localConfiguration.botconfiguration.channelconfiguration.channeladapter;
			var message_id = null;
		    // 1 - Create XMPP connection to mobile chat server
			var xmppClient = new Client({
			type: 'client',
			tgi: 't111111',
			jid: 't111111@54.83.75.126',
  
			password: '123456',
			port: 5222,
			host: '54.83.75.126',
			legacySSL: false,
			preferredSaslMechanism : 'PLAIN'
			});
			
			
			// 2 - When client goes online
			xmppClient.on('online', function () {
			console.log('User is online===============================');
			xmppClient.connection.socket.setKeepAlive(true, 1000000)
				
			}); 
			
			
			//2.1 - When client recieves a stanza/* 
			xmppClient.on('stanza', function (stanza) {
			var sentTime =  stanza.getChild('status').getChild('sentTime').getText();	
			var message_id =  stanza.getChild('status').getChild('message_id').getText();	
					
		      // Step 3 - Recieve incoming message and parse it   
			var responseBody =  stanza.getChild('body').getText();
			
			var received =  stanza.getChild('status').getChild('received').getText();
			var receivedTime =  stanza.getChild('status').getChild('receivedTime').getText();
			var read =  stanza.getChild('status').getChild('read').getText();
			
			var senderid =  stanza.getChild('senderinfo').getChild('senderid').getText();
			var sendername =  stanza.getChild('senderinfo').getChild('sendername').getText();
		
			// If recieved =0
			if( null != received && '0' == received){
			
		    var exists = map.get(stanza.attrs.id);
		 
		    logger.debug( senderid + 'XMPP - USer has sent a Stanza to Server'  );
						
			
			if( null == exists ){
		        logger.debug( 'XMPP - USer ' + senderid + 'has sent a Stanza to Server'); 
			    map.set(stanza.attrs.id, stanza.attrs.id);	
				logger.debug(senderid+'---send stanza------');
				logger.debug(stanza.toString());
				//Make the call to fetch a response from API AI
				logger.debug( senderid + 'Sending stanza to AI pipeline' );
				sessionsUtility.manageUserSession( 
					
					senderid,
					localConfiguration.botconfiguration.sessionsinformation  ,  
					stanza, 
					xmppClient,  
					userInteraction, 
					channelAdaptor 
				); 
		    }else{
			     
				 console.log('Message has already been processed------');
		    } 
	      }
        }); 		
	}
	
	
}	
	
	
	
	


module.exports.MobileTextChannel = MobileTextChannel;