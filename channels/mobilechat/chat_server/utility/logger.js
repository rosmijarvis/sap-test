var path = require('path');
var winston = require('winston');
var _this = this;
var config_file = require('../config');

var transports = [];
transports.push(new (winston.transports.Console)());
transports.push(new winston.transports.DailyRotateFile({
    name: 'file#info',
    level: 'info',
    filename: path.join(__dirname, '../logs/main.log'),
    datePattern: '.MM-dd-yyyy'
}));
if(config_file.global.debug == 'true')
{
	transports.push(new winston.transports.DailyRotateFile({
	    name: 'file#verbose',
	    level: 'verbose',
	    filename: path.join(__dirname, '../logs/main.log'),
	    datePattern: '.MM-dd-yyyy'
	}));
}

var logger = new winston.Logger({ transports: transports });
module.exports = logger;
