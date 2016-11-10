var  _mysql = require('mysql'),
		config = require('../config.js');

/**
 * Database singletone class
 */
var Database = function Database() {
		//defining a var instead of this (works for variable & function) will create a private definition
		this.mysql = _mysql.createConnection({
			host : config.database.host,
			user : config.database.user,
			password : config.database.password
		});

		this.mysql.query('USE `' + config.database.databaseName + '`');

		if (Database.caller != Database.getInstance) {
			throw new Error("This object cannot be instanciated");
		}
};

Database.instance = null;

/**
 * Database getInstance definition
 * @return {Database} class
 */

Database.getInstance = function() {

		if (this.instance === null) {
			this.instance = new Database();
		}
		return this.instance;

};

module.exports = Database.getInstance();
