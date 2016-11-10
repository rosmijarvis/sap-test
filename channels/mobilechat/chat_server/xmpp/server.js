var xmpp         = require('./index');
var logger       = require('../utility/logger');
var Router       = require('./modules/router');
var Registration = require('./modules/registration');
var Login       = require('./modules/login');
var Offline = require('./modules/offline');
var Ping       = require('./modules/ping');
var Roster = require('./modules/roster');
var Presence = require('./modules/presence');
var Search = require('./modules/search');
var GroupMessage = require('./modules/group');
var BroadcastMessage = require('./modules/broadcast');
var Status = require('./modules/status');
var Cron = require('./modules/cron');
var Gcm = require('./modules/gcm');
exports.start = function(config) {
    
    // Start the server.
    var server = new xmpp.C2S.TCPServer({
        port: config.port,
        domain: config.host
        // tls : {
        //     keyPath: '',
        //     certPath: ''
        // }
    });
    Gcm.configure(server);
    Router.configure(server); 
    Cron.configure(server);
    Registration.configure(server); 
	Registration.otp(server);
    Registration.changemobilenumber(server);
	Registration.password(server);
    Login.configure(server); 

    Offline.configure(server); 
    Ping.configure(server); 
    Roster.configure(server); 
    Presence.configure(server); 
    Search.configure(server);
    GroupMessage.configure(server);
    //Status.configure(server);
    //BroadcastMessage.configure(server);
    console.log('ok here');
    
    server.on("connect", function(client) {
        logger.info('XMPP server connected');     
    });

    server.on("disconnect", function(client) {
        if(client)
        {
            logger.info('XMPP server disonnected.');
            console.log(client);
        }
    });

    server.on('listening', function(){
        logger.info("XMPP Server is runnion on - "+ config.host + ":" + config.port);
    })

}

