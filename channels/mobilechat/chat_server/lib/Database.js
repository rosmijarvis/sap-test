var _mysql = require('mysql'), 
	config = require('../config.js');

var mysql ;

module.exports.getConnection = function() {

    
    if ((module.exports.mysql) && (module.exports.mysql._socket)
            && (module.exports.mysql._socket.readable)
            && (module.exports.mysql._socket.writable)) {
        return module.exports.mysql;
    }
    console.log(((module.exports.mysql) ?
            "UNHEALTHY SQL CONNECTION; RE" : "") + "CONNECTING TO SQL.");
    console.log(config);
    mysql = _mysql.createConnection({
		host : config.database.host,
		user : config.database.user,
		//socketPath: '/tmp/mysql.sock',
		password : config.database.password,
		database : config.database.databaseName,
        charset: 'utf8mb4'
	});
    
    mysql.connect(function(err) {              			 	
        if(err) {                                    	 	
          console.log('ERRO WHEN CONNECTING TO DB:', err);	
          setTimeout(module.exports.getConnection, 2000); 	
        }else {											  	
            console.log("SQL CONNECT SUCCESSFUL.");		  	
        }                                                 
    });                                     
    
    mysql.on("close", function (err) {
    	console.log("SQL CONNECTION CLOSED.");
    	module.exports.getConnection();
    });
    
    mysql.on('error', function(err) {
        console.log('DB ERROR', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { 	
        	console.log("SQL CONNECTION ERROR: " + err);
        	module.exports.getConnection();  			
        } else {                                      	
          throw err;                                  
        }
    });
   
    module.exports.mysql = mysql;
    return module.exports.mysql;
}

// Open a connection automatically at app startup.
module.exports.getConnection();
