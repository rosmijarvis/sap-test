var logger = require('../utility/logger');

exports.query = function(pool, queryString, dataObject, callback) {

       logger.info("DB.query - queryString :" + queryString);
       logger.info("DB.query - dataObject :" + JSON.stringify(dataObject));

       pool.getConnection(function(err, db) {
          if (err){
              logger.error("DB.query - connection execution error :" + JSON.stringify(err));
          	  return callback(err, null);
           }

           db.query(queryString, dataObject, function(err, rows, fields) {
              db.release();
              if (err){
                  logger.error("DB.query - query execution error :" + JSON.stringify(err));
              	  callback(err,null);
              }else{
                   callback(null, rows);
              }

           });
       });

}
