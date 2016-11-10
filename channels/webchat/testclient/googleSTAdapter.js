'use strict';

//invoke google speech to text @ 44Khz
var request = require('request');
var fs = require('fs');
var options = {
  url: 'https://www.google.com/speech-api/v2/recognize?output=json&lang=en-us&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw&client=chromium&maxresults=6&pfilter=2',
  headers: {
    'User-Agent': 'request',
	'Content-Type':'audio/l16; rate=44100',
	'AcceptEncoding':'gzip,deflate,sdch',
	'method':'POST'
  }
};


class GoogleSTAdapter {
	
	constructor(){
	}

	//invoke google speech to text @ 44Khz
	invokeGoogleSpeechToText( path, callback ){
		let directory="D:/software/aiframework/channels/webchat/chatserver/audio/";
		fs.createReadStream(directory+path).pipe(request.post(options, function(error,response,body){
		if (error != null)
			return callback(error,null);
		else
			return callback(null,body);
		})
		);
	}

	invokeGoogleSpeechToTextStream(stream, callback ){
		stream.pipe(request.post(options, function(error,response,body){
		if (error != null)
			return callback(error,null);
		else
			return callback(null,body);
			})
		);
	}
}

module.exports.GoogleSTAdapter = GoogleSTAdapter;

