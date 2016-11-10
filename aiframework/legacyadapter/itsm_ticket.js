'use strict'



// Initializations
//let request = require('request');

var request = require('sync-request');

class ITSMTicket
{	
	constructor()
	{	
	}
	
	// Create a SF ticket
	createITSMTicket(description)
	{
		
		//console.log(parameters.problemdescription);
		
		
         var headers = {
            'Content-Type': 'application/json'
                       };
    					
        var data = 
		   {
		   "tenantName":"demo",
		   "ticketid":"",
		   "username":"abrown",
		   "location":"Delhi",
		   "contactNo":"0825855558",
           "problemdescription":description, 
		   "operationalCategory":'',
		   "subCategory":"PayFast",
		   "impact":'High',
		   "urgency":'High',
		   "priority":'High',
           "priorityJustification":"",
		   "symptoms":"",
		   "reportingSource":"Email",
           "reportingSourceRemarks":"divya.desmukh@lntinfotech.com",
		   "currentStatus":"",
		   "alternateContact":"965362589",
           "assignedPerson":"",
		   "remarks":""};

         //http://10.105.1.206:8080/automationfirst-itsm_demo/rest/entity/createticketjson
    
        var options = {
        	'url': 'http://10.67.33.206:8080/automationfirst-itsm/rest/entity/createticketjson',
            'method': 'PUT',
            'json' : true,
			'body' : data
			
        };
	
	console.log('@@@@ Options : ' + JSON.stringify(data,null,3));
	
       var res = request('POST', 'http://10.105.1.206:8080/automationfirst-itsm/rest/entity/createticketjson', {
 	  'headers'	: headers,
	  json: data
});

   var response = JSON.parse(res.getBody('utf8'));
   console.log('Response is ---------' + response);		
		
   return response; 		
		
	}
	
}




module.exports.ITSMTicket = ITSMTicket;