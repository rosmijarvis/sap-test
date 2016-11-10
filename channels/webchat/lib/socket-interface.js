'use strict';

let BinaryServer = require('binaryjs').BinaryServer;
let io = require('socket.io-client');
let PropertiesReader = require('properties-reader');

let logger = require("../config/logger.js");
let properties = PropertiesReader("../config/shared-properties.js");


class SocketInterface{
	
	constructor()
	{   
	}	
	
	
	
	//accept audio stream
	receiveSocketStream(httpsServer)
	{
		console.log("start binary server for receiving stream audio information from client ");
		//chain on same ip,port of express server
		let binaryServer = new BinaryServer({ server: httpsServer });
		//let binaryServer = BinaryServer({ server: httpsServer });
		return binaryServer;
	}
	
	
	//for listening text information
	receiveSocketText()
	{
		console.log("start websocket server for receiving text information from client ");
		
		let webSocketIP = properties.get('appServer.webSocketIP');
		let webSocketPort = properties.get('appServer.webSocketPort');

		let server=require("socket.io").listen(webSocketPort);
		console.log("start chatserver socket server for receiving text information from client listening on port " + webSocketPort);
		logger.debug("start chatserver socket server for receiving text information from client listening on port " + webSocketPort);
		
		return server;
	}
	
	
		
	//for listening text information for https
	receiveSocketTextHttps(httpsSocketServer)
	{
		console.log("start websocket server for receiving text information from client ");
		
		let webSocketIP = properties.get('appServer.webSocketIP');
		let webSocketPort = properties.get('appServer.webSocketPort');

		//let server=require("socket.io").listen(webSocketPort);
		let server=require("socket.io").listen(httpsSocketServer);
		console.log("start chatserver socket server in secure mode for receiving text information from client listening on port " + webSocketPort);
		logger.debug("start chatserver socket server in secure mode for receiving text information from client listening on port " + webSocketPort);
		
		return server;
	}
	
	
	
	
	//for sending text information to Jarvis
	sendSocketText(data)
	{
		console.log("start socket client for sending text information to Jarvis");
		//chain on same ip,port of express server
		
		let webBotSocketIP = properties.get('appServer.webBotSocketIP');
		let webBotSocketPort = properties.get('appServer.webBotSocketPort');
		
		let socket = io('http://' + webBotSocketIP + ':' + webBotSocketPort);
		socket.emit('input-to-jarvis', data);
	}
	
	//creates client socket connection
	createClientSocket()
	{
		console.log("start socket client for sending text information to Jarvis");
		//chain on same ip,port of express server
		
		let webBotSocketIP = properties.get('appServer.webBotSocketIP');
		let webBotSocketPort = properties.get('appServer.webBotSocketPort');
		
		console.log('http://'+webBotSocketIP+':'+webBotSocketPort);
		let socket = io.connect('http://'+webBotSocketIP+':'+webBotSocketPort);
		return socket;
		
	}
	
	
	
	//creates client socket connection for voice
	createVoiceClientSocket()
	{
		console.log("start socket client for sending audio Stream information to Jarvis");
		//chain on same ip,port of express server
		
		let webBotSocketIP = properties.get('appServer.webBotSocketVoiceIP');
		let webBotSocketPort = properties.get('appServer.webBotSocketVoicePort');
		
		console.log('http://'+webBotSocketIP+':'+webBotSocketPort);
		let socket = io.connect('http://'+webBotSocketIP+':'+webBotSocketPort);
		return socket;
	}
	
	//for sending stream information to Jarvis
	sendSocketStream(stream)
	{
		console.log("start socket client for sending stream information to Jarvis");
				
		let webBotSocketIP = properties.get('appServer.webBotSocketVoiceIP');
		let webBotSocketPort = properties.get('appServer.webBotSocketVoicePort');
		
		let socket = io('http://'+webBotSocketIP+':'+webBotSocketPort);
		socket.emit('input-to-jarvis', stream);
	}
	
}

module.exports.SocketInterface = SocketInterface;