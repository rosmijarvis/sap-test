'use strict';
var HashMap = require('hashmap');

var userMap = new HashMap();
userMap.set("10608562", "Ajinkya Dharap");
userMap.set("10621211", "Sarang Dikshit");
userMap.set("10621066", "Johnson");
userMap.set("10635683", "Saurabh Herwadkar");

//Inventory Map
var inventoryMap = new HashMap();
inventoryMap.set("10608562", "Asset Number is INFARSZC90424");
inventoryMap.set("10621211", "Asset Number is INFARSZC92222");
inventoryMap.set("10621066", "Asset Number is INFARSZC92333");
inventoryMap.set("10635683", "Asset Number is INFARSZC92333");

class CampaignMgtResponseProcessor{
	
	constructor()
	{
	}
	
	// Pre process the message from channel
	preProcessMessage( message ){
		return message.text;
	}
	
	// Post process and enrich the AI response as desired
	postProcessResponse(message, response,aiResponse){
        //User Map		
		
		console.log("aiResponse.action   >>>>>>>>>>>>>>>> "+aiResponse.action);
		console.log("aiResponse ====== "+response);
		var enrichedResponse = response;	
		var attachments='';
		if(aiResponse.action== "electronics")
		{
			attachments=
			{				
				'attachments':
				[
					{
						'pretext': '',
						'title': 'Here are the offers! I hope you find something you like. Remember, if you provide your feedback , I can offer you even more personalized coupons. Enjoy!',
						//'title_link': 'https://api.slack.com/',
						"fields": [
							{
								"title": "Buy a Hair Dryer",
								"value": "Get a Straightner free",
								"short": true
							},
							{
								"title": "Buy 2 air-conditioners",
								"value": "Get a discount of 20%",
								"short": true
							}
						],
						'color': '#7CD197'
					}              
				]
			};
			enrichedResponse = attachments;
		}
		else if(aiResponse.action== "electronics.n")
		{
			
			attachments=
			{
				
				'attachments':
				[
					{
						'pretext': '',
						'title': 'Hey don\'t  worry, I have more Electronic offers for you below! I know you\'ll find something you want.',
						//'title_link': 'https://api.slack.com/',
						"fields": [
							{
								"title": "Buy a 4K TV",
								"value": "Get a Blu Ray player for free",
								"short": true
							},
							{
								"title": "Samsung Refrigerator",
								"value": "Get discount of 30%",
								"short": true
							}
						],
						'color': '#7CD197'
					}              
				]
			};
			enrichedResponse = attachments;
		}
		else if(aiResponse.action== "user.query")
		{
			
			attachments=
			{
				
				'attachments':
				[
					{
						'pretext': '',
						'title': 'Here are some offers based on your past interests! Tell me if you want something more specific, I\'ll look out for offers relevant to that.',
						//'title_link': 'https://api.slack.com/',
						"fields": [
							{
								"title": "Garments",
								"value": "20% OFF",
								"short": true
							},
							{
								"title": "Shoes",
								"value": "10% OFF",
								"short": true
							},
							{
								"title": "Electronic Devices",
								"value": "5% OFF",
								"short": true
							},
							{
								"title": "Sports Gear",
								"value": "20% OFF ",
								"short": true
							}
							,
							{
								"title": "Computing Devices",
								"value": "15% OFF ",
								"short": true
							}
						],
						'color': '#7CD197'
					}              
				]
			};
			enrichedResponse = attachments;
		}
		else if(aiResponse.action== "computers")
		{		
			attachments=
			{
				
				'attachments':
				[
					{
						'pretext': '',
						'title': 'These offers below are going to blow your mind! Remember, if you provide your feedback , I can offer you more personalized coupons. Knock yourself out!',
						//'title_link': 'https://api.slack.com/',
						"fields": [
							{
								"title": "Buy a fully configured Desktop for $350",
								"value": "Use COUPON CODE # WEMSBS",
								"short": true
							},
							{
								"title": "Hard-Disk 1TB space",
								"value": "$19 only",
								"short": true
							}
						],
						'color': '#7CD197'
					}              
				]
			};
			enrichedResponse = attachments;
		}
		else if(aiResponse.action== "sports.n")
		{
			attachments=
			{
				
				'attachments':
				[
					{
						'pretext': '',
						'title': 'Don\'t worry, I have more Sports Gear offers for you. I\'m going to make sure we find something you like ;)',
						//'title_link': 'https://api.slack.com/',
						"fields": [
							{
								"title": "Buy a swimming pool kit",
								"value": "Get first month of membership FREE",
								"short": true
							},
							{
								"title": "Football signed by Tom Brady",
								"value": "",
								"short": true
							}
						],
						'color': '#7CD197'
					}              
				]
			};
			enrichedResponse = attachments;
		}
		else if(aiResponse.action== "sports")
		{
			attachments=
			{
				
				'attachments':
				[
					{
						'pretext': '',
						'title': 'Here are the best offers! Remember, if you provide your feedback , I can offer you more personalized coupons. Have fun!',
						//'title_link': 'https://api.slack.com/',
						"fields": [
							{
								"title": "Sports Gear",
								"value": "Discount on Lebron James Merchandise, Original 2007 NBA Finals Cavaliers Jersey for just $200 ",
								"short": true
							}
						],
						'color': '#7CD197'
					}              
				]
			};
			enrichedResponse = attachments;
		}
		else if(aiResponse.action== "user.request1")
		{
			attachments=
			{
				
				'attachments':
				[
					{
						'pretext': '',
						//'title': 'Hey , I found something which made me think of you. Look at the offer below. Isn\'t it perfect? Happy //shopping!',
						
						'title': 'Sorry , you did not like them.  I found something new , which could be of interest to you . Isn’t this better ?',
						//'title_link': 'https://api.slack.com/',
						"fields": [
							{
								"title": " Kids' Apparel",
								"value": "30% OFF",
								"short": true
							},
							{
								"title": "Women's Shoes",
								"value": "15% OFF",
								"short": true
							},
							{
								"title": "Electronic Devices",
								"value": "25% OFF on purchase of $300 and above",
								"short": true
							},
							{
								"title": "Sports Gear",
								"value": "Special Discount on Lebron James Merchandise",
								"short": true
							}
							,
							{
								"title": "Computing Devices",
								"value": "Buy one RAM and get 50% OFF on the other",
								"short": true
							}
						],
						'color': '#7CD197'
					}              
				]
			};
			enrichedResponse = attachments;
		}
		
		else if(aiResponse.action== "computer.n")
		{
			attachments=
			{
				
				'attachments':
				[
					{
						'pretext': '',
						'title': 'Relax, I still have a bucketload of brilliant deals. We\'re going to make sure we find you something awesome!',
						//'title_link': 'https://api.slack.com/',
						"fields": [
							{
								"title": " Get Norton Security For 2 years for just $40",
								"value": "Use COUPON CODE # NORTON2YR",
								"short": true
							},
							{
								"title": " Special Discount on Intel 5th Generation Processors $70",
								"value": "Use COUPON CODE # INTEL$70",
								"short": true
							}
						],
						'color': '#7CD197'
					}              
				]
			};
			enrichedResponse = attachments;
		}
		else if(aiResponse.action== "garments")
		{
			attachments=
			{
				
				'attachments':
				[
					{
						'pretext': '',
						'title': 'You\'re going to love these offers I have for you! Remember, if you provide your feedback , I can offer you more personalized coupons! Enjoy!',
						//'title_link': 'https://api.slack.com/',
						"fields": [
							{
								"title": " Women's Garments",
								"value": "20% OFF",
								"short": true
							},
							{
								"title": " Men's Garments",
								"value": "15% OFF",
								"short": true
							}
							,
							{
								"title": " Kids' Garments",
								"value": "25% OFF",
								"short": true
							}
							,
							{
								"title": " Special Discount on Camisoles",
								"value": "USE COUPON CODE # 15OFF",
								"short": true
							}
						],
						'color': '#7CD197'
					}              
				]
			};
			enrichedResponse = attachments;
		}
		else if(aiResponse.action== "garments.n")
		{
			attachments=
			{
				
				'attachments':
				[
					{
						'pretext': '',
						'title': 'Hold on, I still have some more offers for you! Let\'s make sure we find you something you like!',
						//'title_link': 'https://api.slack.com/',
						"fields": [
							{
								"title": "  Buy one pair of jeans",
								"value": "Get 20% off on the next one",
								"short": true
							},
							{
								"title": " Special Discount on suits for men",
								"value": "17% OFF",
								"short": true
							}
							,
							{
								"title": " Kids' Garments",
								"value": "25% OFF",
								"short": true
							}
							,
							{
								"title": " Special Discount on Camisoles",
								"value": "USE COUPON CODE # 15OFF",
								"short": true
							}
						],
						'color': '#7CD197'
					}              
				]
			};
			enrichedResponse = attachments;
		}
		else if(aiResponse.action== "shoes")
		{
			attachments=
			{
				
				'attachments':
				[
					{
						'pretext': '',
						'title': 'These offers are going to blow your mind! And remember, if you provide your feedback , I can offer you more personalized coupons. Have fun!',
						//'title_link': 'https://api.slack.com/',
						"fields": [
							{
								"title": "  Women's Shoes",
								"value": "Get 20% off",
								"short": true
							},
							{
								"title": " Men's Shoes",
								"value": "15% OFF",
								"short": true
							}
							,
							{
								"title": " Kids' Shoes",
								"value": "25% OFF",
								"short": true
							}
							,
							{
								"title": " Special Discount on Vans",
								"value": "USE COUPON CODE # 15OFF",
								"short": true
							}
						],
						'color': '#7CD197'
					}              
				]
			};
			enrichedResponse = attachments;
		}
		else if(aiResponse.action== "shoes.n")
		{
			attachments=
			{
				
				'attachments':
				[
					{
						'pretext': '',
						'title': 'Hey don\'t loose hope, i have more for you in this categotry. More Shoes Offers:',
						//'title_link': 'https://api.slack.com/',
						"fields": [
							{
								"title": " Buy one shoe pair",
								"value": "Get 20% off on the other one.",
								"short": true
							},
							{
								"title": " Special discount on the woman shoes.",
								"value": "25% OFF",
								"short": true
							}
							,
							{
								"title": " Kids Shoes",
								"value": "25% OFF",
								"short": true
							}
							,
							{
								"title": " Special Discount on Vans",
								"value": "USE COUPON CODE # 15OFF",
								"short": true
							}
						],
						'color': '#7CD197'
					}              
				]
			};
			enrichedResponse = attachments;
		}
		
		
		//smile:
		//'user.request1'
		
		return enrichedResponse;
	}
}

module.exports.CampaignMgtResponseProcessor = CampaignMgtResponseProcessor;

