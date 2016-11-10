'use strict';

let PropertiesReader = require('properties-reader');
let moment = require('moment');
let wav = require('wav');
let fs = require('fs');
let uuid = require('node-uuid');

let properties = PropertiesReader('../config/shared-properties.js');
let exceptionEvents = require('../lib/exceptionEmitter.js').ExceptionEvents;
let ServerVoiceAdapter = require('../features/voice/serverVoice.js').ServerVoice;
let JarvisVoiceAdapter = require('../features/voice/jarvisVoice.js').JarvisVoice;

let logger = require("../config/logger.js");

var HashMap = require('hashmap');
var map = new HashMap();


// Instance of user interactions
class ChatServerVoice
{
	constructor(mode)
	{   
	    
		logger.debug('chatserver about to start with Voice as a channel...');
							
		let serverVoiceAdapter = new ServerVoiceAdapter();
		//serverTextAdapter.startChatServer(mode);
		this.socketServer = serverVoiceAdapter.startChatServer(mode);
		
		let jarvisVoiceAdapter = new JarvisVoiceAdapter();
		this.socketToJarvis = jarvisVoiceAdapter.connectJarvisServer();
	}	
	
	

	//manage chat server
	manageChatServer(channel)
	{
		
	  let self=this;
 	  let eventEmitter = exceptionEvents.getEventEmitter();
	
	  //if mode of sending information/channel is text
      if ('voice' == channel)
	  { 	  
		  
		let channels = properties.get('appServer.channels')
		let sampleRate = properties.get('appServer.sampleRate');
		let bitDepth = properties.get('appServer.bitDepth');
		let filePath = properties.get('appServer.filePath');
		let audioFilePrefix= properties.get('appServer.audioFilePrefix');
	    let audioFiletype= properties.get('appServer.audioFiletype');
   
		self.socketServer.on('connection', function(client) {
        var userId='';			
		console.log('client connects to audio chatserver  with client id ' + client.id + ' '+client);  
		logger.debug('client connects to audio chatserver  with client id ' + ' '+client.id + ' '+ client);  
		
				
		
		
				//listen for response events from jarvis this is written outside connection to prevent spawning of multiple listeners)
				self.socketToJarvis.on('output-from-jarvis', function(data){
					
					logger.debug('chatserver receives response from jarvis with roomID ' + data.room + '|' + ' data '+ data.data);
					console.log('chatserver receives response from jarvis with roomID ' + data.room +  '|' + ' data '+ data.data);
					
					console.log('chatserver sends  response to client with roomID '+ data.room );
					logger.debug('chatserver sends  response to client with roomID '+ data.room);
					
					if(userId === data.room){
						client.send({
							sender:'Bot',
							message:data.data
						});
					}
				});
				
				
				client.on('stream', function(stream, meta) {
					
					console.log('Here::::::::::::::::::::::::::::::::');
					if(null == meta){
						
						console.log('Meta is null');
						
					}else{
						
						console.log('Meta is ::::::::::::::::::::::::::' + meta.guid);
						
					}
					
					
				   userId = meta.guid ; //map.get();
		
				   if(!map.has(userId) ){
					//userId = uuid.v1();
					console.log('client joins with roomID ' + userId);  
					console.log('Client id is---- ' + client.id);  
					logger.debug('client joins with roomID ' + userId);  	
					map.set( userId, client.id);
				    } 
					
					logger.debug('chatserver receives audio stream from client with  clientId '+ client.id +' ' + 'stream ID ' + ' '+ stream.id + ' '+'roomID '+ userId);  
					console.log('chatserver receives audio stream from client with clientId '+ client.id +' ' + 'stream ID ' + ' '+ stream.id + ' '+'roomID '+ userId);  
					
					let value = moment().format('YYYYMMDDhmmssa');
					let outFile = audioFilePrefix + value + '.'+audioFiletype;  
					
					let fileWriter = new wav.FileWriter(filePath+outFile, {channels: channels, sampleRate: sampleRate, bitDepth: bitDepth}); 
		
					//persist to file system
					stream.pipe(fileWriter);
	
			
					stream.on('end', function() {
						   fileWriter.end();
					
						   let socketStream = require('socket.io-stream');
						   let socketStreamObj = socketStream.createStream(); //data:'audio/'+outFile,room:client.id+"|"+stream.id}
			   
						    //check for jarvis running process 	
						   if (self.socketToJarvis.connected)
						   {	   
						   
							socketStream(self.socketToJarvis).emit('input-to-jarvis', socketStreamObj, {data:'audio/'+outFile,room:userId});
							fs.createReadStream('audio/'+outFile).pipe(socketStreamObj);

							logger.debug('chatserver sends audio stream to Jarvis with  clientId '+ client.id + ' streamId ' + ' '+ stream.id +  +' '+' roomID '+ userId);  
							console.log('chatserver sends audio stream to Jarvis with  clientId '+ client.id + ' streamId ' + ' '+ stream.id +  +' ' + ' roomID '+ userId);  
                           }
						   else
                           {
							   let jarvisError= properties.get('appServer.jarvisError')
							   let data=new Object();
							   data.data=jarvisError;
							   client.send({
									sender:'Bot',
									message: data.data + "||" + data.data
								});
						   }  							   
							
						   
						
					});
					
					//stream.on('data',function(dataRec){
					//	console.log('***************************guid from browser is 11111111 ' + dataRec.room);
					//});
					
				});	
	  
        }); 
				
					this.socketServer.on('error',function(error)
					{
					  console.log('chatserver in audio mode encounters an error ' + error);
					  logger.debug('chatserver in audio mode encounters an error ' + error);
					  eventEmitter.emit('exception',' Chatserver in audio mode encounters an error  ' + error);
					});
					
					
					
					
      } 
	  
	
  }
} 
module.exports.ChatServerVoice = ChatServerVoice;
