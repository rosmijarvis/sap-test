'use strict'



// Initializations
var ApiAiInterface = require('../aiadapter/api-ai-interface.js').ApiAiInterface;

class AIInterface
{	
	constructor()
	{	
	}
	
	// Get the correct AI handler based on passed parameter
	getAiHandler(configuration)
	{
	   	if('apiai' === configuration.aiadapter)
		{			
			var apiaiInterface = new ApiAiInterface( configuration.aiadaptertoken);
			return apiaiInterface;
		}
	}	
}


module.exports.AIInterface = AIInterface;