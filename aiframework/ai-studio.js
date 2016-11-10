'use strict';

console.log('--Program begins--');

// Load the properties file
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./config/properties.js');

// Instance of Mongo DB adapter
var MongoDBAdapter = require('./lib/mongo-db-adapter.js').MongoDBAdapter;
var mongoDBAdapter = new MongoDBAdapter();

// Load an instance of user interaction
var ConversationHandler = require('./lib/conversation-handler.js').ConversationHandler;

// Fetch the configuration from Mongo DB


var botName='';

// Take the Bot name as a command line argument
process.argv.forEach(function (val, index, array) {	
	
	if(array.length == 2)
	{
		console.log("Please provide bot name to initialize!!!!");
		process.exit(1);
		return;			
	}
	
	// Take the bot name as a parameter
	if(index === 2)
	{
		botName = val;
		console.log("Initializing Bot : " + index);
	}
});

// Callback function to invoke Bots framework  
var invokeBotsFramework = function(configuration) 
{ 
    
	
    // Load the configuration
	if(configuration==null || configuration=='')
	{
		console.log('Configuration not found for bot name :  '+botName);		
		console.log('Please check the bot name or the configuration in database');		
	}
	console.log('Got configuration: ' + configuration);
	
	// Start a user interaction
	var conversationHandler =  new ConversationHandler(configuration); 
	conversationHandler.manageConversation(  );  
	
};


// Fetch the bot configuration and invoke the Bots framework based on configuration
mongoDBAdapter.fetchBotConfiguration(botName , properties.get('mongo-db-configuration-collection') , invokeBotsFramework);

console.log('--Program ends--');