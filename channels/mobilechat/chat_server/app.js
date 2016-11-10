var express = require('express'),
    fs = require('fs')
    url = require('url');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('./utility/logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var mysql = require('mysql');
var config = require('./config');
var xmppServer = require('./xmpp/server');
var consolidate = require('consolidate');
var swig = require('swig');
var app = express();
var globalTunnel = require('global-tunnel');

var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('key.pem', 'utf8');
var certificate = fs.readFileSync('server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();
// process.env.http_proxy = 'http://52.27.0.146:8000';
// globalTunnel.initialize({
//   host: '52.27.0.146',
//   port: 8000
// });

// your express configuration here

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
httpServer.listen(8080);
httpsServer.listen(3000);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

/*tejaswini dashboard code*/
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
// app.set('view cache', false);
// swig.setDefaults({ cache: false });
var serveIndex = require('serve-index')

// Serve up public/ftp folder 
app.use('/logs', serveIndex('logs', {'icons': true}));

app.get('/logs/*', function(req, res, next){
  var path = __dirname + req.url;
  console.log(path);
  res.download(path, 'Log-File.log', function(err) {
        console.log(err);
        console.log(res.headersSent);
    });
});


app.use('/static', express.static(__dirname + '/public'));
/*tejaswini dashboard code*/

//create a db pool
// var pool  = mysql.createPool({
//     connectionLimit : 100,
//     host : config.database.host,
//     user : config.database.user,
//     password : config.database.password,
//     database : config.database.databaseName
// });
// store pool object in app.locals (for global access)
//app.locals.pool = pool;

logger.info("App is seriously starting...");
logger.info("App starting...");
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
//app.engine('.html', consolidate.swig);
app.engine('html', swig.renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator);
app.use(express.static(path.join(__dirname, 'public')));



// Add routes
require('./routes')(app); 

app.disable('x-powered-by');

//Invalid request URI or Invalid Method
app.get('/*', function(req, res, next) {
  res.json([ {
    status : "error",
    message : 'Invalid API request!'
  } ]);
});

app.use(function(err, req, res, next) {

    if (err instanceof Error) {
      res.send({
        status : "error",
        message : err.message
      });
    } else {
      res.send({
        status : err.status,
        message : err.message,
        errors : err.errors
      });
    }

});

logger.info("App started .");


//var GCM = require('node-gcm-ccs');
//var gcm = GCM('tchat-b6a12', 'AIzaSyDjp7utKCq-WyVA3vHo-vhRAGruEqkw1Fk');

//gcm.send(to, data, [options, callback(error, messageId, to)]);

// var xmpp = require('node-xmpp-client');

// var options = {
//   type: 'client',
//   jid: 'tchat-b6a12@gcm.googleapis.com',
//   password: 'AIzaSyBQfzoe0gDVTdf9aJoESn8nEksPyig2AgE',
//   port: 5235,
//   host: 'gcm.googleapis.com',
//   legacySSL: false,
//   preferredSaslMechanism : 'PLAIN'
// };

// console.log("Creating XMPP Application");

// var cl = new xmpp.Client(options);

// var json = '{"category":"com.example.yourapp", "data":{"hello":"f*ING world",},"message_id":"m-123","from":"REGID"}';

// var message = new xmpp.Stanza.Element('message').c('gcm', { xmlns: 'google:mobile:data' }).t(JSON.stringify(json));
// cl.send(message);
// console.log(message.toString());
// cl.on('online', function()
// {
//   events.emit('connected');
//   console.log("XMPP Online - Google");
// });
// cl.on('error', function(e) {
//   console.log(e);
// });

// var Sender = require('node-xcs').Sender;
// var Result = require('node-xcs').Result;
// var Message = require('node-xcs').Message;
// var Notification = require('node-xcs').Notification;

// var xcs = new Sender('tchat-b6a12', 'AIzaSyDjp7utKCq-WyVA3vHo-vhRAGruEqkw1Fk');

// var notification = new Notification("ic_launcher")
//     .title("Hello buddy!")
//     .body("Rajaram is awesome.")
//     .build();

// var message = new Message("messageId_1046")
//     .priority("high")
//     .dryRun(false)
//     .addData("node-xcs", true)
//     .addData("anything_else", false)
//     .addData("awesomeness", 100)
//     .deliveryReceiptRequested(true)
//     .notification(notification)
//     .build();

// var to = {};
// to.keys = '00000001@52.27.0.146';

// xcs.sendNoRetry(message, to, function (result) {
//     if (result.getError()) {
//         console.error(result.getErrorDescription());
//     } else {
//         console.log("message sent: #" + result.getMessageId());
//     }
// });



logger.info("App is running on - "+ config.url );

// start the XMPP Server
xmppServer.start({
  host: config.host,
  port: config.xmpp_port
})

//swig.init({ root: __dirname + '/views' });
