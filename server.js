'use strict';

var PropertiesReader = require('properties-reader');
var express = require('express');
var app = express();
var https = require('https');
var fs = require('fs');
var sharedProperties = PropertiesReader("./channels/webchat/config/shared-properties.js");

var option='';

/* process.argv.forEach(function (val, index, array) 
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
}); */
  
		app.use(express.static('public'));
		
		/* if ('secure' == option)
		{
			let webAppsPort=sharedProperties.get('appServer.uiSocketPort');
			let httpsServer = https.createServer({
			key: fs.readFileSync('./channels/webchat/certs/key.pem'),
			cert: fs.readFileSync('./channels/webchat/certs/cert.pem')
			},app).listen(webAppsPort);
			
			var host = httpsServer.address().address
			var port = httpsServer.address().port

			console.log("UI component listening in secure mode at https://%s:%s", host, port)
		}
		else */
		//{
			var server = app.listen(sharedProperties.get('appServer.uiSocketPort') , function () {
			var host = server.address().address
			var port = server.address().port
			console.log("UI component listening at http://%s:%s", host, port)
			})
		//}
			
		
		
