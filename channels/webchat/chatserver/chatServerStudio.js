'use strict';
var ChatServerText = require('./chatserverText.js').ChatServerText;
var io = require('socket.io-client');

var mode ='';
var channel ='';

process.argv.forEach(function (val, index, array) 
{	
	
	if(array.length != 4)
	{
		//console.log("Please provide option (text or voice) as channel");
		console.log("Please provide option - arg1 ( mode - secure/non-secure) and  arg2 (channel - text/voice) ");
		
		process.exit(1);
		return;			
	}

	// Take the bot name as a parameter
	if(index === 2)
	{
		mode = val;
	}
	else if(index === 3)
	{
		channel = val;
	}
	
});

var chatServerText =  new ChatServerText(mode);
chatServerText.manageChatServer(channel);

