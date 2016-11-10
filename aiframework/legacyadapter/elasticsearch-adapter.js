'use strict'
/* var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200'
  //log: 'trace'
}); */

class ElasticSearchAdapter{
	
	
	constructor()
	{   
	
	}
	
	// fetch data from elastic search.
	fetchDataFromElasticSearchForUser(query ){
		
	//Example POST method invocation 
//var Client = require('node-rest-client').Client;
var request = require('sync-request');
 
//var client = new Client();
var exactquery;


 
// set content-type header and data as json in args parameter 
/*var args = {
    data: {
    "query": {
        "query_string": {
            "query": query,
            "fields": ["action"], 
			"minimum_should_match": "80%"
        }
    }
},
    headers: { "Content-Type": "application/json" }
};*/
 
/*client.post("http://localhost:9200/test/sscintegration_v2/_search", args, function (data, response) {
   
   
        console.log(data.hits.hits); //.hits.hits
		var responseText;
		if(null!=data && null != data.hits && null!=data.hits.hits){
			responseText=data.hits.hits[0]._source.answer;
		}
	
		( responseText );
		
	
    
});	*/
/*
var res = request('POST', 'http://localhost:9200/test/sscintegration_v2/_search', {
  json: args
});
*/
var res = request('POST', 'http://localhost:9200/test/user_info/_search', {
  json: 
  
  {
    "query": {
        "query_string": {
            "query": query,
            "fields": ["name"], 
			"minimum_should_match": "80%"
        }
    }
}
  
});

console.log('&&&&&&&&&&&&&&&&&&'+ JSON.parse(res.getBody('utf8')));
var parsedResponse = JSON.parse(res.getBody('utf8'));
var UserInfo = parsedResponse.hits.hits[0]._source;	
console.log('User Info Json is----------' +  JSON.stringify(UserInfo));
return UserInfo;		
	
}

fetchDataFromElasticSearchForChat(query ){
		
	//Example POST method invocation 
//var Client = require('node-rest-client').Client;
var request = require('sync-request');
 
//var client = new Client();
var exactquery;


 
// set content-type header and data as json in args parameter 
/*var args = {
    data: {
    "query": {
        "query_string": {
            "query": query,
            "fields": ["action"], 
			"minimum_should_match": "80%"
        }
    }
},
    headers: { "Content-Type": "application/json" }
};*/
 
/*client.post("http://localhost:9200/test/sscintegration_v2/_search", args, function (data, response) {
   
   
        console.log(data.hits.hits); //.hits.hits
		var responseText;
		if(null!=data && null != data.hits && null!=data.hits.hits){
			responseText=data.hits.hits[0]._source.answer;
		}
	
		( responseText );
		
	
    
});	*/
/*
var res = request('POST', 'http://localhost:9200/test/sscintegration_v2/_search', {
  json: args
});
*/
var res = request('POST', 'http://localhost:9200/test/viacom_data_v2/_search', {
  json: 
  
  {
    "query": {
        "query_string": {
            "query": query,
            "fields": ["action"], 
			"minimum_should_match": "80%"
        }
    }
}
  
});

console.log('&&&&&&&&&&&&&&&&&&'+ JSON.parse(res.getBody('utf8')));
var parsedResponse = JSON.parse(res.getBody('utf8'));
var answer = parsedResponse.hits.hits[0]._source.answer;	
console.log('Answer is----------' +  answer);
return answer;		
	
}
}

module.exports.ElasticSearchAdapter = ElasticSearchAdapter;

