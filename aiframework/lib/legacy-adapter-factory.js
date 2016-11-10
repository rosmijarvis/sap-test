

'use strict';

// Initializations
//var L1ServiceAdapter = require('../legacyadapter/l1-support-adapter.js').L1ServiceAdapter;	
	


class LegacyAdapterFactory{
	
	
	constructor(){
		
		
		
	}
	
	
	// Get an instance of legacy adapter
	getLegacyAdapter(legacyintegration){
	
    if(null === legacyintegration.legacyadapter || 'undefined' === legacyintegration.legacyadapter 
	|| '' === legacyintegration.legacyadapter || 'none' === legacyintegration.legacyadapter){
		
		console.log('There is no legacy adapter');
		
		return null
		
	}
	
	// Create an instance of Serive First Legacy adapter	
	/*	else if('L1ServiceAdapter' === legacyintegration.legacyadapter){
				
		console.log(' L1 Service legacy adapter');
		
		var l1ServiceAdapter = new L1ServiceAdapter();
		
		return l1ServiceAdapter;
		
	}*/
               else{
		  
		 	      		
		  var instance = new (require('../legacyadapter/sap-adapter.js'));
                                    
		  return instance;
		  
		  
	  }

	
		
	  }
	
	
}

module.exports.LegacyAdapterFactory = LegacyAdapterFactory;