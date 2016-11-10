'use strict';

// Initializations
var DefaultResponseProcessor = require('../responseprocessor/default-response-processor.js').DefaultResponseProcessor;
var ServiceFirstResponseProcessor = require('../responseprocessor/service-first-response-processor.js').ServiceFirstResponseProcessor;	
var CampaignMgtResponseProcessor = require('../responseprocessor/campaignmgt-response-processor.js').CampaignMgtResponseProcessor;	
var SAPAIResponseProcessor = require('../responseprocessor/sap-ai-response-processor.js').SAPAIResponseProcessor;	

class ResponseProcessorFactory{
	
	constructor()
	{		
	}
	
	// Get an instance of legacy adapter
	getResponseProcessAdapter(configuration){	
		
		if(null === configuration.responseprocessadapter || 'undefined' ===configuration.responseprocessadapter 
		|| ''===configuration.responseprocessadapter || 'none' === configuration.responseprocessadapter){
			
			var defaultResponseProcessor = new DefaultResponseProcessor();
			console.log('There is no response process adapter');			
			return defaultResponseProcessor;
			
		}		
		else if('servicefirstresponseprocessadapter' === configuration.responseprocessadapter)
		{
			console.log(' Service First response adapter');
			var serviceFirstResponseProcessor = new ServiceFirstResponseProcessor();
			return serviceFirstResponseProcessor;
		}
		else if('campaign_mgt_response_processor' === configuration.responseprocessadapter)
		{
			console.log(' Campaign Mgt response processor');
			var campaignMgtResponseProcessor = new CampaignMgtResponseProcessor();
			return campaignMgtResponseProcessor;
		}	
		else if('sap_ai_response_processor' === configuration.responseprocessadapter)
		{
			console.log(' SAP AI response processor');
			var sapAIResponseProcessor = new SAPAIResponseProcessor();
			return sapAIResponseProcessor;
		}		
	}	
}

module.exports.ResponseProcessorFactory = ResponseProcessorFactory;