'use strict';
var Client = require('node-rest-client').Client;
var request = require('sync-request'); 
	var client = new Client();
	var url = 'http://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=1778be812dd708d5430364c79cc6d5b4';
	var urlString = 'http://api.openweathermap.org/data/2.5/weather?q=';
	var appIdString = '&appid=1778be812dd708d5430364c79cc6d5b4';
class ServiceFirstLegacyAdapter{
	
constructor(){
	
	
	
	
}
	// A method to manage legacy integration
	manageLegacyIntegration(parameters, callBackFunction){
	
      //url = urlString + parameters.city + appIdString;
      var response = request('GET', url);
      
	  var responseJson = JSON.parse(response.getBody('utf8'));
	 
	 // console.log(responseJson.weather[0].description);
	  return responseJson.weather[0].description;
	
}	
	
	
	
	
}

module.exports.ServiceFirstLegacyAdapter = ServiceFirstLegacyAdapter;