var Message = require("../tables/message.js").Message,
    config = require('../config.js'),
    logger = require('../utility/logger'),
    self = this;

this.getMessages = function(req, res, next){

    logger.info('Controller: executing getMessages() ');

    var message = new Message();

  	message.getMessages(req, function(error, result) {

        if(error){
        
            logger.error('Contoller: message: Error while getting - Error:' + JSON.stringify(error));
            res.render('messages', { count: 0});
        
        }else{

            res.render('messages', { count : 0 });

        }
          
    });

};
