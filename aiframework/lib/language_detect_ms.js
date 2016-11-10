"use strict";

// Properties reader
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./config/properties.js');

const request = require('request');
let msRequest =  request.defaults({
	headers : {
				"Ocp-Apim-Subscription-Key":properties.get('linguist.subscriptionKey')
		   	}
});


const knownLanguages = properties.get('languages');

console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
console.log(JSON.stringify(knownLanguages, null, 3));
console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

let language='en';

let checkIfKnownLanguage= function(languageObj){
	return languageObj.value === language;
}

class LanguageIdentifier{
	
	// Find the language of a given utterance
	findTongue(message, sessionId, callback){
		let jsonBody = {
			"documents": [
				{
				"id": sessionId,
				"text": message
				}
			]
		};
		let options = {
			//'url':loadedConfiguration.findProperty('linguist.endPointUrl'),
			'url':properties.get('linguist.endPointUrl'),
			'json':jsonBody
		};
		msRequest.post(options , function(error, response, body){
			//console.log('###################');
			//console.log('Error : ' + JSON.stringify(error, null, 3));
			//console.log('Response : ' + JSON.stringify(response, null, 3));
			//console.log('Body : ' + JSON.stringify(body, null, 3));
			
			if(error){
				callback('en');
			}
			else{
				
				if(body.documents instanceof Array){
					
					if(body.documents.length>0){
						language= body.documents[0].detectedLanguages[0].iso6391Name;
						console.log('found the language as : ' + language);
										
						callback(language);
					}
					else{
						callback('en');
					}
				}
				else{
					callback('en');
				}
			}
		});

		
	}
}

module.exports.LanguageIdentifier=LanguageIdentifier;