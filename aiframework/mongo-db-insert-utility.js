var MongoDBAdapter = require('./lib/mongo-db-adapter.js').MongoDBAdapter;

var mongoDBAdapter = new MongoDBAdapter();

// htmltext htmlvoice slacktext
  
  var message1 = {
	  
  

 "botconfiguration":{
  
  "botname":"sapbot",
  "isactive":"Y",
  "category":"General",
  "messagescollection":"sapbot-messages-collection",
 
  "channelconfiguration":{
  "channeladapter":"htmltext",
  "channeladaptertoken":"xoxb-51098577349-L5z7MuUbWJt9UbFDHjDS12Wm",
  "channelinteractionverbs": "['direct_message','direct_mention','mention']",
  "channelemptyresponsetext": "I am still learning, I did not understand what you meant",  
  "mode":"voice"
  },
  
  "aiadapterconfiguration":{
  "aiadapter":"apiai",
  "aiadaptertoken":"9c61d3036bfd45e8937ddc05aa2cb5a2"

  },
  
  "legacyintegration":{
  "legacyadapter":"none"
  },
  
  "responseprocessing":{
  "responseprocessadapter":"none"
  },
  
  "languages":
  [
  {"languagename":"english" , 
   "languagecode":"en" , 
   "languagetoken":"9c61d3036bfd45e8937ddc05aa2cb5a2"} 
  ]	,

  "sessionsinformation":{
  
      "sessionscollection":"sapbot-sessions-collection",
	  "sessionstimeoutinminutes": 5
  
  
  }  
   
  
  }
  
  }
   
//mongoDBAdapter.deleteBotConfiguration('mycroft', 'bot-configuration');  
mongoDBAdapter.insertMessageInCollection(message1, 'bot-configuration');
//mongoDBAdapter.fetchBotConfiguration('mmcbot','bot-configuration', null);
   
	