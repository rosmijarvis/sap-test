'use strict';

let PropertiesReader = require('properties-reader');

let SocketInterface = require('../../lib/socket-interface.js').SocketInterface;
let exceptionEvents = require('../../lib/exceptionEmitter.js').ExceptionEvents;
let logger = require("../../config/logger.js");
let properties = PropertiesReader('../config/shared-properties.js');


class JarvisVoice
{
	constructor()
	{   

	}		
	
	
	connectJarvisServer()
	{	
		//create socket client to jarvis AI
		let socketInterface = new  SocketInterface();
		let socketToJarvis = socketInterface.createVoiceClientSocket(); 
		let eventEmitter = exceptionEvents.getEventEmitter();
		//return socketToJarvis;
				
		let  clientSocketTimeOut = properties.get('appServer.jarvisSocketTimeOut');
		socketToJarvis._connectTimer = setTimeout(function() {
		//socketToJarvis.close();
			eventEmitter.emit('exception',' Audio ChatServer unable to connect with Jarvis server in ' + clientSocketTimeOut + 'sec');
		}, clientSocketTimeOut); 
		
		
		socketToJarvis.on('connect', function() {
			//console.log('client connected happily');
		}); 
		
		socketToJarvis.on('error', function(error) {
			eventEmitter.emit('exception',' Audio ChatServer unable to connect with Jarvis server '+error);
		});
		
		return socketToJarvis;
	}
	
	
}

//let JarvisTextObj = new JarvisText();
module.exports.JarvisVoice = JarvisVoice;