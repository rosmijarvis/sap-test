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
	

fetchDataFromElasticSearchForChat(query ){
		
	//Example POST method invocation 
//var Client = require('node-rest-client').Client;
var request = require('sync-request');
 
//var client = new Client();
var exactquery;


 

var res = request('POST', 'http://54.175.28.103:9200/sap/kedb-test-v2/_search', {
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

//console.log('&&&&&&&&&&&&&&&&&&'+ JSON.parse(res.getBody('utf8')));
var parsedResponse = JSON.parse(res.getBody('utf8'));
console.log('&&&&&&&&&&&&&&&&&&'+ JSON.stringify(parsedResponse) );

var answer='';
if(null !=parsedResponse && null != parsedResponse.hits && null != parsedResponse.hits.hits && parsedResponse.hits.hits.length > 0  ){


answer = parsedResponse.hits.hits[0]._source.answer;	


}else{

answer = 'Hi, there was an error retrieving your response, can you please try again in some time';

}


console.log('Answer is----------' +  answer);
return answer;		
	
}
}

module.exports.ElasticSearchAdapter = ElasticSearchAdapter;

