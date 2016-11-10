'use strict';

let https = require('https');
let fs = require('fs');
let PropertiesReader = require('properties-reader');

let SocketInterface = require('../../lib/socket-interface.js').SocketInterface;
//var ExceptionEvents = require('./lib/exceptionEmitter.js').ExceptionEvents;
let exceptionEvents = require('../../lib/exceptionEmitter.js').ExceptionEvents;
let logger = require("../../config/logger.js");
let properties = PropertiesReader('../config/shared-properties.js');

// Instance of user interactions
class ServerText
{
	constructor()
	{   

	}		
		
	startChatServer(mode)
	{
		logger.debug('start chatserver in Text mode and listen for client connections');
		let socketServer=null;
		if ('secure' == mode)
		{	
			//start websocket server in secure mode		
			let httpsSocketServer = https.createServer({
			key: fs.readFileSync('../certs/key.pem'),
			cert: fs.readFileSync('../certs/cert.pem')
			//requestCert: false,
			//rejectUnauthorized: false
			});
		
			let socketInterface = new  SocketInterface();
			let webSocketPort = properties.get('appServer.webSocketPort');
			socketServer = socketInterface.receiveSocketTextHttps(httpsSocketServer); //8084
			httpsSocketServer.listen(webSocketPort, "0.0.0.0");
		}
		else
        {
			let socketInterface = new  SocketInterface();
			let webSocketPort = properties.get('appServer.webSocketPort');
			socketServer = socketInterface.receiveSocketText(); //8084
		}		
		return socketServer;
	}
	
}


//let ServerTextObj = new ServerText();
module.exports.ServerText = ServerText;