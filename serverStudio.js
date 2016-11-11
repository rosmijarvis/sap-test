'use strict';
var UIServer = require('./channels/webchat/ui/server_01.js').UIServer;
var option='';

process.argv.forEach(function (val, index, array) 
{	
	
	//console.log(array.length + ' '+ val + ' '+index);
	
	if(array.length != 3)
	{
		console.log("Please provide option arg1 ( mode - secure/non-secure)");
		process.exit(1);
		return;			
	}

	// Take the bot name as a parameter
	
	if(index === 2)
	{
		option = val;
		
	}
});

var uiServer =  new UIServer(option);

//chatServer.manageChatServer(option);

