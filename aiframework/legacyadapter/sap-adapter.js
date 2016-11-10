'use strict'

var HashMap = require('hashmap');

var ElasticSearchAdapter = require('./elastic-adapter.js').ElasticSearchAdapter;
var elasticSearchAdapter = new ElasticSearchAdapter();

var substring = "_db_action";
//var string = "payment_proposal_is_not_complete_db_action";

class SapAdapter{
	
constructor(){
	
}
	// A method to manage legacy integration
	manageLegacyIntegration(aiResponse, callback){
	
      //url = urlString + parameters.city + appIdString;
  
           var string = aiResponse.action;
         // var string = "payment_proposal_is_not_complete_db_action";   
	   console.log("ai response action from sap adapter----"+aiResponse.action);
	  
	  if(string.indexOf(substring) > -1){
		  
		  console.log('Elastic search action');
		  //var response='';
		  var response = elasticSearchAdapter.fetchDataFromElasticSearchForChat(string);
		  
		  //callback(response);

		  console.log('response +++'+ response);
		  return response;//aiResponse.responseText;
		  
		  
	  }	  else{
		  
		  return aiResponse.responseText;
	  }
	  
}		
}

module.exports = SapAdapter;