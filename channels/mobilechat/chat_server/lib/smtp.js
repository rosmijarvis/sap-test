var nodemailer = require('nodemailer'),
    config = require('../config.js');

/**
 * Smtp singletone class
 */
var Smtp = function Smtp() {
	//defining a var instead of this (works for variable & function) will create a private definition
	this.transport = nodemailer.createTransport('smtps://'+config.smtp.user+':'+config.smtp.password+'@'+config.smtp.host);

	if (Smtp.caller != Smtp.getInstance) {
		throw new Error("This object cannot be instanciated");
	}
};

Smtp.instance = null;

Smtp.getInstance = function() {

	if (this.instance === null) {
		this.instance = new Smtp();
	}
	return this.instance;
};

module.exports = Smtp.getInstance();
