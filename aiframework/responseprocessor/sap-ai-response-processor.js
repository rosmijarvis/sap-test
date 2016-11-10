'use strict';

class SAPAIResponseProcessor{
	
	constructor()
	{
	}
	
	// Pre process the message from channel
	preProcessMessage( message )
	{
		return message.text;
	}
	
	// Post process and enrich the AI response as desired
	postProcessResponse(message, response,aiResponse)
	{
        console.log("aiResponse ====== "+response);
		var enrichedResponse = response;		
		return enrichedResponse;
	}
}

module.exports.SAPAIResponseProcessor = SAPAIResponseProcessor;
