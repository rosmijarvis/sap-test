'use strict';

var PropertiesReader = require('properties-reader');
var express = require('express');
var app = express();
var https = require('https');
var fs = require('fs');
var sharedProperties = PropertiesReader("../wwwroot/channels/webchat/config/shared-properties.js");


class UIServer
{
	constructor(mode)
	{   
		app.use(express.static('public'));
		
		if ('secure' == mode)
		{
			let webAppsPort=sharedProperties.get('appServer.uiSocketPort');
			let httpsServer = https.createServer({
			key: fs.readFileSync('../wwwroot/channels/webchat/certs/key.pem'),
			cert: fs.readFileSync('../wwwroot/channels/webchat/certs/cert.pem')
			},app).listen(webAppsPort);
			
			var host = httpsServer.address().address
			var port = httpsServer.address().port

			console.log("UI component listening in secure mode at https://%s:%s", host, port)
		}
		else
		{
			var server = app.listen(sharedProperties.get('appServer.uiSocketPort') , function () {
			var host = server.address().address
			var port = server.address().port
			console.log("UI component listening at http://%s:%s", host, port)
			})
		}
			
	}
		
} 
module.exports.UIServer = UIServer;	
		
