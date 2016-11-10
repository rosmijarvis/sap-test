var express = require('express');
var router = express.Router();
var logger = require('../utility/logger');
var message = require("../controllers/message");
var authentication = require("../controllers/authentication");
var validateHelper = require("../utility/ValidateHelper");
var config_file = require('../config');
var otplib = require('otplib');
var Config = require("../tables/config.js").Config;
var smtp = require("../lib/smtp").transport;
var Message = require("../tables/message.js").Message;
var ldap = require('ldapjs');
var express = require('express'),
    fs = require('fs')
    url = require('url');
var client_ldap = ldap.createClient({
    url: config_file.ldap.ip + ':' + config_file.ldap.port
});
var csv = require('csv-stream');
var request = require('request');
var multer  = require('multer');
var upload = multer({ dest: './public/uploads/' });

var session = require('express-session');
router.use(session({
	resave: false, // don't save session if unmodified
	saveUninitialized: false, // don't create session until something stored
	secret: 'shhhh, very secret'
}));

function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    req.session.error = 'Incorrect username or password';
    res.redirect('/');
  } else {
    next();
  }
}

router.get('/', function (req, res) {
	if(req.session.error)
		var error_login;
	if(req.session.user_id)
		delete req.session.user_id;
	var message = req.query.message?req.query.message:'';
	logger.verbose(error_login);
	res.render('login', { 
		message: message,
		error_login: error_login
	});
});
router.get('/logoutauth', function (req, res) {
	delete req.session.user_id;
  	res.redirect('/');
});
router.get('/changepassword',checkAuth, function (req, res) {
	var message = req.query.message?req.query.message:'';
	res.render('changepassword', {
		message: message,
		path: __dirname
	});
});
router.post('/changepasswordpost',checkAuth, function (req, res) {
	var update_variable = {
	    userPassword: req.body.password
	}
	var change = new ldap.Change({
		operation: 'replace',
		modification: update_variable
	});
	var config_dn = config_file.ldap.dn;
    var config_array = config_dn.split(',');
    config_array.shift();
    var config_final = config_array.join();

    client_ldap.bind(config_file.ldap.dn, config_file.ldap.password, function(err, result) {
		client_ldap.modify('uid='+req.body.username+',ou=Admin,'+config_final, change, function(err) {
			if(err)
			{
				logger.verbose(err);
				res.redirect('/changepassword?message=Error - Incorrect username/password');
			}
			else {
				res.redirect('/?message=Password changed');
			}
		});
	});
});
router.post('/changeusername',checkAuth, function (req, res) {
	
	var config_dn = config_file.ldap.dn;
    var config_array = config_dn.split(',');
    config_array.shift();
    var config_final = config_array.join();

    client_ldap.bind(config_file.ldap.dn, config_file.ldap.password, function(err, result) {
		client_ldap.modifyDN('uid='+req.body.old_username+',ou=Admin,'+config_final, 'uid='+req.body.new_username+',ou=Admin,'+config_final, function(err) {
			if(err)
			{
				logger.verbose(err);
				res.redirect('/changepassword?message=Incorrect old Username');
			}
			else {
				res.redirect('/?message=Username changed');
			}
		});
	});
});

router.post('/auth', function (req, res) {
	var post = req.body;
	var config_dn = config_file.ldap.dn;
    var config_array = config_dn.split(',');
    config_array.shift();
    var config_final = config_array.join();
	client_ldap.bind(config_file.ldap.dn, config_file.ldap.password, function(err, result) {
		if(err)
		{
			logger.verbose(err);
		}
        client_ldap.compare('uid='+post.user_name+',ou=Admin,'+config_final, 'userPassword', post.password, function(err, matched) {
		    if(err)
		    {
		    	res.redirect('/?message=Invalid creadentials.');
		    }
		    else {
			    if(!matched || matched == 'undefined')
			    {
			    	res.redirect('/?message=Invalid creadentials');
					if(req.session.user_id)
						delete req.session.user_id;
				} else {
					req.session.user_id = 1;
					res.redirect('/dashboardconfig');
				}
			}
		});
	});
});
router.get('/dashboardconfig', checkAuth, function (req, res) {
	var config = new Config();
	config.selectConfig(null, function(error, result) {
		if(result == '' || typeof result == 'undefined')
		{
			var result = [];
		}
		var fileList = __dirname + '/../config.js';
	    fs.readFile(fileList, function(err, data) {
	    	if(err) throw err;
	    	data = data.toString();
	    	var lines = data.split('\n');
	    	var result_config = {};
	    	for(var line = 0; line < lines.length; line++){
	    		if(lines[line].indexOf('this.smtp.host') > -1){
	    			result_config.host = lines[line].match(/'(.+)'/)?lines[line].match(/'(.+)'/)[1]:'';
	    		}
	    		if(lines[line].indexOf('this.smtp.password') > -1){
	    			result_config.password = lines[line].match(/'(.+)'/)?lines[line].match(/'(.+)'/)[1]:'';
	    		}
	    		if(lines[line].indexOf('this.smtp.user') > -1){
	    			result_config.user = lines[line].match(/'(.+)'/)?lines[line].match(/'(.+)'/)[1]:'';
	    		}
	    		if(lines[line].indexOf('this.links.support') > -1){
	    			result_config.email = lines[line].match(/'(.+)'/)?lines[line].match(/'(.+)'/)[1]:'';
	    		}
	    		if(lines[line].indexOf('this.ldap.dn') > -1){
	    			result_config.dn = lines[line].match(/'(.+)'/)?lines[line].match(/'(.+)'/)[1]:'';
	    		}
	    		if(lines[line].indexOf('this.ldap.password') > -1){
	    			result_config.ldappass = lines[line].match(/'(.+)'/)?lines[line].match(/'(.+)'/)[1]:'';
	    		}
	    		if(lines[line].indexOf('this.ldap.port') > -1){
	    			result_config.ldapport = lines[line].match(/'(.+)'/)?lines[line].match(/'(.+)'/)[1]:'';
	    		}
	    		if(lines[line].indexOf('this.ldap.ip') > -1){
	    			result_config.ldapip = lines[line].match(/'(.+)'/)?lines[line].match(/'(.+)'/)[1]:'';
	    		}
	    		if(lines[line].indexOf('this.ldap.ou') > -1){
	    			result_config.ou = lines[line].match(/'(.+)'/)?lines[line].match(/'(.+)'/)[1]:'';
	    		}
	    		if(lines[line].indexOf('this.global.email') > -1){
	    			result_config.global_email = lines[line].match(/'(.+)'/)?lines[line].match(/'(.+)'/)[1]:'';
	    		}
	    		if(lines[line].indexOf('this.global.domain') > -1){
	    			result_config.global_domain = lines[line].match(/'(.+)'/)?lines[line].match(/'(.+)'/)[1]:'';
	    		}
	    		if(lines[line].indexOf('this.global.logspan') > -1){
	    			result_config.global_logspan = lines[line].match(/'(.+)'/)?lines[line].match(/'(.+)'/)[1]:'';
	    		}
	    		if(lines[line].indexOf('this.gcm.gcm_api') > -1){
	    			result_config.gcm_api = lines[line].match(/'(.+)'/)?lines[line].match(/'(.+)'/)[1]:'';
	    		}
	    		if(lines[line].indexOf('this.gcm.gcm_package') > -1){
	    			result_config.gcm_package = lines[line].match(/'(.+)'/)?lines[line].match(/'(.+)'/)[1]:'';
	    		}
	    		if(lines[line].indexOf('this.gcm.gcm_title') > -1){
	    			result_config.gcm_title = lines[line].match(/'(.+)'/)?lines[line].match(/'(.+)'/)[1].replace(/\\'/g,"'"):'';
	    		}
	    		if(lines[line].indexOf('this.gcm.gcm_content') > -1){
	    			result_config.gcm_content = lines[line].match(/'(.+)'/)?lines[line].match(/'(.+)'/)[1].replace(/\\'/g,"'"):'';
	    		}
	    		if(lines[line].indexOf('this.global.debug') > -1){
	    			result_config.debug = lines[line].match(/'(.+)'/)?lines[line].match(/'(.+)'/)[1].replace(/\\'/g,"'"):'';
	    		}
	    		if(lines[line].indexOf('this.gcm.gcm_proxy_url') > -1){
	    			result_config.gcm_proxy_url = lines[line].match(/'(.+)'/)?lines[line].match(/'(.+)'/)[1].replace(/\\'/g,"'"):'';
	    		}
	    		if(lines[line].indexOf('this.gcm.gcm_proxy_username') > -1){
	    			result_config.gcm_proxy_username = lines[line].match(/'(.+)'/)?lines[line].match(/'(.+)'/)[1].replace(/\\'/g,"'"):'';
	    		}
	    		if(lines[line].indexOf('this.gcm.gcm_proxy_password') > -1){
	    			result_config.gcm_proxy_password = lines[line].match(/'(.+)'/)?lines[line].match(/'(.+)'/)[1].replace(/\\'/g,"'"):'';
	    		}
	    		if(lines[line].indexOf('this.gcm.gcm_proxy_port') > -1){
	    			result_config.gcm_proxy_port = lines[line].match(/'(.+)'/)?lines[line].match(/'(.+)'/)[1].replace(/\\'/g,"'"):'';
	    		}
	    	}
			res.render('dashboardconfig', { 
				pagename: 'This is working fine..awesome swig',
				result: result[0],
				result_config: result_config,
				path: __dirname
			});
	    });
	});
});
router.get('/reportanalysis',checkAuth,  function (req, res) {
	var from_date = req.query.from_date?req.query.from_date:'';
	var to_date = req.query.to_date?req.query.to_date:'';
	var user_id = req.query.user_id?req.query.user_id:'';
	var report = req.query.report_type?req.query.report_type:'';
	logger.verbose(req.query);
	logger.verbose('why emoty');
	var config = new Config({
		user_id: user_id,
		from_date: from_date,
		to_date: to_date,
	});

	if(report == 4)
	{	
		config.getReportFour(null, function(error, result, pagination) {
			logger.verbose(result);
			res.send(result);
		});
	}
	else if(report == 3)
	{	
		config.getReportThree(null, function(error, result, pagination) {
			logger.verbose(result);
			res.send(result);
		});
	}
	else if(report == 2)
	{	
		config.getReportTwo(null, function(error, result, pagination) {
			logger.verbose(result);
			res.send(result);
		});
	}
	else if(report == 1)
	{
		config.getReportOne(null, function(error, result, pagination) {
			logger.verbose(result);
			res.send(result);
		});
	}
	else {
		res.render('reportanalysis', {
			path: __dirname
		});
	}
});
router.post('/saveconfig', checkAuth, function(req, res, next) {
	var config = new Config({
        password_expiry_period: req.body.password_expiry_period?req.body.password_expiry_period:'',
        otp_expiry_period: req.body.otp_expiry_period?req.body.otp_expiry_period:'',
        message_expiry_period: req.body.message_expiry_period?req.body.message_expiry_period:'',
        lock_out_time: req.body.lock_out_time?req.body.lock_out_time:'',
        number_of_login_attempts: req.body.number_of_login_attempts?req.body.number_of_login_attempts:'',
        number_of_password_recovery_requests: req.body.number_of_password_recovery_requests?req.body.number_of_password_recovery_requests:'',
        log_off_time: req.body.log_off_time?req.body.log_off_time:'',
        message_see_more: req.body.message_see_more?req.body.message_see_more:''
    });	
    logger.verbose(req.body);

    config.editConfig(null, function(error, result) {
    	if(error)
    	{
    		logger.verbose(JSON.stringify(error));
    	}
    	else {
    		logger.verbose('Successfully updated information');
    		logger.verbose(JSON.stringify(result));
    	}
    });
    var body = '';
    var fileList = __dirname + '/../config.js';
    fs.readFile(fileList, function(err, data) {
	    if(err) throw err;
	    data = data.toString();
	    data = data.replace(/this.smtp.host.*/, "this.smtp.host = '"+req.body.host+"';");
	    data = data.replace(/this.smtp.user.*/, "this.smtp.user = '"+req.body.user+"';");
	    data = data.replace(/this.smtp.password.*/, "this.smtp.password = '"+req.body.smtp_password+"';");
	    data = data.replace(/this.links.support.*/, "this.links.support = '"+req.body.email+"';");
	    data = data.replace(/this.ldap.dn.*/, "this.ldap.dn = '"+req.body.ldap_dn+"';");
	    data = data.replace(/this.ldap.password.*/, "this.ldap.password = '"+req.body.ldap_password+"';");
	    data = data.replace(/this.ldap.port.*/, "this.ldap.port = '"+req.body.ldap_port+"';");
	    data = data.replace(/this.ldap.ip.*/, "this.ldap.ip = '"+req.body.ldap_ip+"';");
	    data = data.replace(/this.ldap.ou.*/, "this.ldap.ou = '"+req.body.ldap_ou+"';");
	    data = data.replace(/this.global.email.*/, "this.global.email = '"+req.body.global_email+"';");
	    data = data.replace(/this.global.domain.*/, "this.global.domain = '"+req.body.global_domain+"';");
	    data = data.replace(/this.global.logspan.*/, "this.global.logspan = '"+req.body.global_logspan+"';");
	    data = data.replace(/this.gcm.gcm_api.*/, "this.gcm.gcm_api = '"+req.body.gcm_api+"';");
	    data = data.replace(/this.gcm.gcm_package.*/, "this.gcm.gcm_package = '"+req.body.gcm_package+"';");
	    data = data.replace(/this.gcm.gcm_proxy_url.*/, "this.gcm.gcm_proxy_url = '"+req.body.gcm_proxy_url+"';");
	    data = data.replace(/this.gcm.gcm_proxy_username.*/, "this.gcm.gcm_proxy_username = '"+req.body.gcm_proxy_username+"';");
	    data = data.replace(/this.gcm.gcm_proxy_password.*/, "this.gcm.gcm_proxy_password = '"+req.body.gcm_proxy_password+"';");
	    data = data.replace(/this.gcm.gcm_proxy_port.*/, "this.gcm.gcm_proxy_port = '"+req.body.gcm_proxy_port+"';");
	    var debug;
	    req.body.debug ? debug = 'true': debug = 'false';
	    data = data.replace(/this.global.debug.*/, "this.global.debug = '"+debug+"';");
	    // Replacing if we have any "'" single quotes inside the string.
 	    var gcm_title = req.body.gcm_title.replace(/'/g, "\\'");
	    data = data.replace(/this.gcm.gcm_title.*/, "this.gcm.gcm_title = '"+gcm_title+"';");
	    var gcm_content = req.body.gcm_content.replace(/'/g, "\\'");
	    data = data.replace(/this.gcm.gcm_content.*/, "this.gcm.gcm_content = '"+gcm_content+"';");
	    fs.writeFile(fileList, data, function(err) {
	        err || logger.verbose('Data replaced \n', data);
	    });
	});
	res.redirect('/dashboardconfig');
});

router.post('/usermanagement/bulkupload', upload.single('bulk_users'), function (req, res, next) {
	logger.verbose(req.body); // form fields
    logger.verbose(req.file); // form files
    var error = false;
    if(req.file.originalname.split('.').pop() == 'csv')
    {
		var options = {
			delimiter : ';'
		}
		fs.createReadStream('./public/uploads/'+req.file.filename)
			.pipe(csv.createStream(options))
			.on('data',function(data){
				var user_id = data.tgi.toLowerCase();
				var first_name = data.first_name;
				var last_name = data.last_name;
				var imei_number = data.imei_number;
				var jid = data.tgi.toLowerCase()+'@'+config_file.global.domain;
				var mail = data.mail;
				var mobile = data.mobile;
				var config = new Config({
					user_id: user_id,
					first_name: first_name,
					last_name: last_name,
					imei_number: imei_number,
					jid: jid,
					mail: mail,
					mobile: mobile
				});
				config.addUser(null, function(error, result) {
					if(error)
					{
						error = true;
						logger.verbose(error);
					}
					else{
						client_ldap.bind(config_file.ldap.dn, config_file.ldap.password, function(err, result) {
							logger.verbose("bind err ::"+ JSON.stringify(err));
							var entry = {
								cn: first_name,
								sn: last_name,
								uid: user_id,
								mail: mail,
								objectclass: 'person',
								objectclass: 'organizationalPerson',
								objectclass: 'iNetOrgPerson',
								objectclass: 'devicedetails',
								mobile: mobile,
								userPassword: '123456',
								deviceimei: imei_number,
								otp: '123456',
								otpcreateddate:' ',
								passwordcreateddtime: new Date()
							};
							client_ldap.add('uid='+user_id+','+config_file.ldap.ou, entry, function(err) {
								logger.verbose("add err ::"+ JSON.stringify(err));
								if(err)
								{
									error = true;
									logger.verbose(err);
								}
							});
						});
					}
			    });
			})
			.on('column',function(key,value){
				//logger.verbose('#' + key + '=' + value);
			})
			.on('end',function(){
				logger.verbose('end!');
			})
			.on('close',function(){
				if(!error)
    				res.redirect('/usermanagement?message=Uploaded Successfully');
    			else
    				res.redirect('/usermanagement?message=Error during upload');
			})
    }
    else {
    	error = true;
    	res.redirect('/usermanagement?message=Incorrect File format. Please select .csv file');
    }
});
router.post('/usermanagement/broadcast',checkAuth, function (req, res) {
	var user_id = req.body.user_id?req.body.user_id:'';
	var can_broadcast = req.body.can_broadcast?req.body.can_broadcast:'';
	logger.verbose('loosing patience');
	var config = new Config({
		user_id: user_id,
		can_broadcast: can_broadcast
	});
	config.canBroadcast(null, function(error, result) {
		if(error)
    	{
    		logger.verbose(JSON.stringify(error));
    	}
		else{
			var message = "Updated Broadcast setting for selected users";
			res.redirect('/usermanagement');
		}
    });
});
router.post('/usermanagement/active',checkAuth, function (req, res) {
	var user_id = req.body.user_id?req.body.user_id:'';
	var is_active = req.body.is_active?req.body.is_active:'';
	
	var config = new Config({
		user_id: user_id,
		is_active: is_active
	});
	config.activeUsers(null, function(error, result) {
		if(error)
    	{
    		logger.verbose(JSON.stringify(error));
    	}
		else{
			var message = "Updated Active/Inactive setting for selected users";
			res.redirect('/usermanagement');
		}
    });
});
router.get('/usermanagement',checkAuth, function (req, res) {
	var search_key = req.query.search_key?req.query.search_key:'';
	var message = req.query.message?req.query.message:'';
	var is_active = req.query.is_active?req.query.is_active:'';
	var limit = req.query.limit?req.query.limit:'';
	var offset = req.query.offset?req.query.offset:'';
	logger.verbose('search Key: '+search_key);
	var config = new Config({
		search_key: search_key,
		is_active: is_active,
		offset: offset,
		limit: limit
	});
	config.getConfig(null, function(error, result, pagination) {
		logger.verbose(result);
		if(search_key != '' || is_active != '')
		{
			res.send(result);
		}
		else {
			var page = pagination.count/10;
			pagination.pages = [];
			pagination.page = Math.ceil(page);
			pagination.offset = offset != ''?offset:0;

			offset = offset ? offset : 0;
			offset != 0 ? pagination.prev = offset - 10 : pagination.prev = 0;
			pagination.count >= offset+10 ? pagination.next = parseInt(offset) + 10 : pagination.next = parseInt(offset);
			for(var i=0;i<pagination.page;i++)
			{
				pagination.pages.push(i);
			}
			logger.verbose(pagination);
	    	res.render('usermanagement', {
				results: result,
				message: message,
				pagination: pagination,
				domain: config_file.global.domain
			});
    	}
    });
});
router.get('/usermanagement/deleteuser',checkAuth, function (req, res) {
	var user_id = req.query.user_id?req.query.user_id:'';
	logger.verbose(user_id);
	var user_id_array = user_id.split(',');
	var config = new Config({
		user_id: user_id
	});
	config.deleteUser(null, function(error, result) {
		if(error)
		{
			logger.verbose(error);
			res.redirect('/usermanagement?message='+JSON.stringify(error));
		}
		else{
			
			for(var i = 0; i < user_id_array.length; i++)
			{
				var user_id_new = user_id_array[i];
				client_ldap.bind(config_file.ldap.dn, config_file.ldap.password, function(err, result) {
					logger.verbose('uid='+user_id_new+','+config_file.ldap.ou);
					logger.verbose(user_id);
					client_ldap.del('uid='+user_id_new+','+config_file.ldap.ou, function(err) {
						if(!err){
							res.redirect('/usermanagement?message=User Deleted Successfully');
						}
						else{
							logger.verbose(err);
							res.redirect('/usermanagement?message='+JSON.stringify(err));
						}
					});
				});
			}
		}
    });
});
function groupSplit(gid) {
    var res = gid.split("@");
    return res[0];
}
router.post('/usermanagement/editImeiNumber',checkAuth, function (req, res) {
	var imei_number = req.body.imei_number?req.body.imei_number:'';
	var jid = req.body.jid?req.body.jid:'';
	var user_old_jid = req.body.user_old_jid?req.body.user_old_jid:'';
	var config = new Config({
		imei_number: imei_number,
		jid: jid,
		user_old_jid: user_old_jid
	});
	var user_id = groupSplit(user_old_jid);
	config.editImeiNumber(null, function(error, result) {
		if(error)
		{
			logger.verbose(error);
			res.redirect('/usermanagement?message='+JSON.stringify(error));
		}
		else{
			client_ldap.bind(config_file.ldap.dn, config_file.ldap.password, function(err, result) {
				logger.verbose('uid='+user_id+','+config_file.ldap.ou);
				client_ldap.modifyDN('uid='+user_id+','+config_file.ldap.ou, 'uid='+imei_number+','+config_file.ldap.ou, function(err) {
					if(!err){
						
						var update_variable = {
						    deviceimei: imei_number
						}
						var change = new ldap.Change({
							operation: 'replace',
							modification: update_variable
						});
						client_ldap.modify('uid='+imei_number+','+config_file.ldap.ou, change, function(err) {
							if(err)
							{
								logger.verbose(err);
								res.redirect('/usermanagement?message='+JSON.stringify(err));
							}
							else {
								var update_variable = {
								    uid: imei_number
								}
								var change = new ldap.Change({
									operation: 'replace',
									modification: update_variable
								});
								client_ldap.modify('uid='+imei_number+','+config_file.ldap.ou, change, function(err) {
									if(!err)
									{
										res.redirect('/usermanagement?message=IMEI Changed Successfully');
									}
									else {
										logger.verbose(err);
										res.redirect('/usermanagement?message='+JSON.stringify(err));
									}
								});
							}
						});
					}
					else{
						logger.verbose(err);
						res.redirect('/usermanagement?message='+JSON.stringify(err));
					}
				});
			});
		}
    });
});

router.get('/usermanagement/getParticularUser',checkAuth, function (req, res) {
	var user_id = req.query.user_id?req.query.user_id:'';
	var config = new Config({
		user_id: user_id
	});
	config.getParticularUserdata(null, function(error, result) {
		if(error)
		{
			logger.verbose(error);
		}
		else{
			res.send(result);
		}
    });
});

router.post('/usermanagement/adduser',checkAuth, function (req, res) {
	var user_id = req.body.user_id.toLowerCase()?req.body.user_id.toLowerCase():'';
	var first_name = req.body.first_name?req.body.first_name:'';
	var last_name = req.body.last_name?req.body.last_name:'';
	var imei_number = req.body.imei_number?req.body.imei_number:'';
	var jid = req.body.jid.toLowerCase()?req.body.jid.toLowerCase():'';
	var mail = req.body.mail?req.body.mail:'';
	var mobile = req.body.mobile?req.body.mobile:'';
	var config = new Config({
		user_id: user_id,
		first_name: first_name,
		last_name: last_name,
		imei_number: imei_number,
		jid: jid,
		mail: mail,
		mobile: mobile
	});
	config.addUser(null, function(error, result) {
		if(error)
		{
			logger.verbose(error);
			res.redirect('/usermanagement?error='+JSON.stringify(error));
		}
		else{
			client_ldap.bind(config_file.ldap.dn, config_file.ldap.password, function(err, result) {
				logger.verbose("bind err ::"+ JSON.stringify(err));
				var entry = {
					cn: first_name,
					sn: last_name,
					uid: user_id,
					mail: mail,
					objectclass: 'person',
					objectclass: 'organizationalPerson',
					objectclass: 'iNetOrgPerson',
					objectclass: 'devicedetails',
					mobile: mobile,
					userPassword: '123456',
					deviceimei: imei_number,
					otp: '123456',
					otpcreateddate:' ',
					passwordcreateddtime: new Date()
				};
				client_ldap.add('uid='+user_id+','+config_file.ldap.ou, entry, function(err) {
					logger.verbose("add err ::"+ JSON.stringify(err));
					if(err)
					{
						res.redirect('/usermanagement?error='+JSON.stringify(error));
					}
					else {
						var message = "Added user Successfully";
						res.redirect('/usermanagement?message='+message);
					}
				});
			});
		}
    });
});

router.post('/usermanagement/updateuser',checkAuth, function (req, res) {
	var user_id = req.body.user_id?req.body.user_id:'';
	var first_name = req.body.first_name?req.body.first_name:'';
	var last_name = req.body.last_name?req.body.last_name:'';
	var imei_number = req.body.imei_number?req.body.imei_number:'';
	var jid = req.body.jid?req.body.jid:'';
	var mail = req.body.mail?req.body.mail:'';
	var mobile = req.body.mobile?req.body.mobile:'';
	var config = new Config({
		user_id: user_id,
		first_name: first_name,
		last_name: last_name,
		imei_number: imei_number,
		jid: jid,
		mail: mail,
		mobile: mobile
	});
	config.updateUser(null, function(error, result) {
		if(error)
		{
			logger.verbose(error);
		}
		else{
			client_ldap.bind(config_file.ldap.dn, config_file.ldap.password, function(err, result) {
				if(err)
				{
					logger.verbose(err);
				}
				else {

					// var update_variable = {
					//     dn: 'uid='+imei_number+','+config_file.ldap.ou
					// }
					// var change = new ldap.Change({
					// 	operation: 'replace',
					// 	modification: update_variable
					// });
					// client_ldap.modify('uid='+imei_number+','+config_file.ldap.ou, change, function(err) {
					// 	logger.verbose("update err ::"+ JSON.stringify(err));
					// });

					// imei number
					var update_variable = {
					    deviceimei: imei_number
					}
					var change = new ldap.Change({
						operation: 'replace',
						modification: update_variable
					});
					client_ldap.modify('uid='+user_id+','+config_file.ldap.ou, change, function(err) {
						logger.verbose("update err ::"+ JSON.stringify(err));
					});

					// First name
					var update_variable = {
					    cn: first_name
					}
					var change = new ldap.Change({
						operation: 'replace',
						modification: update_variable
					});
					client_ldap.modify('uid='+user_id+','+config_file.ldap.ou, change, function(err) {
						logger.verbose("update err ::"+ JSON.stringify(err));
					});

					// Last name
					var update_variable = {
					    sn: last_name
					}
					var change = new ldap.Change({
						operation: 'replace',
						modification: update_variable
					});
					client_ldap.modify('uid='+user_id+','+config_file.ldap.ou, change, function(err) {
						logger.verbose("update err ::"+ JSON.stringify(err));
					});


					// Mail
					var update_variable = {
					    mail: mail
					}
					var change = new ldap.Change({
						operation: 'replace',
						modification: update_variable
					});
					client_ldap.modify('uid='+user_id+','+config_file.ldap.ou, change, function(err) {
						logger.verbose("update err ::"+ JSON.stringify(err));
					});


					// Mobile
					var update_variable = {
					    mobile: mobile
					}
					var change = new ldap.Change({
						operation: 'replace',
						modification: update_variable
					});
					client_ldap.modify('uid='+user_id+','+config_file.ldap.ou, change, function(err) {
						logger.verbose("update err ::"+ JSON.stringify(err));
					});

					var message = "Updated user Successfully";
					res.redirect('/usermanagement');
				}
			});
		}
    });
});
router.get('/getuserdata', checkAuth, function(req, res, next) {
	logger.verbose("Route: GET /userData");
	
    res.redirect('/');
});
router.get('/groupmanagement',checkAuth, function (req, res) {
	var search_key = req.query.search_key?req.query.search_key:'';
	var limit = req.query.limit?req.query.limit:'';
	var offset = req.query.offset?req.query.offset:'';
	logger.verbose('search Key: '+search_key);
	var config = new Config({
		search_key: search_key,
		offset: offset,
		limit: limit
	});
	config.getGroupData(null, function(error, result, pagination) {
		if(search_key != '')
		{
			res.send(result);
		}
		else {

			var page = pagination.count/10;
			pagination.pages = [];
			pagination.page = Math.ceil(page);
			pagination.offset = offset;

			offset = offset ? offset : 0;
			offset != 0 ? pagination.prev = offset - 10 : pagination.prev = 0;
			pagination.count >= offset+10 ? pagination.next = parseInt(offset) + 10 : pagination.next = parseInt(offset);
			for(var i=0;i<pagination.page;i++)
			{
				pagination.pages.push(i);
			}
			logger.verbose(pagination);
	    	res.render('groupmanagement', {
				results: result,
				message: message,
				pagination: pagination
			});
    	}
    });
});
router.get('/groupmanagement/getparticulargroup', checkAuth, function (req, res) {
	var group_id = req.query.group_id?req.query.group_id:'';
	var config = new Config({
		group_id: group_id
	});
	config.getParticularGroupsdata(null, function(error, result) {
		if(error)
		{
			logger.verbose(error);
		}
		else{
			res.send(result);
		}
    });
});
//change admin
router.post('/groupmanagement/changeAdmin', checkAuth, function (req, res) {	
			logger.verbose(req.body);
	        var group_id = req.body.group_id?req.body.group_id:'';	
	        var new_admin_id = req.body.new_admin_id?req.body.new_admin_id:'';			
	        logger.verbose(group_id);
	        logger.verbose(new_admin_id);			
	        var config = new Config({			
	                group_id: group_id,
	                user_id: new_admin_id			
	        });			
	        config.changeAdmin(null, function(error, result) {			
            if(error)			
            {			
                    logger.verbose(error);			
            }			
            else{			
                    res.redirect('/groupmanagement');			
            }			
    });			
});
router.post('/groupmanagement/deletegroup', checkAuth, function (req, res) {
	var group_id = req.body.group_id?req.body.group_id:'';
	logger.verbose(group_id);
	var config = new Config({
		group_id: group_id
	});
	logger.verbose(group_id);
	config.deleteGroup(null, function(error, result) {
		if(error)
		{
			logger.verbose(error);
		}
		else{
			res.redirect('/groupmanagement');
		}
    });
});
router.get('/groupmanagement/getparticulargroup', checkAuth, function (req, res) {
	var group_id = req.query.group_id?req.query.group_id:'';
	var config = new Config({
		group_id: group_id
	});
	config.getParticularGroupsdata(null, function(error, result) {
		if(error)
		{
			logger.verbose(error);
		}
		else{
			res.send(result);
		}
    });
});
//change admin
router.post('/groupmanagement/changeAdmin', checkAuth, function (req, res) {	
			logger.verbose(req.body);
	        var group_id = req.body.group_id?req.body.group_id:'';	
	        var new_admin_id = req.body.new_admin_id?req.body.new_admin_id:'';			
	        logger.verbose(group_id);
	        logger.verbose(new_admin_id);			
	        var config = new Config({			
	                group_id: group_id,
	                user_id: new_admin_id			
	        });			
	        config.changeAdmin(null, function(error, result) {			
	                if(error)			
	                {			
	                        logger.verbose(error);
	                }			
	                else{			
	                        res.redirect('/groupmanagement');			
	                }			
    });			
});
//email template data
router.get('/email',checkAuth, function (req, res) {
	var config = new Config();
	config.getEmailContent(null, function(error, result) {
		logger.verbose(result);	
    	res.render('emailtemplates', {
			result: result[0],
			pagename: 'This is working fine..awesome swig'
		});
    });
});
router.post('/email/updateEmailContent',checkAuth, function (req, res) {
	var user_regstrn_email_content = req.body.user_regstrn_email_content?req.body.user_regstrn_email_content:'';
	var pswd_recovery_otp_content = req.body.pswd_recovery_otp_content?req.body.pswd_recovery_otp_content:'';
	var mobileno_change_content = req.body.mobileno_change_content?req.body.mobileno_change_content:'';
	var alert_email_content = req.body.alert_email_content?req.body.alert_email_content:'';
	var config = new Config({
		user_regstrn_email_content: user_regstrn_email_content,
		pswd_recovery_otp_content: pswd_recovery_otp_content,
		mobileno_change_content: mobileno_change_content,
		alert_email_content: alert_email_content
	});
	config.updateEmailContent(null, function(error, result) {
		if(error)
		{
			logger.verbose(error);
		}
		else{
			var message = "Updated Email Content Successfully";
			res.redirect('/email');
		}
    });
});

//Get Report Data
router.get('/reportanalysis',checkAuth,  function (req, res) {
	var from_date = req.query.from_date?req.query.from_date:'';
	var to_date = req.query.to_date?req.query.to_date:'';
	var user_id = req.query.user_id?req.query.user_id:'';
	var report = req.query.report_type?req.query.report_type:'';
	var limit = req.query.limit?req.query.limit:'';
	var offset = req.query.offset?req.query.offset:'';

	var config = new Config({
		user_id: user_id,
		from_date: from_date,
		to_date: to_date,
		offset: offset,
		limit: limit
	});
	
	if(report == 4)
	{	
		config.getReportFour(null, function(error, result, pagination) {
			logger.verbose(result);
			if(from_date == '' && to_date == ''){
				res.send(result);
			}
			else{
				var page = pagination.count/10;
				pagination.pages = [];
				pagination.page = Math.ceil(page);
				pagination.offset = offset;

				offset = offset ? offset : 0;
				offset != 0 ? pagination.prev = offset - 10 : pagination.prev = 0;
				offset > pagination.count ? pagination.next = parseInt(offset) + 10 : pagination.next = parseInt(offset);
				for(var i=0;i<pagination.page;i++)
				{
					pagination.pages.push(i);
				}
				logger.verbose(pagination);
				res.render('reportanalysis', {
					results: result,
					message: message,
					pagination: pagination
				});			
			}
		});
	}
	else if(report == 3)
	{	
		config.getReportThree(null, function(error, result, pagination) {
			logger.verbose(result);
			res.send(result);
		});
	}
	else if(report == 2)
	{	
		config.getReportTwo(null, function(error, result, pagination) {
			logger.verbose(result);
			res.send(result);
		});
	}
	else if(report == 1)
	{	
		config.getReportOne(null, function(error, result, pagination) {
			logger.verbose(result);
			res.send(result);
		});
	}
	else {
		res.render('reportanalysis', {
			path: __dirname
		});
	}
});

//Resend OTP Functionality
router.post('/usermanagement/resendOTP',checkAuth, function (req, res) {
	var user_id = req.body.user_id?req.body.user_id:'';
	var config = new Config({
		user_id: user_id
	});
	
	config.getParticularUserdata(null, function(error, result_user) {
		logger.verbose(user_id);
		logger.verbose(req.body);
		if(result_user)
		{
			var email_id = result_user[0]?result_user[0].mail:'';
			var imei_number = result_user[0]?result_user[0].imei_number:'';
			otp = otplib.totp;
		    var secret = otp.utils.generateSecret();
		    var code = otp.generate(secret);
		    logger.verbose('OTP code: ' + code);
		    client_ldap.bind(config_file.ldap.dn, config_file.ldap.password, function(err, result) {
				if(err)
				{
					logger.verbose(err);
				}
				else {
					// Add OTP to LDAP
				    var otp_variable = {
				        otp: code
				    }
				    var change = new ldap.Change({
				        operation: 'replace', // "add" should be placed if new field is needed
				        modification: otp_variable
				    });
				    client_ldap.modify('uid=' + user_id + ',' + config_file.ldap.ou, change, function(err) {
				        logger.verbose("update OTP err ::" + JSON.stringify(err));
				        // Add OTP Created Date to LDAP
				        var otp_date = new Date();
				        var otp_date_variable = {
				            otpcreateddate: otp_date
				        }
				        var change = new ldap.Change({
				            operation: 'replace', // "add" should be placed if new field is needed
				            modification: otp_date_variable
				        });

				        client_ldap.modify('uid=' + user_id + ',' + config_file.ldap.ou, change, function(err) {
				            logger.verbose("update OTP created date err ::" + JSON.stringify(err));
				            var email_content = code;
				            var subject = 'TAS: OTP';
				            var config = new Config();
							config.getEmailContent(null, function(error, emailContent) {
								logger.verbose(req.body.resend_otp);
								var config_db = new Config();
                                config_db.getConfigData(null, function(error, result_configuration) {
                                    var expiry_date = new Date();
                                    expiry_date.setDate(expiry_date.getDate() + parseInt(result_configuration[0].password_expiry_period));
						            if(req.body.resend_otp == 'user-registration' && emailContent && emailContent[0])
						            {
						            	email_content = emailContent[0].user_regstrn_email_content;
						            	email_content = email_content.replace("<otp-code>", code);
						            	email_content = email_content.replace("<date-of-enrollment>", otp_date);
						            	email_content = email_content.replace("<first-name>", result_user[0].first_name);
						            	email_content = email_content.replace("<last-name>", result_user[0].last_name);
						            	email_content = email_content.replace("<date-of-expiry>", expiry_date);
	                                    email_content = email_content.replace("<mobile>", result_user[0].mobile);
	                                    email_content = email_content.replace("<imei>", result_user[0].imei_number);

						            	subject = 'TAS: New user registration email';
						            	logger.verbose(email_content);
						            }
						            else if(req.body.resend_otp == 'password-recovery' && emailContent && emailContent[0])
						            {
						            	subject = 'TAS: Password recovery OTP email';
						            	email_content = emailContent[0].pswd_recovery_otp_content;
						            	email_content = email_content.replace("<otp-code>", code);
						            	email_content = email_content.replace("<date-of-enrollment>", otp_date);
						            	email_content = email_content.replace("<first-name>", result_user[0].first_name);
						            	email_content = email_content.replace("<last-name>", result_user[0].last_name);
						            	email_content = email_content.replace("<date-of-expiry>", expiry_date);
	                                    email_content = email_content.replace("<mobile>", result_user[0].mobile);
	                                    email_content = email_content.replace("<imei>", result_user[0].imei_number);
						            }
						            else if(emailContent && emailContent[0]) {
						            	subject = 'TAS: Change mobile number OTP emails';
						            	email_content = emailContent[0].mobileno_change_content;
						            	email_content = email_content.replace("<otp-code>", code);
						            	email_content = email_content.replace("<date-of-enrollment>", otp_date);
						            	email_content = email_content.replace("<first-name>", result_user[0].first_name);
						            	email_content = email_content.replace("<last-name>", result_user[0].last_name);
						            	email_content = email_content.replace("<date-of-expiry>", expiry_date);
	                                    email_content = email_content.replace("<mobile>", result_user[0].mobile);
	                                    email_content = email_content.replace("<imei>", result_user[0].imei_number);
						            }
						            var mailOptions = {
								        from: config_file.links.support,
								        to: email_id, //list of receivers
								        subject: subject, // Subject line
								        //text: 'Your OTP for THALES', // plaintext body
								        html: email_content // html body
								    };
								    // send mail with defined transport object
								    smtp.sendMail(mailOptions, function(error, info) {
								        logger.verbose('sending mail..');
								        if (error) {
								            return logger.verbose(error);
								        }
								        logger.verbose('Message sent: ' + info.response);
						            	res.redirect('/usermanagement');
								    });
								});
							});
				        });
				    });
				}
			});
		}
	});
});

module.exports = router;