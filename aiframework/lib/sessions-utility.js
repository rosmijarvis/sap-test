
'use strict';

// Load dependencies

// Instance of Mongo DB adapter
var MongoDBAdapter = require('./mongo-db-adapter.js').MongoDBAdapter;
var mongoDBAdapter = new MongoDBAdapter();




// Class sessions utility
class SessionsUtility{
	
	constructor()
	{			
	}
	
	// Manage a user session
	manageUserSession( userId, sessionsInformation, data, medium, userInteraction, channelAdaptor)
	{
	
	
	              if( null != userId  || null != configuration){
					  
					  console.log('Inside session mangement');
					  //console.log('Sessions collection name' +    console.log(JSON.stringify(sessionsInformation, null, 3)));
					  this.checkIfTheUserExists(userId , sessionsInformation , data, medium , userInteraction, channelAdaptor);
					  
					  
					  
				  }else{
					  
					  console.log('There is an issue observed with sessions management');
					  logger.debug( 'There is an issue observed with sessions management' );  
					  // TODO - Add a logger here
					  
				  }
	
	}
	
	// Check if user exists
	checkIfTheUserExists(userId , sessionsInformation , data, medium, userInteraction, channelAdaptor){
		
		
		// this the callback function called after checking if the user exists or not
		var fetchesIfUserIDExists = function(response, callback)
		{   
		
		var captureLastTransactionTime = function(response)
		{
				
			var currentDate = new Date();
			
			var currentTime = currentDate.getTime();
				
			console.log("Response retrieved for last transaction date time :: " +JSON.stringify(response));
			
			var sessionId = response[0].sessionID;
			var lastTransactionTime = response[0].lastTransactionDatetime;
			console.log("Last transaction date time :: "+ lastTransactionTime);
			
			var minutesDifference = computeMinutesDifference(lastTransactionTime);
			console.log(" Difference in minutes is  :: "+ minutesDifference);

		    // If the session has expired
			if( minutesDifference > sessionsInformation.sessionstimeoutinminutes )
			{
				console.log("The session has been expired .. Please log in again");
				
				//destroy the session id and create a new one for the same user
				
					var update_random_session_id = generateRandomSessionID();
					console.log('Generating session Id for updation' + update_random_session_id)
								
					// Update the sessions ID in the DB			         
					mongoDBAdapter.updateSessionIdCollection(userId, sessionsInformation.sessionscollection , update_random_session_id);
					
					// Manage the user interaction
					userInteraction.manageUserInteraction(userId, data, medium, update_random_session_id, channelAdaptor);
				
						
			}
			// If the session has not expired
			else if( minutesDifference < sessionsInformation.sessionstimeoutinminutes)
			{
				
                console.log("Updated current time in collection");				
				// Update the last time in the DB
				mongoDBAdapter.updateInCollection(userId, sessionsInformation.sessionscollection  , currentTime);
				
				// Manage user interaction
				userInteraction.manageUserInteraction(userId, data, medium, sessionId, channelAdaptor);
	
			}
				
		} 
		      
		
		
			if(response)
			{
			
				//user exists - now fetch the session Id and last transaction time of the existing user to check if the session has expired or not - uses callback function "captureLastTransactionTime"
				console.log("This user exits .. fetching the sessionId of the user");
				mongoDBAdapter.fetchBotSessionID(
				userId, 
				sessionsInformation.sessionscollection, 
				captureLastTransactionTime);
			}
			else{
			
			//user does not exist, create a new user with a new randomly generated session id
			console.log("User Does not exist ..");
			
					// Create a session Id entry using a random 16 digit no
					var random_session_id = generateRandomSessionID();
					console.log("Random session id :: "+random_session_id);
					
						
						//creating the document for mongo
						var sessionIdEntry = {
		  
							"_id" : userId,
							"sessionID":random_session_id,
							"lastTransactionDatetime": new Date()
		  
							}
		  
							// Callback function - does nothing, may be required in the future
								var sessionCallBackFunction = function(){
			  
										console.log('Message inserted');
										//mongoDBAdapter.fetchBotUserID(userId, collectionName , fetchesIfUserIDExists);
				
									}
		  
							    // Insert the timestamp in the collection
								mongoDBAdapter.insertMessageInCollection(
										sessionIdEntry, 
										sessionsInformation.sessionscollection, 
										sessionCallBackFunction);
										
								// Continue the user interaction		
								userInteraction.manageUserInteraction(userId, data, medium, random_session_id, channelAdaptor);
      
			
			}
		
		}
		
		//fetches if the user Id is present , calls the callback "fetchesIfUserIDExists" with the result
		mongoDBAdapter.fetchBotUserID( userId , sessionsInformation.sessionscollection , fetchesIfUserIDExists);
	
	    var generateRandomSessionID = function(){
			
			return  Math.random() * 1E16;
			
		}
		
		
		 var computeMinutesDifference = function(lastTransactionTime){
			
			var currentDate = new Date();
			
			var currentTime = currentDate.getTime();
			console.log("Current Datetime :: "+currentTime);
			
			lastTransactionTime = lastTransactionTime.getTime();
			console.log("Last Transaction datetime :: " + lastTransactionTime);
			
			
			var difference = currentTime - lastTransactionTime;

		

			var minutesDifference = Math.floor(difference / 1000 / 60);
			difference -= minutesDifference * 1000 * 60
			
			return minutesDifference;
			
		}
	
	
	}
		
		
		
		
		
	}
	
	
	

module.exports.SessionsUtility = SessionsUtility;