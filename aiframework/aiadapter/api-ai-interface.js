'use strict';
// Packages import
var apiai = require('apiai');

// Load properties
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./config/properties.js');

var app;
var token;

// A utility class to interace with API ai methods
class ApiAiInterface{
	
	// Constructor
	constructor(apiaitoken)
	{	
		app = apiai(apiaitoken);	
		token = apiaitoken;
	}
	
	// Handle basic API interaction
	handleAIInteractionWithBot(message, language, sessionId, callbackFunction)
	{
		//console.log('Utterance sent to API AI is -- ' + message);
		//console.log('Sending utternace to API ai');
		//console.log('I am API AI ' + token);
		console.log('Language passed to API AI is ' + language);
		
		var reqOptions = {
    		lang: language, sessionId:sessionId
		}
		
		
		var request = app.textRequest(message , reqOptions);
		
		var aiResponse = new Object();
		
		request.on('response', function(response) {
			
			//console.log('Got the response');
			console.log(response);
			
			aiResponse.success = true;
			
			if(null != response && null != response.result){
				
				// Whether the action is incompleted	
				if(null != response.result.actionIncomplete){
					aiResponse.actionIncomplete = response.result.actionIncomplete;
				}			
				
				// What are the parameters
				if(null != response.result.parameters){
					aiResponse.parameters = response.result.parameters;
				}	
				
				// what is the action
				if(null != response.result.action){
					aiResponse.action = response.result.action;
				}	
				
				// What is the response text
			    if(null != response.result.fulfillment && null != response.result.fulfillment.speech){
					aiResponse.responseText = response.result.fulfillment.speech;
				}			
				
				// What is the intent
				if(null != response.result.metadata.intentName){
					aiResponse.intentName = response.result.metadata.intentName;
				}
				
				// What is the context
				if(null != response.result.contexts){
					aiResponse.contexts = response.result.contexts;
				}
				
			}
			
			//console.log('Now responding to the Bot');
			console.log('AI call----');
			callbackFunction(aiResponse);
		});
		
		request.on('error', function(error) {
			console.log(error);	
            aiResponse.responseText = 'Hi, there was an issue connecting with the chat server, please try again in some time';	
			callbackFunction(aiResponse);             
			 
		});
		
		request.end();		
	}	
}


module.exports.ApiAiInterface = ApiAiInterface;










