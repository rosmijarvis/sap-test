'use strict'

var xmpp = require('node-xmpp-server')
var Client = require('node-xmpp-client')

  var client1 = new Client({
    type: 'client',
    //jid: 'client1@203.101.96.53',
    jid: 'tchat-b6a12@gcm.googleapis.com',
    //jid: 'client1@52.27.160.220',
    password: 'AIzaSyDjp7utKCq-WyVA3vHo-vhRAGruEqkw1Fk',
    port: 5235,
    host: 'gcm.googleapis.com',
    legacySSL: false,
    preferredSaslMechanism : 'PLAIN'
  })

  client1.on('online', function () {
    console.log('client1: online');
    // <iq to="52.27.0.146" id="18MLT-17" type="get" xmlns:stream="http://etherx.jabber.org/streams" 
    // from="80508053@52.27.0.146/Smack" xmlns="jabber:client">
    // <addgroupparticipantIQ xmlns="urn:xmpp:AddGroupParticipant">
    // <groupDetails>
    //   {"GroupContacts":[{"participantJID":"80508051@52.27.0.146"}],"GroupName":"grp","GroupJID":"1@52.27.0.146"}
    // </groupDetails>
    // <action_type>AddGroupParticipant</action_type>
    // <response/></addgroupparticipantIQ>
    // </iq>

    // var message_custom = new xmpp.Element('message', {
    //     id: 'asd',
    //     to: '00000002@52.27.0.146',
    //     from: '80508051@52.27.0.146',
    //     type: 'chat'
    // });
    // var date = new Date();
    // message_custom.c('body').t('beautifullllllllllll').up();
    // var status = message_custom.c('status', {xmlns: 'status:namespace'});
    // status.c('message_id').t('0').up();
    // status.c('received').t('0').up();
    // status.c('receivedTime').t('0').up();
    // status.c('read').t('0').up();
    // status.c('readTime').t('0').up();
    // var senderinfo = message_custom.c('senderinfo', {xmlns: 'senderinfo:namespace'});
    // senderinfo.c('senderid').t('80508051').up();
    // senderinfo.c('sendername').t('').up();
    // client1.send(message_custom);

     //<iq to='52.27.0.146' id='ZHSSV-20' type='set'><myIQ xmlns='urn:xmpp:testABC'><userdata>Test user data</userdata>
     //<action_type>customAction</action_type></myIQ></iq>

    //client1.send(new xmpp.Stanza('iq', { to: '52.27.0.146', id:'ZHSSV-20', type: 'set'}).c('userdata').t('Test user data'));


    // <rajaram to="client1@52.27.0.146" id="ZHSSV-20" type="set" from="client1@52.27.0.146/5f033ee9e1b5b865ec3cf7b5814c24f1" xmlns:stream="http://etherx.jabber.org/streams"><body>Test user data</body></rajaram>
    /*<rajaram to="client2@localhost" thales="mukarm" type="chat" 
    xmlns:stream="http://etherx.jabber.org/streams" 
    from="client1@localhost/f998e3ef5c79612038abc07014581f48" xmlns="jabber:client">
    <body>test man</body></rajaram>*/

  });

  client1.on('stanza', function (stanza) {
    console.log('client1: stanza', stanza.root().toString())
  });

  client1.on('error', function (error) {
    console.log('client1 error: ', error)
  });
