var ldap = require('ldapjs');
var client = ldap.createClient({
  url: 'ldap://127.0.0.1:389'
});


client.bind('cn=root,dc=lnt,dc=com', 'admin', function(err, result) {
   console.log("bind err ::"+ JSON.stringify(err));
   var entry = {
  cn: 'admin',
  sn: 'admin',
  uid: 'admin',
  mail: 'admin@admin.com',//pwd:testing12321
  objectclass: 'person',
  objectclass: 'organizationalPerson',
  objectclass: 'iNetOrgPerson',
  objectclass: 'devicedetails',
  mobile: '123456',
  userPassword: 'admin',
  deviceimei: '123456',
  otp: '123456',
  otpcreateddate:'123456'
  };

  client.add('uid=admin,ou=Admin,dc=lnt,dc=com', entry, function(err) {
    console.log("add err ::"+ JSON.stringify(err));
  });
});
 
/*client.bind('cn=root,dc=lnt,dc=com', 'root', function(err, result) {
   console.log("bind err ::"+ JSON.stringify(err));
   var entry = {
  cn: 'eight',
  sn: 'k',
  uid: '00000008',
  mail: 'eight@eight.com',//pwd:testing12321
  objectclass: 'person',
  objectclass: 'organizationalPerson',
  objectclass: 'iNetOrgPerson',
  objectclass: 'devicedetails',
  mobile: '0000000008',
  userPassword: '123456',
  deviceimei: '00000008'
  };

  client.add('uid=00000008,ou=People,dc=lnt,dc=com', entry, function(err) {
    console.log("add err ::"+ JSON.stringify(err));
  });
});
/*client.bind('cn=root,dc=lnt,dc=com', 'root', function(err, result) {
   console.log("bind err ::"+ JSON.stringify(err));
   var entry = {
  cn: 'nine',
  sn: 'k',
  uid: '00000009',
  mail: 'nine@nine.com',//pwd:testing12321
  objectclass: 'person',
  objectclass: 'organizationalPerson',
  objectclass: 'iNetOrgPerson',
  objectclass: 'devicedetails',
  mobile: '0000000009',
  userPassword: '123456',
  deviceimei: '00000009'
  };

  client.add('uid=00000009,ou=People,dc=lnt,dc=com', entry, function(err) {
    console.log("add err ::"+ JSON.stringify(err));
  });
});*/

// client.compare('uid=876543210,ou=People,dc=my-domain,dc=com', 'deviceimei', '876543210', function(err, matched) {
// 	console.log(matched);
// });

