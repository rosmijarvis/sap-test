'use strict';

// Instance of Mongo DB adapter
var SessionsUtility = require('../../../../lib/sessions-utility.js').SessionsUtility;
var sessionsUtility = new SessionsUtility();

var PropertiesReader = require('properties-reader');
var sharedProperties = PropertiesReader('./config/shared-properties.js');

// Instance of Use interaction
var UserInteraction = require('../../../../lib/user-interaction-interface.js').UserInteraction;

var logger = require('../../../../config/logger.js');


// Instance of HTML channel adapter
class HtmlTextChannel{
	
constructor(conf){
	
	this.conf = conf;
	
}
	
	// Fetch a client for this medium
	getMediumClient(){
		    
			
		    console.log("Invoking socket.io code........");	
			//console.log(this.configuration);
			var userInteraction =  new UserInteraction(this.conf);
			let localConfiguration = this.conf; 
		    // Invoke a HTML client and move to 
			var client=require("socket.io").listen(sharedProperties.get('appServer.webBotSocketPort')); 
			console.log("Listening to port " + 
			sharedProperties.get('appServer.webBotSocketPort') + "--------------");			
			
			client.on('connection', function(socket)
			{
				console.log(JSON.stringify(localConfiguration, null, 3));
				var channelAdaptor= localConfiguration.botconfiguration.channelconfiguration.channeladapter;
				console.log('chatserver connects AI Jarvis connection id ' + socket.client.conn.id);  
				logger.debug('chatserver connects AI Jarvis connection id ' + socket.client.conn.id);  
				
				console.log("Connection done------------------");
				console.log(socket.client.conn.id);		
				
				// Hear to the incoming connection
				socket.on('input-to-jarvis',function(data)
				{ 
				    console.log("Recieved message in HTML channel" );
					
					console.log('--------------------Message recieved----------------------');
					
					console.log(data.room + '|' + data.ip +'--Jarvis receives data from chatserver with roomID --' + data.data);  
					logger.debug( data.room + '|' + data.ip + '--Jarvis receives data from chatserver with roomID --' + data.data);  
						
					
					
					// Manage the user session
					sessionsUtility.manageUserSession( 
					
					data.room, // The user id
					localConfiguration.botconfiguration.sessionsinformation  ,  // The sessions information
					data.data, 
					socket, 
					userInteraction, 
					channelAdaptor
					
					); 
				
				});
			}); 
			
			
			
			//return client;
		
		
	}
	
	
}	
	
	
	
	


module.exports.HtmlTextChannel = HtmlTextChannel;