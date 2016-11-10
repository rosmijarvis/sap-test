this.host = '54.83.75.126'
this.port = 3000
this.xmpp_port = 5222
this.url = 'http://' + this.host + ':' + this.port
// Database config - local
this.database = {
    host: 'localhost',
    user: 'root', // your username
    password: 'admin', // your password
    databaseName: 'chat_server' // database name
}
// Links 
this.links = {};
this.links.support = 'Thales <ashok.inspires@gmail.com>';
//SMTP config
this.smtp = {};
this.smtp.host = 'smtp.sendgrid.net';
this.smtp.user = 'sudhakar_royal';
this.smtp.password = 'logictree';
//LDAP config 
this.ldap = {};
this.ldap.dn = 'cn=root,dc=lnt,dc=com';
this.ldap.password = 'admin';
this.ldap.port = '389';
this.ldap.ip = 'ldap://127.0.0.1';
this.ldap.ou = 'ou=People,dc=lnt,dc=com';
//Global config
this.global = {};
this.global.email = 'rajaram_asp@yahoo.co.in';
this.global.domain = '54.83.75.126';
this.global.logspan = '80';
this.global.debug = 'false';
//GCM config
this.gcm = {};
this.gcm.gcm_api = 'AIzaSyCwKSOVuIv_MKt3haN6VexePo8-sOvsdYM';
this.gcm.gcm_package = 'gcm.play.android.samples.com.gcmquickstart';
this.gcm.gcm_title = 'T-chat notification - You have received a messsage';
this.gcm.gcm_content = 'You have got a message';
this.gcm.gcm_proxy_url = '';
this.gcm.gcm_proxy_username = '';
this.gcm.gcm_proxy_password = '';
this.gcm.gcm_proxy_port = '';
