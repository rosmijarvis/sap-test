'use strict';
// Load properties
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./config/properties.js');

// Imports and initalizations

var AIInterface = require('./ai-interface.js').AIInterface;

var aiInterface = new AIInterface();

var LegacyAdapterFactory = require('./legacy-adapter-factory.js').LegacyAdapterFactory;

var legacyAdapterFactory = new LegacyAdapterFactory();

var ResponseProcessorFactory = require('./response-processor-factory.js').ResponseProcessorFactory;

var responseProcessorFactory = new ResponseProcessorFactory();

// Instance of Mongo DB adapter
var MongoDBAdapter = require('./mongo-db-adapter.js').MongoDBAdapter;
var mongoDBAdapter = new MongoDBAdapter();

const emogen = require('./emoticon_generator.js').getEmoticons;
const Giphy = require('./giphy.js').Giphy;
let giphy = new Giphy();

const LanguageIdentifier = require('./language_detect_ms.js').LanguageIdentifier;
let linguist = new LanguageIdentifier();

var logger = require('../config/logger.js');


var botConfiguration = {};
// Instance of user interactions
class UserInteraction
{
	
	constructor(configuration)
	{   
		botConfiguration = configuration;
	    console.log('---x--User interaction constructor');
		
		//configuration = JSON.parse(configuration)
		//console.log(JSON.stringify(configuration, null, 3));
		this.configuration= configuration;

		this.aiController = aiInterface.getAiHandler( configuration.botconfiguration.aiadapterconfiguration );
		this.legacyController = legacyAdapterFactory.getLegacyAdapter( configuration.botconfiguration.legacyintegration );
		this.responseProcessorController = responseProcessorFactory.getResponseProcessAdapter( configuration.botconfiguration.responseprocessing );
		this.sessionId='';
	}
	
	// Manage user interaction
	manageUserInteraction(userId, data, medium, sessionId, channelAdaptor)
	{
		
		    let self = this;   
			
		   if('htmltext' === channelAdaptor){
			   
			   console.log('Passed session id is---x--' + sessionId); 
			
					console.log('--------------------Message recieved----------------------');
					self.processInformation({text:data}, sessionId , userId)
					.then(enrichedResponse => {
						console.log('--------------------Returning response from Jarvis----------------------');
						//console.log(medium.client.conn.id);
					    logger.debug(userId + '--Bot responds to chat server with response--' + enrichedResponse ); 
						medium.emit("output-from-jarvis", {data:enrichedResponse,room:userId});
					});
			   
		   } 
		   else if('htmlvoice' === channelAdaptor){
			   
			   console.log('--------------------Message recieved----------------------');
					self.processInformation({text:data}, sessionId)
					.then(enrichedResponse => {
						console.log('--------------------Returning response from Jarvis----------------------');
						//console.log(medium.client.conn.id);
					    logger.debug(userId + '--Bot responds to chat server with response--' + enrichedResponse ); 
						let finalResponse = data + '||' + enrichedResponse;
						medium.emit("output-from-jarvis", {data:finalResponse,room:userId});
					});
			   
		   }
		   else if('slack' === channelAdaptor){
			   
			    console.log('Reached slack user interaction');
			    self.processInformation({text:data.text}, self.sessionId)
				.then(enrichedResponse => {
					//console.log('Before medium reply' + JSON.stringify(data, null, 3));
					//console.log('Enriched response' + enrichedResponse);
					medium.reply(data, enrichedResponse);
				}); 
			   
			   
		   } else if('mobiletext' === channelAdaptor){
			   
			   //Step 1 - Parse the response and get incoming message
			   //data
			   let self = this;   
						var responseBody =  data.getChild('body').getText();
						var sentTime =  data.getChild('status').getChild('sentTime').getText();
						var senderid =  data.getChild('senderinfo').getChild('senderid').getText();
						
						
			    logger.debug( senderid + ' Fetching AI response' );
			    console.log('--------------------Message recieved----------------------');
					self.processInformation({text:responseBody}, sessionId)
					.then(enrichedResponse => {
						// Error point 1
						if(enrichedResponse === null || enrichedResponse === ''){
							enrichedResponse = 'Hi, there was an issue connecting with the chat server, please try again in some time';
						}
						//console.log("==================111111111111" + enrichedResponse);
						var Utility = require('../channeladapter/mobilechat/features/utility/utility.js').Utility;
						var utility = new Utility();
						var responseToSend = utility.getResponseToSend(data, sentTime, enrichedResponse);
                        logger.debug( senderid + ' Sending response from Framework to Mobile chat server'+ responseToSend); 						
						medium.send(responseToSend) ; 
					
						});
		 
		   }     
		 
		         
			      
			
		
		
	}
	
	processInformation( message , sessionId, userId ){
		
		
		console.log('***************** Session ID : ' + sessionId + '*****************');
		let self = this;
		var date = new Date();
		message["sessionId"]=sessionId;
		message["userId"]=userId;
		message["userMessageTimeStamp"]=date;
		message["userMessage"]=message.text;
		//delete message.text;
		let oath = new Promise((fulfill, reject) => {
			
			console.log('Message to be inserted in collection'+ JSON.stringify(message));
			
			linguist.findTongue(message.text, sessionId, function(language){
				
				var enrichedRequestMessage = self.responseProcessorController.preProcessMessage(message);			
				self.aiController.handleAIInteractionWithBot( enrichedRequestMessage, language , sessionId, function(aiResponse){
					let enrichedResponse = self.generateEnrichedResponse(message, aiResponse);
					message["botResponse"]=enrichedResponse;
					message["botMessageTimeStamp"] = new Date();
					message["botName"]=botConfiguration.botconfiguration.botname;
					mongoDBAdapter.insertMessageInCollection(message, self.configuration.botconfiguration.botname +  "_messages",function(){})
					fulfill(enrichedResponse);
				} ); 
			});
		});
		
		return oath;
	}
	
	// Generate enriched response
	generateEnrichedResponse(message, aiResponse){
		let self = this;
		var response;     
		if(aiResponse.actionIncomplete)
		{
			response = aiResponse.responseText;
		}
		else if('' === aiResponse.responseText){
			response = self.configuration.emptyresponsetext;
		}
		else
		{				
			if(null != self.legacyController)
			{
				response = self.legacyController.manageLegacyIntegration(aiResponse);
			}
			else
			{
				response = aiResponse.responseText;
			}
		}
		console.log("response => "+response);
		var enrichedResponse = self.responseProcessorController.postProcessResponse( message, response,aiResponse );
		if(enrichedResponse==null || enrichedResponse =='undefined')
		{
			console.log("Before enriching Response...");
			enrichedResponse = self.configuration.botconfiguration.channelconfiguration.channelemptyresponsetext;
		}
		
		console.log("enrichedResponse => "+enrichedResponse);
		return enrichedResponse;
	}
}


module.exports.UserInteraction = UserInteraction;
