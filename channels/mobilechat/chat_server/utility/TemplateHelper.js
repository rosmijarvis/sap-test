var _ = require("underscore"), fs = require("fs");

/**
 * Get html template
 *
 * @param {String} templatePath Path to your template
 * @param {Object} data Data
 * @return {String} html
 */
exports.getHtml = function(templatePath, data) {
	templatePath = "./views/" + templatePath;
	templateContent = fs.readFileSync(templatePath, encoding = "utf8");
	return _.template(templateContent, data, {
		interpolate : /\{\{(.+?)\}\}/g
	});
};
