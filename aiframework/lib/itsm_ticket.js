'use strict'



// Initializations
let request = require('request');

class ITSMTicket
{	
	constructor()
	{	
	}
	
	// Create a SF ticket
	createITSMTicket( parameters, callback)
	{
		
		console.log(parameters.problemdescription);
		
		
         var headers = {
            'Content-Type': 'application/json'
                       };
    					
        var data = 
		   {"tenantName":"demo",
		   "ticketid":"",
		   "username":"abrown",
		   "location":"Delhi",
		   "contactNo":"0825855558",
           "problemdescription":parameters.problemdescription, 
		   "operationalCategory":parameters.operationalCategory,
		   "subCategory":"PayFast",
		   "impact":parameters.impact,
		   "urgency":parameters.urgency,
		   "priority":parameters.priority,
           "priorityJustification":"justification test a",
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
	
	console.log('@@@@ Options : ' + JSON.stringify(options,null,3));
	
	request(options, function(error, response, body){
		//console.log('@@@@ SF Create ticket BODY : ' + JSON.stringify(body,null,3));
		
		//console.log(body);
		console.log("Response is --------");
		//console.log(response);
		callback(response.body);
		
		
	});
	
		
		
		
	}
	
}




module.exports.ITSMTicket = ITSMTicket;