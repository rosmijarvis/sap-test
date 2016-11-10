'use strict';

let https = require('https');
let fs = require('fs');
let PropertiesReader = require('properties-reader');

let SocketInterface = require('../../lib/socket-interface.js').SocketInterface;
let exceptionEvents = require('../../lib/exceptionEmitter.js').ExceptionEvents;
let logger = require("../../config/logger.js");
let properties = PropertiesReader('../config/shared-properties.js');

class ServerVoice
{
	constructor()
	{   

	}		
		
	startChatServer(mode)
	{
		logger.debug('start chatserver in audio mode and listen for client connections');
		let socketServer=null;
		if ('secure' == mode)
		{	
			//start websocket server in secure mode		
			let webSocketPort = properties.get('appServer.webSocketVoicePort');
			console.log ('websocketport is ' + webSocketPort);
			
			let webSocketVoiceIP = properties.get('appServer.webSocketVoiceIP');
			console.log ('websocketVoiceip is ' + webSocketVoiceIP);
			
			
			let httpsSocketServer = https.createServer({
			key: fs.readFileSync('../certs/key.pem'),
			cert: fs.readFileSync('../certs/cert.pem')
			//requestCert: false,
			//rejectUnauthorized: false
			});
			
			let socketInterface = new  SocketInterface();
			socketServer=socketInterface.receiveSocketStream(httpsSocketServer); //8090
						
			//httpsSocketServer.listen(webSocketPort, "0.0.0.0");
			//httpsSocketServer.listen(webSocketPort);
			
			httpsSocketServer.listen(webSocketPort,webSocketVoiceIP);
			//logger.debug('start chatserver in audio mode ' + httpsSocketServer.address().address + ' '+httpsSocketServer.address().port);
			logger.debug('start chatserver in audio mode ');
		}
		else
        {
			//let socketInterface = new  SocketInterface();
			//let webSocketPort = properties.get('appServer.webSocketPort');
			//socketServer = socketInterface.receiveSocketText(); //8084
		}		
		return socketServer;
	}
	
}


//let ServerTextObj = new ServerText();
module.exports.ServerVoice = ServerVoice;