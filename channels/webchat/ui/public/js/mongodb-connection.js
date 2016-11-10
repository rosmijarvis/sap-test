'use strict';

// Load properties
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./public/config/mongo-collections.js');

// Imports
var mongodb = require('mongodb');
var assert = require('assert');

// Instantiations
var MongoClient = mongodb.MongoClient;
//var url = 'mongodb://10.105.1.209:27017/bots_framework';

var url = 'mongodb://'+ properties.get('mongo-db-host') +':'+ properties.get('mongo-db-port') +'/' + properties.get('mongo-db-name') ;
//var messagesCollection = properties.get('bot-name') + '-' + properties.get('mongo-db-messages-collection');

var url;
var collection;

console.log('Mongo DB URL is -- ' + url);

class MongoConnection{
	
	constructor()
	{			
	}
	
	// Insert a message in collection
	insertMessageInCollection(message, messagesCollection,callbackFunction)
	{
		
		console.log("Message to push ###############" + message + " to collection "+ messagesCollection);
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			db.collection(messagesCollection).insert( message, function(err, result) {
				assert.equal(err, null);
				console.log('Inserted a message into collection ' + messagesCollection);
				callbackFunction(true);
				db.close();
			});
		});
	}
	
	//check if the session already exists
	
	
	// find the configuration for a Bot
	fetchBotConfiguration(botName, configurationCollection, callbackFunction)
	{
		var configuration='';
		console.log('Fetching the configuration for Bot : ' + botName);
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			//Fetch the bot configuration
			db.collection(configurationCollection).find({'botconfiguration.botname': botName}).toArray(function (err, result) {
				if (err) 
				{
					console.log(err);
				}
				else if (result.length) 
				{				
					// If result is not null and we have only one record for the configuration
					if(null != result && 1 == result.length)
					{
						configuration = result[0];
						console.log(configuration);
						// Invoke the passed callback function with the configuration as a parameter
						//callbackFunction(configuration);
					}
				}
				else 
				{
					console.log('No document(s) found with defined "find" criteria!');
					
				}
				callbackFunction(configuration);
				//Close connection
				db.close();
			});
		});		
	}
	
	// find the configuration for a Bot
	deleteBotConfiguration(botName, configurationCollection, callbackFunction)
	{		
		console.log('Deleting the configuration for Bot : ' + botName);
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			//Fetch the bot configuration
			db.collection(configurationCollection).deleteMany({'botconfiguration.botname': botName},function (err, result) {
				var metaDataDeleted=false;
				var configuration='';
				
				if(!err)
				{
					metaDataDeleted = true;
				}
				console.log("MetaDataDeleted for bot name :"+botName + " : "+metaDataDeleted);
				callbackFunction(metaDataDeleted);
				db.close();
			});
		});
	}	
	
	
	// find the configuration for a Bot
	
	updateInCollection(id, collection,timestamp,callbackFunction)
	{
		console.log("Updating the last transaction time field with :: "+new Date(timestamp)+" :: where the session ID is :: "+id);
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
		db.collection(collection).update({_id: id}, {$set: {lastTransactionDatetime: new Date(timestamp)}}, function (err, numUpdated) {
		if (err) {
				console.log(err);
		} else if (numUpdated) {
				console.log('Updated Successfully %d document(s).', numUpdated);
		} else {
				console.log('No document found with defined "find" criteria!');
		}
			//Close connection
			db.close();
		});
		});
	}
	
	
	updateSessionIdCollection(id, collection,sessionId)
	{
		console.log("Updating the sessionId field where user Id is  :: "+id+" :: with :: "+sessionId);
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
		db.collection(collection).update({_id: id}, {$set: {sessionID: sessionId}}, function (err, numUpdated) {
		if (err) {
				console.log(err);
		} else if (numUpdated) {
				console.log('Updated Successfully %d document(s).', numUpdated);
		} else {
				console.log('No document found with defined "find" criteria!');
		}
			//Close connection
			db.close();
		});
		});
	}
	

	
}


	



module.exports.MongoConnection = MongoConnection;
