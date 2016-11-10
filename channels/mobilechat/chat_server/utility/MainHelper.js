/**
 * Main helper
 */

var crypto = require("crypto");

/**
 * Get random string for tokens
 * @return {String} Token
 */
exports.randomToken = function() {
	var buf = crypto.randomBytes(16)
	return buf.toString('hex')
}

/**
 * Get random Number
 * @return {Number}
 */
exports.randomNumber = function(){
	var buf = crypto.randomBytes(5);
	return buf.toString('hex');
};
