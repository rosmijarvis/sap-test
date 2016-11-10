'use strict';
// Load properties
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./config/properties.js');

// Imports and initalizations
var ChannelInterface = require('./channel-interface.js').ChannelInterface;

var channelInterface = new ChannelInterface();

var AIInterface = require('./ai-interface.js').AIInterface;

var aiInterface = new AIInterface();

var LegacyAdapterFactory = require('./legacy-adapter-factory.js').LegacyAdapterFactory;

var legacyAdapterFactory = new LegacyAdapterFactory();

var ResponseProcessorFactory = require('./response-processor-factory.js').ResponseProcessorFactory;

var responseProcessorFactory = new ResponseProcessorFactory();

// Instance of Mongo DB adapter
var MongoDBAdapter = require('./mongo-db-adapter.js').MongoDBAdapter;
var mongoDBAdapter = new MongoDBAdapter();

// Instance of Sessions adapter
var SessionsUtility = require('./sessions-utility.js').SessionsUtility;
var sessionsUtility = new SessionsUtility();


// Instance of Use interaction
var UserInteraction = require('./user-interaction-interface.js').UserInteraction;


const emogen = require('./emoticon_generator.js').getEmoticons;
const Giphy = require('./giphy.js').Giphy;
let giphy = new Giphy();

const LanguageIdentifier = require('./language_detect_ms.js').LanguageIdentifier;
let linguist = new LanguageIdentifier();

var logger = require('../config/logger.js');



// Instance of user interactions
class ConversationHandler
{
	
	
	
	constructor(passedConfiguration)
	{   
	    console.log('---x--Conversation constructor');

		console.log(JSON.stringify(passedConfiguration, null, 3));
		this.configuration = passedConfiguration;
		this.channelInterface = channelInterface.initalizeMediumInstance(this.configuration.botconfiguration.channelconfiguration, this.configuration);	
		this.aiController = aiInterface.getAiHandler( this.configuration.botconfiguration.aiadapterconfiguration );
		this.legacyController = legacyAdapterFactory.getLegacyAdapter( this.configuration.botconfiguration.legacyintegration );
		this.responseProcessorController = responseProcessorFactory.getResponseProcessAdapter( this.configuration.botconfiguration.responseprocessing );
		this.sessionsinformation = this.configuration.botconfiguration.sessionsinformation;
	   
	
	}
	
	// Manage user interaction
	manageConversation()
	{
		
		
	}
	
	
}


module.exports.ConversationHandler = ConversationHandler;
