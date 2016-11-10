var ldap = require('ldapjs');
var client = ldap.createClient({
  url: 'ldap://127.0.0.1:389'
});


client.bind('cn=root,dc=lnt,dc=com', 'root', function(err, result) {
   console.log("bind err ::"+ JSON.stringify(err));
});

var update_variable = {
	mobile: '8050832893'
}
updateUser(update_variable);

function updateUser(update_variable) {
	var change = new ldap.Change({
		operation: 'replace',
		modification: update_variable
	});

	client.modify('uid=80508051,ou=People,dc=lnt,dc=com', change, function(err) {
		console.log("update err ::"+ JSON.stringify(err));
	});
}
