var MongoDBAdapter = require('../lib/mongo-db-adapter.js').MongoDBAdapter;

var mongoDBAdapter = new MongoDBAdapter();

// htmltext htmlvoice slacktext
  
  var message1 = {
	  
  

 "botconfiguration":{
  
  "botname":"testbot",
  "isactive":"Y",
  "category":"General",
  "messagescollection":"testbot-messages-collection",
 
  "channelconfiguration":{
  "channeladapter":"htmlvoice",
  "channeladaptertoken":"xoxb-51098577349-L5z7MuUbWJt9UbFDHjDS12Wm",
  "channelinteractionverbs": "['direct_message','direct_mention','mention']",
  "channelemptyresponsetext": "I am still learning, I did not understand what you meant",  
  "mode":"voice"
  },
  
  "aiadapterconfiguration":{
  "aiadapter":"apiai",
  "aiadaptertoken":"997f4790ab1b4e598c9fd9a27ceb6efd"

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
   "languagetoken":"997f4790ab1b4e598c9fd9a27ceb6efd"} 
  ]	,

  "sessionsinformation":{
  
      "sessionscollection":"testbot-sessions-collection",
	  "sessionstimeoutinminutes": 30
  
  
  }  
   
  
  }
  
  }
   
//mongoDBAdapter.deleteBotConfiguration('mycroft', 'bot-configuration');  
mongoDBAdapter.insertMessageInCollection(message1, 'bot-configuration');
//mongoDBAdapter.fetchBotConfiguration('mmcbot','bot-configuration', null);
   
	