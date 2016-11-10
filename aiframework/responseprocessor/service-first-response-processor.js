

'use strict';

class ServiceFirstResponseProcessor{

constructor(){


}


// Pre process the message from channel
// Input is a message object and response is a String

preProcessMessage( message ){


// By default return the message text
return message.text;

}

// Post process and enrich the AI response as desired
// Input is message and 

postProcessResponse(message, aiResponse, responseText){




// By default return the response text
return responseText;

}





}

module.exports.ServiceFirstResponseProcessor = ServiceFirstResponseProcessor;