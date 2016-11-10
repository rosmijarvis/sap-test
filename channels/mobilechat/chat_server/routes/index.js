module.exports = function(app) {

	var message = require('./message');
	var admindashboard = require('./admindashboard');
	app.get('/', admindashboard);
	app.post('/auth', admindashboard);
	app.get('/logoutauth', admindashboard);
	app.get('/dashboardconfig', admindashboard);
	app.get('/configuration', admindashboard);
	app.get('/purging', admindashboard);
	app.post('/saveflatfile', admindashboard);
	app.get('/messages', message);
	app.post('/saveconfig', admindashboard);

	app.get('/changepassword', admindashboard);
	app.post('/changepasswordpost', admindashboard);
	app.post('/changeusername', admindashboard);

	app.get('/usermanagement', admindashboard);
	app.get('/usermanagement/getusers', admindashboard);
	app.get('/usermanagement/deleteuser', admindashboard);
	app.post('/usermanagement/adduser', admindashboard);
	app.post('/usermanagement/updateuser', admindashboard);
	app.get('/usermanagement/getParticularUser', admindashboard);
	app.post('/usermanagement/broadcast', admindashboard);
	app.post('/usermanagement/active', admindashboard);
	app.post('/usermanagement/resendOTP', admindashboard);
	app.post('/usermanagement/editImeiNumber', admindashboard);
	app.post('/usermanagement/bulkupload', admindashboard);
	

	app.get('/groupmanagement', admindashboard);
	app.get('/groupmanagement/getparticulargroup', admindashboard);
	app.post('/groupmanagement/deletegroup', admindashboard);
	app.post('/groupmanagement/changeAdmin', admindashboard);
	app.get('/reportanalysis', admindashboard);
	app.get('/reportanalysis/getExchangedMessages', admindashboard);

	app.get('/email', admindashboard);
	app.get('/email/getEmailContent', admindashboard);
	
	app.post('/email/updateEmailContent', admindashboard);

};