'use strict';

// Instance of Mongo DB adapter
var SessionsUtility = require('../../../../lib/sessions-utility.js').SessionsUtility;
var sessionsUtility = new SessionsUtility();

var PropertiesReader = require('properties-reader');
var sharedProperties = PropertiesReader('./config/shared-properties.js');

// Instance of Use interaction
var UserInteraction = require('../../../../lib/user-interaction-interface.js').UserInteraction;

var logger = require('../../../../config/logger.js');

var SpeechProviderAdapterFactory = require('../../../../lib/speechProvider-adapter-factory.js').SpeechProviderAdapterFactory;
var speechProviderAdapterFactory = new SpeechProviderAdapterFactory();



// Instance of HTML channel adapter
class HtmlVoiceChannel{
	
constructor(conf){
	
	this.conf = conf;
	this.speechRecognizer = speechProviderAdapterFactory.getSpeechAdapter('Google');
	
}
	
	// Fetch a client for this medium
	getMediumClient(){
		    
			let self=this;
			
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
				let socketStream = require('socket.io-stream');
				
					socketStream(socket).on('input-to-jarvis', function(stream, data) {
					self.speechRecognizer.invokeGoogleSpeechToTextStream(stream, function( err, textData ){
						
					//let result='';	
					//initialize result with default error response.
					let result = sharedProperties.get('appServer.jarvisError');
					//console.log('result1 is ' + result);
					if (err != null)
					{	
						result = sharedProperties.get('appServer.jarvisError');
						//console.log('error result is ' + err); 
					}
					else
					if ( textData != null)
					{
						//console.log('text is not null');
						
						let resString =  textData.toString();
						console.log('Response String : ' +  resString);
						if(resString.indexOf('{"result":[]}')>-1){
							resString = resString.replace('{"result":[]}', '');
						}
						let json;
						try{
							json = JSON.parse(resString)
						}
						catch(err){
							console.log(err);
							json = null;
						}
			
						console.log(json);
						if(json==null){
							//console.log('No Response');
							//result='No Response';
							result=sharedProperties.get('appServer.jarvisError');
							//client.send(result);
							//return callback(null,result);
				
						}
						else{
							result=json.result[0].alternative[0].transcript;
							//return callback(null,result);
						}
					}
						
						console.log("The room is--" + data.room);
						//socket.emit('output-from-jarvis',{data:textData,room:data.room, orginaldata:textData});
						//socket.emit('output-from-jarvis',{data:result,room:data.room, orginaldata:result});
						
						sessionsUtility.manageUserSession( 
						data.room, // The user id
						localConfiguration.botconfiguration.sessionsinformation  ,  // The sessions information
						//data.data,
						result,
						socket, 
						userInteraction, 
						channelAdaptor
						); 
						
						
					});
					
					
					
					 
				});	
				

				
				
				
			}); 
			
			
			
		
		
		
	}
	
	
}	
	
	
	
	


module.exports.HtmlVoiceChannel = HtmlVoiceChannel;