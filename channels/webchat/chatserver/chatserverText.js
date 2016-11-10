'use strict';

let PropertiesReader = require('properties-reader');



let properties = PropertiesReader('../config/shared-properties.js');
let exceptionEvents = require('../lib/exceptionEmitter.js').ExceptionEvents;
let ServerTextAdapter = require('../features/text/serverText.js').ServerText;
let JarvisTextAdapter = require('../features/text/jarvisText.js').JarvisText;

let logger = require("../config/logger.js");

// Instance of user interactions
class ChatServerText
{
	constructor(mode)
	{   
	    
		logger.debug('chatserver about to start with Text as a channel...');
				
		let serverTextAdapter = new ServerTextAdapter();
		//serverTextAdapter.startChatServer(mode);
		this.socketServer = serverTextAdapter.startChatServer(mode);
		
		let jarvisTextAdapter = new JarvisTextAdapter();
		this.socketToJarvis = jarvisTextAdapter.connectJarvisServer();
	}	

	//manage chat server
	manageChatServer(channel)
	{
		
	  let self=this;
 	  let eventEmitter = exceptionEvents.getEventEmitter();
	
	  //if mode of sending information/channel is text
      if ('text' == channel)
	  { 	  
   
		  //listen for response events from jarvis this is written outside connection to prevent spawning of multiple listeners)
		  self.socketToJarvis.on('output-from-jarvis', function(data){
					logger.debug('chatserver receives response from jarvis with roomID ' + data.room + '|' + data.ip +' data '+ data.data);
					console.log('chatserver receives response from jarvis with roomID ' + data.room +  '|' + data.ip +' data '+ data.data);
					
					console.log('chatserver sends  response to client with roomID '+ data.room +'|'+data.ip);
					logger.debug('chatserver sends  response to client with roomID '+ data.room+'|'+data.ip);
					
					self.socketServer.in(data.room).emit('output-from-chatserver', data);
					
		  });
				
				

		  //chatserver on connection -> client connects to chatserver
		  self.socketServer.on('connection', function(socket)
		  {
				let roomId='';  
				let ip = socket.handshake.headers.host;
				
			    console.log('client connects to  chatserver  with connection id' + socket.client.conn.id);  
				//console.log('client connects to  chatserver  with connection id' + socket.client.conn.id +' '+socket.request.connection.remoteAddress +' '+socket.conn.remoteAddress + ' '+socket.handshake.headers.host + ' '+socket.handshake.address + ' '+ socket.conn.remoteAddress+' '+socket.request.client._peername.address);  
				logger.debug('client connects to  chatserver with connection id' + socket.client.conn.id);  

				//var sHeaders = socket.handshake.headers;
				//console.info('[%s:%s] CONNECT', sHeaders['x-forwarded-for'], sHeaders['x-forwarded-port']);
  			    //console.log('connection :', socket.request.connection._peername);
				//console.dir(socket);
				
				socket.on('room', function(room) {
					socket.join(room);
					console.log('client joins with roomID ' + room);  
					logger.debug('client joins with roomID ' + room);  
					roomId = room;
				});
				
				
				//chatserver receives data from client
				socket.on('input-to-chatserver', function(data){
					logger.debug('chatserver receives data from client with roomID ' + ' '+ roomId + '|'+ ip + ' data ' +data);  
					console.log('chatserver receives data from client  with roomID ' + ' '+ roomId + '|'+ ip+ ' data ' +data);  
									
					
					//self.socketToJarvis.emit('input-to-jarvis' , {data:data,room:roomId,ip:ip});
					
				    //check for jarvis running process 	
 				    if (self.socketToJarvis.connected)
					{	   
						   
						console.log("connected to jarvis");
						
						self.socketToJarvis.emit('input-to-jarvis' , {data:data,room:roomId,ip:ip});
						
						//send data to Jarvis	
						console.log('chatserver sends data to jarvis with roomID ' + roomId);
						logger.debug('chatserver sends data to jarvis with roomID ' + roomId);
			
                    }
					else
                    {
						console.log(" -- Not connected to jarvis -- ");
						
					
                         //console.log('Socket is not connected');
						 self.socketServer.in(roomId).emit('output-from-chatserver', {data:'Hi, there was an issue connecting with the chat server, please try again in some time',room:roomId});
						 logger.debug(roomId + '--Problem connecting from chat server to bot server for client with roomID ');

					}  							   
				});
				
				socket.on('error',function(error){
					logger.debug(roomId + '-'+ ip +' chatserver client socket encounters error ' +error);  
					eventEmitter.emit('exception','ChatServer unable to unable to connect with Jarvis server '+error);
				});
				
		  });	
	  
      } 
	  
	
  }
} 
module.exports.ChatServerText = ChatServerText;
