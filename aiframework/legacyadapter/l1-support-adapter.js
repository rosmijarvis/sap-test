'use strict';

// Initializations
var SFTicket = require('./create_sf_ticket.js').SFTicket;	
var sFTicket = new SFTicket();
var mysql = require("mysql");
var HashMap = require('hashmap');


class L1ServiceAdapter{
	
constructor(){
	
	
	
	
}
	// A method to manage legacy integration
	manageLegacyIntegration(aiResponse, callback){
	
      //url = urlString + parameters.city + appIdString;
  
	 // console.log(responseJson.weather[0].description);
	  
	  if(aiResponse.action === 'user_provides_ticket_priority'){
		  
		  console.log('Create ticket action');
		  var response='';
		  if(null != aiResponse && null != aiResponse.contexts){
			  
				var context1 = aiResponse.contexts[0];
				response= sFTicket.createSFTicket(context1.parameters.description);
				console.log("----->" + response);
			  
			  
		  }
		  
		  
		  return response;//aiResponse.responseText;
		  
		  
	  }else if(aiResponse.action === 'user_provides_ticket_no'){
		  
		  console.log('ticket status');
		  var response='';
		  if(null != aiResponse && null != aiResponse.contexts){
			  
			  var context1 = aiResponse.contexts[0];
			  response= sFTicket.sfTicketStatus(context1.parameters.ticket_no);
			  console.log("----->" + response);
			  
			  
		  }
		  
		  
		  return response;//aiResponse.responseText;
		  
		  
	  }else if(aiResponse.action === 'query_for_ticket_status'){
		/*  var con = mysql.createConnection({
       		 host: "localhost",
       		 user: "root",
        	 password: "admin",
        	 database: "bot"
        	 });
                con.query('SELECT ticket_number FROM ticket',function(err,rows){
  		if(err) throw err;

  		console.log('Data received from Db:\n');
  		console.log(rows);
		response = rows[0].ticket_number;
		  
		console.log("response============"+response);  
		return response;
		});*/

		  var tickets = ''; 
		  var response = '';
		  console.log('ticket numbers');
		  var returnedMap =  sFTicket.getTicketMap();
		  returnedMap.forEach(function(value, key) {
          console.log(key + " : " + value);
		  tickets = tickets + "<br>" +value;
          });
		  response = "Following are the recent tickets created by you in open state. Please specify the ticket number for which you wish to view the details <br><br>" + tickets;
		  return response;//aiResponse.responseText;
		  
		  
	  }

	  else{
		  
		  return aiResponse.responseText;
	  }
	  
}	
	
	
	
	
}

module.exports = L1ServiceAdapter;