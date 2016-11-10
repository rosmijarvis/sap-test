/**
 * Helper for validation
 */

/**
 * Check email validation
 * @param {String} email
 * @return {boolean}
 */
exports.email = function(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

/**
 * Make errors
 * @param  {Array} errors
 * @return {Array}
 */
exports.makeErrors = function(errors) {
	var result = {};
	for ( var i in errors) {
		result[errors[i].param] = errors[i].msg;
	}
	return result;
};
