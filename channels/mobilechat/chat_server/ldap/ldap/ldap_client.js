var ldap = require('ldapjs');
var client = ldap.createClient({
  url: 'ldap://127.0.0.1:389'
});


client.bind('cn=root,dc=lnt,dc=com', 'root', function(err, result) {
   console.log("bind err ::"+ JSON.stringify(err));
   var entry = {
  cn: 'four',
  sn: 'k',
  uid: '00000004',
  mail: 'four@four.com',//pwd:testing12321
  objectclass: 'person',
  objectclass: 'organizationalPerson',
  objectclass: 'iNetOrgPerson',
  objectclass: 'devicedetails',
  mobile: '0000000004',
  userPassword: '123456',
  deviceimei: '00000004'
  };

  client.add('uid=00000004,ou=People,dc=lnt,dc=com', entry, function(err) {
    console.log("add err ::"+ JSON.stringify(err));
  });
});
client.bind('cn=root,dc=lnt,dc=com', 'root', function(err, result) {
   console.log("bind err ::"+ JSON.stringify(err));
   var entry = {
  cn: 'five',
  sn: 'k',
  uid: '00000005',
  mail: 'five@five.com',//pwd:testing12321
  objectclass: 'person',
  objectclass: 'organizationalPerson',
  objectclass: 'iNetOrgPerson',
  objectclass: 'devicedetails',
  mobile: '0000000005',
  userPassword: '123456',
  deviceimei: '00000005'
  };

  client.add('uid=00000005,ou=People,dc=lnt,dc=com', entry, function(err) {
    console.log("add err ::"+ JSON.stringify(err));
  });
});
client.bind('cn=root,dc=lnt,dc=com', 'root', function(err, result) {
   console.log("bind err ::"+ JSON.stringify(err));
   var entry = {
  cn: 'six',
  sn: 'k',
  uid: '00000006',
  mail: 'six@six.com',//pwd:testing12321
  objectclass: 'person',
  objectclass: 'organizationalPerson',
  objectclass: 'iNetOrgPerson',
  objectclass: 'devicedetails',
  mobile: '0000000006',
  userPassword: '123456',
  deviceimei: '00000006'
  };

  client.add('uid=00000006,ou=People,dc=lnt,dc=com', entry, function(err) {
    console.log("add err ::"+ JSON.stringify(err));
  });
});

// client.compare('uid=876543210,ou=People,dc=my-domain,dc=com', 'deviceimei', '876543210', function(err, matched) {
// 	console.log(matched);
// });

