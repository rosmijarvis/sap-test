'use strict';
var mongodb = require('mongodb');


var MongoClient = mongodb.MongoClient;

var url = 'mongodb://localhost:27017/bots_framework';
 
var userId=''; 
var resultString; 
var firstName='';
var secondName='';
class CheckLoginDetails{


	constructor(){

	}

	validateUser(usernamePassed , passwordPassed, callBackFunction){

	MongoClient.connect(url, function (err, db) {
	if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
	} else {
    
    console.log('Connection established to', url);

    var collection = db.collection('user_details');

   
    collection.find({username: usernamePassed}).toArray(function (err, result) {
		
      if (err) {
        console.log(err);
      } else if (result.length) {
			console.log("Document exists");
			console.log('Password:',result[0].password);
			//console.log('id>>'+result[0]._id);
			
			userId = result[0]._id;
			firstName = result[0].firstname;
			secondName = result[0].secondname; 
			
			if(result[0].password==passwordPassed&&result[0].isactive=='y'){
				resultString="Success";
				callBackFunction(resultString, userId,usernamePassed,firstName,secondName);
		}else{
			
			resultString="Failure";  
		    callBackFunction(resultString,userId,usernamePassed,firstName,secondName);
			
			
		}
		
		
      } else {
		resultString="Failure";  
		callBackFunction(resultString);
        //console.log('No document(s) found with defined "find" criteria!');
      }
   
      db.close();
    });
  }
});
}
}


module.exports.CheckLoginDetails = CheckLoginDetails;




