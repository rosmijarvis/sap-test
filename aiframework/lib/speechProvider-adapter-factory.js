'use strict';

// Initializations
let GoogleSTAdapter = require('../voiceadapter/googleSTAdapter.js').GoogleSTAdapter;	
	
class SpeechProviderAdapterFactory{
	
	constructor(){
	}
	// Get an instance of legacy adapter
	getSpeechAdapter(speechProvider){
	
	// Create an instance of Serive First Legacy adapter	
	if('Google' === speechProvider){
		
		let googleSTAdapter = new GoogleSTAdapter();
		console.log(' GoogleST adapter ' + googleSTAdapter);
		return googleSTAdapter;
		
	}	
	
  }
	
}

module.exports.SpeechProviderAdapterFactory = SpeechProviderAdapterFactory;