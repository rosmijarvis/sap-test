'use strict';

//var logger = require("../logger.js");
var logger = require("../config/logger.js");
var events = require('events');
//var eventEmitter;

class ExceptionEvents{
	
	constructor()
	{
		// Create an eventEmitter object
		//this.eventEmitter = new events.EventEmitter();
		this.eventEmitter = new events.EventEmitter();
		
		// listener #1
		let eventListener = function eventListener(data) {
		logger.debug('exception event listner executed ' + data);
		
	    }
		this.eventEmitter.on('exception', eventListener);
	}	
	
	getEventEmitter()
    {
		//eventEmitter.emit('exception','!!!!!!!! testing for error !!!!!!!');
		return this.eventEmitter;
	}	
}

let ExceptionEventsObj = new ExceptionEvents();

//module.exports.ExceptionEvents = ExceptionEvents;
module.exports.ExceptionEvents = ExceptionEventsObj;