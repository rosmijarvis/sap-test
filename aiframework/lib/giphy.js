'use strict';

const giphy = require('giphy-api')();

class Giphy{
	getGiphy(mood, ratingLevel, callback){
		if(arguments.length>1){
			if(arguments.length == 2)
			{
				callback = arguments[1];
				ratingLevel = 'g';
			}
			giphy.random({
				tag: mood,
				rating: ratingLevel,
				fmt: 'json'
			}, function(err, res) {
				if(err){
					callback(null);
				}
				let slackJSON = {
					fallback: 'giphy: <' + res.data.image_url+ '>',
					image_url: res.data.image_url,
					image_width: res.data.image_width,
					image_height: res.data.image_height,
					is_animated: true,
					title: mood,
					id: 1,
					title_link: res.data.url 
				}
				callback(slackJSON);
			});
		}
	}
	
	getSticker(mood, ratingLevel, callback){
		if(arguments.length>1){
			if(arguments.length == 2)
			{
				callback = arguments[1];
				ratingLevel = 'g';
			}
			giphy.sticker({
				tag: mood,
				rating: ratingLevel,
				fmt: 'json'
			}, function(err, res) {
				if(error){
					callback(null);
				}
				let slackJSON = {
					fallback: 'giphy: <' + res.data.image_url+ '>',
					image_url: res.data.image_url,
					image_width: res.data.image_width,
					image_height: res.data.image_height,
					is_animated: true,
					title: mood,
					id: 1,
					title_link: res.data.url 
				}
				callback(slackJSON);
			});
		}
	}
}

module.exports.Giphy = Giphy;