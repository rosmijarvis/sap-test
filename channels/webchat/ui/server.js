'use strict';

var PropertiesReader = require('properties-reader');

var express = require('express');
var app = express();

var https = require('https');

var io;

var fs = require('fs');
var CheckLoginDetails = require('./checkLoginDetails.js').CheckLoginDetails;
var checkLoginDetails = new CheckLoginDetails();
var sharedProperties = PropertiesReader("../config/shared-properties.js");

var mongoProperties = PropertiesReader("./public/config/mongo-collections.js");
var loginCollection = mongoProperties.get('login-detail-collection');
var botname = mongoProperties.get('bot-name');
//var logoutCollection = mongoProperties.get('logout-detail-collection');

var MongoConnection = require('./public/js/mongodb-connection.js').MongoConnection;
var mongoConnection = new MongoConnection();

var objectId='';
var userName='';
var email='';
var firstName='';
var secondName='';
var newStatus='';

class UIServer
{
	constructor(mode)
	{   
	
		
var session = require('express-session');
		 
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

	var mongoLoginData = function(data) {
				console.log("login details captured. "+data);
			}

// Authentication and Authorization Middleware
var auth = function(req, res, next) {

  //console.log('inside auth function');	
	
  if (req.session && req.session.validUser)
    return next();
  else
    return res.sendStatus(401);
};
	    
		app.use(express.static('public'));
		
		app.get('/', function(req, res){
			res.sendFile('login.html', { root: "public" } );
		});
		
		app.get('/voice', auth, function(req, res){
			res.sendFile('jarvis-voice.html', { root: "public" } );
		});
		
		app.get('/text', auth, function(req, res){
			res.sendFile('jarvis-text.html', { root: "public" } );
		});
		
		app.get('/logout', function(req, res){
			
			req.session.destroy();
            //res.send("logout success!");
			var logoutData={"userId": objectId ,"timestamp":new Date(),"action":"logout","botname":botname};
					mongoConnection.insertMessageInCollection(logoutData , loginCollection, mongoLoginData );
			res.sendFile('login.html', { root: "public" } );
		});
				
		app.get('/login', function (req, res) {
  
			var status = 'failure';
  
			if(null !=req ){
			
			//console.log("request----->>"+ JSON.stringify(req));
			console.log("ajax call from server..");
  
			var email =  req.query.email;
			var password =  req.query.password;
	
			console.log("email  >> "+email+" password >>"+ password);
			
		
			
			var returnStatus = function(status, userId, user_name, firstName, secondName) {
				objectId = userId;
				email = user_name;
				newStatus=status;
				userName=firstName.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});;
				console.log('getting status of the login status.'+ status);
				console.log("object id : "+ userId);
				if(status==="Success") {
					
					var loginData={"userId":userId,"timestamp":new Date(),"action":"login", "botname":botname}
					req.session.validUser = true;
					console.log("Inside success>>>"+status);
					
					//res.sendFile('demo-template.html', { root: "public" });
					//io.emit('userId', userId);
					//io.emit('username', username);
					
					mongoConnection.insertMessageInCollection(loginData,loginCollection, mongoLoginData );
					res.redirect('voice');
					
				} else if (status==="Failure"){
					console.log("Inside failure>>>"+status);
					req.session.validUser = false;
					var failedLoginData={"userId":userId,"timestamp":new Date(),"action":"invalidLogin","botname":botname};
					mongoConnection.insertMessageInCollection(failedLoginData ,loginCollection, mongoLoginData );
					//res.send(status);
				    //res.sendFile('demo-template-login.html', { root: "public" });
					res.sendFile('login.html', { root: "public" });
				}
			}
			var checkLoginDetails = new CheckLoginDetails();
			if(null != email && null != password && email != '' && password != ''){
					console.log("username >> "+email+"password >> "+password);
					var status = checkLoginDetails.validateUser(email, password, returnStatus);
				
	  	
				}
	
  
			}
  
 
		});
		
		if ('secure' == mode)
		{
			let webAppsPort=sharedProperties.get('appServer.uiSocketPort');
			let httpsServer = https.createServer({
			key: fs.readFileSync('../certs/key.pem'),
			cert: fs.readFileSync('../certs/cert.pem')
			},app).listen(webAppsPort);
			
			io = require('socket.io')(httpsServer);
			io.on('connection', function(socket){
				console.log('a user connected');
			
				socket.on('login_msg', function(msg){
					console.log('message: ' + msg);
					socket.emit('userId',objectId);
					socket.emit('username',userName);
					socket.emit('status',newStatus);
				});
			
				socket.on('disconnect', function(){
					console.log('user disconnected');
				});
			});
			
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
		
