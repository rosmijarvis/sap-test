'use strict'



// Initializations
var request = require('sync-request');
var mysql = require("mysql");
var HashMap = require('hashmap');
var map = new HashMap();

class SFTicket
{	
	constructor()
	{
		 var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "admin",
        database: "bot"
        });
		con.query('SELECT ticket_number FROM ticket order by ticket_id desc limit 5',function(err,rows){
					if(err) throw err;
                    map.clear();
					console.log('Data received from Db:\n');
					console.log(rows);
					//map = '';
					for (var i = 0; i < rows.length; i++) {
					var ticket = "ticket" + i;
					map.set(ticket,rows[i].ticket_number);
					console.log(rows[i].ticket_number);
					}
					
					});
		
	}

       
	getTicketMap(){
		
	return map;	
		
	}   
	
	// Create a SF ticket
	createSFTicket(issue)
	{
		
		 var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "admin",
        database: "bot"
        });
		console.log('Inside issue creation '+ issue );
		
		var currentDate= new Date(),
        dformat = [
    	    currentDate.getDate(),
    	    currentDate.getMonth()+1,
            currentDate.getFullYear()].join('/')+' '+
            [currentDate.getHours(),
            currentDate.getMinutes(),
            currentDate.getSeconds()].join(':');
    					
        var data = {
            productserialnumber:'IWF-2218766-01',
            critical:'yes',
            problemdescription:issue,
            problemcategory:'Ion Exchange Failure',
            initiationdate: dformat,
            initiatedsource:'BOT',
            initiatedby:'BOT',
            latitude:'19.1253061',
            longitude:'72.8918603'
        };
    
        var headers = {
            'Content-Type': 'application/json',
            'tenant_id':'lnt.ltimosaic.com',
            'cas_filter_user':'system',
            'user_desc': null,
        };
    
        var options = {
        	'url': 'http://119.81.38.133:8080/aftermarket-service-module/crteServices.do',
            'method': 'POST',
            'headers': headers,
			'json' : true,
			'body' : data
        };
	
	console.log('@@@@ Options : ' + JSON.stringify(options,null,3));

		var res = request('POST', 'http://119.81.38.133:8080/aftermarket-service-module/crteServices.do', {
 	  'headers'	: {
			'Content-Type': 'application/json',
			'tenant_id': 'lnt.ltimosaic.com',
			'cas_filter_user': 'system',
			'user_desc': null
		},json: data
});

 var response = JSON.parse(res.getBody('utf8'));
 //console.log(JSON.stringify(response,null,3));
 // console.log('Resposne is --> ' + response.srnumber);
 //return response.srnumber;

  var ticket= { ticket_number : response.srnumber };
  con.query('INSERT INTO ticket SET ?', ticket, function(err,res){
  if(err) throw err;

  console.log('Last insert ticket:', res.insertId);
  
  con.query('SELECT ticket_number FROM ticket order by ticket_id desc limit 5',function(err,rows){
					if(err) throw err;
                    map.clear();
					console.log('Data received from Db:\n');
					console.log(rows);
					//map = '';
					for (var i = 0; i < rows.length; i++) {
					var ticket = "ticket" + i;
					map.set(ticket,rows[i].ticket_number);
					console.log(rows[i].ticket_number);
					}
					
					});
  
  
  
  });
 return '<br><br>I have created a service desk ticket for you, please see below details <br><br><table style = "border: 1px solid black;"><tr style = "border: 1px solid black;"><td> Ticket number : </td><td><a href="https://lnt.ltimosaic.com" target="_blank"><font color ="blue">' + response.srnumber + '</font></a></td></tr><tr style = "border: 1px solid black;"><td>Issue details: </td><td>' + issue + '</td></tr></table><br><br><br> Can I help you with something else?';
 
}	
	
	
	
	sfTicketStatus(ticket_no){ 
		
		console.log('Inside ticket status call');
		
		let body = {
		srnumber : ticket_no
	   }
	   

	
	
   var res = request('POST', 'http://119.81.38.133:8080/aftermarket-service-module/getSRDetails.do', {
 	'headers'	: {
			'Content-Type': 'application/json',
			'tenant_id': 'lnt.ltimosaic.com',
			'cas_filter_user': 'system',
			'user_desc': null
		},json: body
});

   var responseString ='';
   var ticketDetails = JSON.parse(res.getBody('utf8'));
   console.log(ticketDetails.problemdetails);
   if(ticketDetails.problemdetails !=  null && ticketDetails.problemdetails != ''){
	   
		responseString = '<table style = "border: 1px solid black;"><tr style = "border: 1px solid black;"><td> Open date time: </td><td>' +  ticketDetails.opendatetime + '</td></tr><tr style = "border: 1px solid black;"><td> Is critical: </td><td>'
		+ ticketDetails.vip + '</td></tr><tr style = "border: 1px solid black;"><td> Status: </td><td>' + ticketDetails.status + '</td></tr><tr style = "border: 1px solid black;"><td> Ticket number: </td><td>'+ticket_no+'</td>  </tr><tr style = "border: 1px solid black;"><td> Ticket details: </td><td>' + ticketDetails.problemdetails  + '</td></tr></table><br><br><br> Can I help you with something else?';
   
   }
   else {
	   
	   responseString = 'No such ticket have been created by you. Please check ticket number that you have entered.<br> Can I help you with something else?'
   }
   
   return(responseString);
   
   

   
  	

	
		
		
		
	}
	
}




module.exports.SFTicket = SFTicket;