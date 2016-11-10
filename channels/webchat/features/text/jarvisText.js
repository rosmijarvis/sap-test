'use strict';
let PropertiesReader = require('properties-reader');

let SocketInterface = require('../../lib/socket-interface.js').SocketInterface;
let exceptionEvents = require('../../lib/exceptionEmitter.js').ExceptionEvents;
let logger = require("../../config/logger.js");
let properties = PropertiesReader('../config/shared-properties.js');

class JarvisText
{
	constructor()
	{   

	}		
	
	
	connectJarvisServer()
	{	
		//create socket client to jarvis AI
		let socketInterface = new  SocketInterface();
		let socketToJarvis = socketInterface.createClientSocket(); //8081
		let eventEmitter = exceptionEvents.getEventEmitter();
		//return socketToJarvis;
				
		let  clientSocketTimeOut = properties.get('appServer.jarvisSocketTimeOut');
		socketToJarvis._connectTimer = setTimeout(function() {
		//socketToJarvis.close();
			eventEmitter.emit('exception',' Text ChatServer unable to connect with Jarvis server in ' + clientSocketTimeOut + 'sec');
		}, clientSocketTimeOut); 
		
		
		socketToJarvis.on('connect', function() {
			//console.log('client connected happily');
		}); 
		
		socketToJarvis.on('error', function(error) {
			eventEmitter.emit('exception',' Text ChatServer unable to connect with Jarvis server '+error);
		});
		
		return socketToJarvis;
				
		/*
		// set connect timer to 5 seconds
		let  clientSocketTimeOut = properties.get('appServer.clientSocketTimeOut');
		
		socketToJarvis._connectTimer = setTimeout(function() {
		//this.socketToJarvis.close();
			//eventEmitter.emit('exception','ChatServer unable to unable to connect to server');
		}, clientSocketTimeOut); 
		
		
		socketToJarvis.on('connect', function() {
			console.log('client connected happily');
		}); 
		
		socketToJarvis.on('error', function(error) {
			eventEmitter.emit('exception','ChatServer unable to unable to connect with Jarvis server '+error);
		});
		*/
	}
	
	
}

//let JarvisTextObj = new JarvisText();
module.exports.JarvisText = JarvisText;