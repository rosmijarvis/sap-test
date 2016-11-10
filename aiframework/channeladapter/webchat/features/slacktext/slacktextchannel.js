'use strict';


var Botkit = require('botkit');

// Instance of HTML channel adapter
class SlackTextChannel{
	
constructor(conf){
	
	this.conf  = conf;
	
}
	
	
	getMediumClient(){
		
		    let localConfiguration = this.conf; 
		    var controller = Botkit.slackbot();
			// connect the bot to a stream of messages and invoke it using a token
			controller.spawn({
				token: configuration.channeladaptertoken ,
			}).startRTM();	
			
			console.log("Invoking slack hears....");	
			var userInteraction =  new UserInteraction(this.configuration);			
			let localConfiguration = this.configuration;
			controller.hears('.*', ['direct_message','direct_mention','mention'] ,function(bot,message) {
				
				//console.log(message);
				var userId = message.channel + '_' + message.team + '_' + message.user;
		
				console.log("Recieved message in Slack channel" );
				sessionsUtility.manageUserSession( 
				userId 
				,localConfiguration.botconfiguration.sessionsinformation
				, message 
				, bot 
				, userInteraction
				, channelAdaptor);
				
			});	
		
		
	}
	
	
}	
	
	
	
	


module.exports.SlackTextChannel = SlackTextChannel;