'use strict';



class ChannelInterface{
	
	constructor()
	{   
	}	
 	
	// Factory method to intialize instance of Bot based on channel adapter option
	initalizeMediumInstance(configuration , conf)	{		
		
		console.log("configuration.channeladapter :: "+ configuration.channeladapter);
		console.log("configuration.mode :: "+ configuration.mode);
		console.log(JSON.stringify(conf, null, 3));
		
		// If HTML is the channel and text is the mode
		if( 'htmltext' === configuration.channeladapter )
		{
			var HtmlTextChannel = require('../channeladapter/webchat/features/htmltext/htmltextchannel.js').HtmlTextChannel;
			var htmltextchannel = new HtmlTextChannel(conf);
			var client = htmltextchannel.getMediumClient();
			return client;
			
		}
		// If html is the channel and voice is the mode
		else if( 'htmlvoice' === configuration.channeladapter ){
			
			var HtmlVoiceChannel = require('../channeladapter/webchat/features/htmlvoice/htmlvoicechannel.js').HtmlVoiceChannel;
			var htmlVoiceChannel = new HtmlVoiceChannel(conf);
			var client = htmlVoiceChannel.getMediumClient();
			return client;
			
		}
		// If slack is the channel and text is the mode
		else if('slack' === configuration.channeladapter && 'text' === configuration.mode)
		{
			var slacktextchannel = require('../channeladapter/webchat/features/slacktext/slacktextchannel.js');
			var client = slacktextchannel.getMediumClient(conf);
			return client;
		}
		// If mobile text is the channel
		else if('mobiletext' === configuration.channeladapter)
		{
			var MobileTextChannel = require('../channeladapter/mobilechat/features/mobiletext/mobiletextchannel.js').MobileTextChannel;
			var mobiletextchannel = new MobileTextChannel(conf);
			var client = mobiletextchannel.getMediumClient();
			return client;
		}
		
		
		else
		{
			// Other channel adapter options 
		}
	}
	
	
}

module.exports.ChannelInterface = ChannelInterface;