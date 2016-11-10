var ldap = require('ldapjs');
var client = ldap.createClient({
  url: 'ldap://127.0.0.1:389'
});


client.bind('cn=root,dc=lnt,dc=com', 'root', function(err, result) {
   	console.log("bind err ::"+ JSON.stringify(err));
	var search = {
	  filter: '(uid=t0000002)',
	  scope: 'sub',
	  attributes: ['passwordcreateddtime','mail']
	};

	client.search('cn=root,dc=lnt,dc=com', search, function(err, res) {
		console.log("search err ::"+ JSON.stringify(err));

		res.on('searchEntry', function(entry) {
			console.log('entry: ' + JSON.stringify(entry.object));
			var ldap_fields = entry.object;
			console.log('mail::'+ldap_fields.mail);
			console.log('passwordcreateddtime::'+ldap_fields.passwordcreateddtime);
		});
		res.on('searchReference', function(referral) {
			console.log('referral: ' + referral.uris.join());
		});
		res.on('error', function(err) {
			console.error('error: ' + err.message);
		});
		res.on('end', function(result) {
			console.log('status: ' + result.status);
		});
	});

	// client_ldap.modifyDN('uid=T00000001,ou=People,dc=lnt,dc=com', 'uid=355004059813041,ou=People,dc=lnt,dc=com', function(err) {
	// 	console.log(err);
	// });

});
