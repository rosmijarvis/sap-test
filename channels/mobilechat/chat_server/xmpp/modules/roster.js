var xmpp        = require('../index');
var ltx         = require('ltx');
var Message      = require("../../tables/message.js").Message;
var logger       = require('../../utility/logger');
var GroupMessage = require("../../tables/groupmessage.js").GroupMessage;
var Config      = require("../../tables/config.js").Config;
var Users = require("../../tables/users.js").Users;
function RosterSplit(jid) {
    var res = jid.split("/");
    return res[0];
}
function groupSplit(gid) {
    var res = gid.split("@");
    return res[0];
}
exports.configure = function(server, config) {

    server.on("connect", function(client) {

        client.on('stanza', function(stanza) {
            var user = client.jid.user + '@' + client.jid._domain;
            if (stanza.is('iq')) {
                logger.info('********All IQ stanzas***********');
                logger.info(stanza.toString());
                logger.info('*******************'); 
                var stzArray = ltx.parse(stanza.toString());
                var query = stzArray.getChild('query');

                var HeartBeatIQ = stzArray.getChild('HeartBeatIQ');
                if(HeartBeatIQ)
                {
                    var toJid = new xmpp.JID(user);
                    if(!server.router.sessions.hasOwnProperty(client.jid.bare().toString()))
                        server.router.registerRoute(client.jid, client);
                }
                var HideRoasterIQ = stzArray.getChild('HideRoasterIQ');
                if(HideRoasterIQ && HideRoasterIQ.attrs.xmlns == 'urn:xmpp:gethideroaster')
                {
                    var to_hide_jid = HideRoasterIQ.getChild('roasterJID').getText();
                    var users = new Users({
                        user_id: client.jid.user,
                        to_hide_jid: to_hide_jid
                    });
                    users.getHiddenUsers(null, function(error, result, to_hide_jid){
                        logger.info('hidden users');
                        logger.info(result[0].hidden_jids);
                        var hidden_jid_arr = [];
                        if(result[0].hidden_jids)
                            hidden_jid_arr = result[0].hidden_jids.split(",");
                        if(hidden_jid_arr.indexOf(to_hide_jid) > -1)
                        {
                            // User already exits in the hidden list
                            logger.info('User already exits in the hidden list');
                        }
                        else {
                            // User does not exist in the list.
                            hidden_jid_arr.push(to_hide_jid);
                            var comma_list = hidden_jid_arr.join();
                            var users = new Users({
                                user_id: client.jid.user,
                                to_hide_jid: comma_list
                            });
                            users.updateHiddenUser();
                        }
                    });
                }
                var sendgcmtokenIQ = stzArray.getChild('sendgcmtokenIQ');
                if(sendgcmtokenIQ && sendgcmtokenIQ.attrs.xmlns == 'urn:xmpp:SendGCMToken')
                {
                    logger.info('sendgcmtokenIQ');
                    var raw_token = sendgcmtokenIQ.getChild('gcmtoken').getText();
                    var token = JSON.parse(sendgcmtokenIQ.getChild('gcmtoken').getText());
                    var gcm_token = token.GCMToken;
                    logger.info(gcm_token);
                    var users = new Users({
                        jid: user,
                        reg_token: gcm_token,
                        raw_token: raw_token
                    });
                    users.storeGcmToken(null, function(error, result, raw_token){
                        var sendgcmresponse = new xmpp.Element('iq', {
                            id: stanza.attrs.id,
                            to: stanza.attrs.from,
                            type: 'get'
                        });
                        var sendgcmtokenIQ = sendgcmresponse.c('sendgcmtokenIQ', {xmlns: 'urn:xmpp:SendGCMToken'});
                        sendgcmtokenIQ.c('gcmtoken').t(raw_token);
                        sendgcmtokenIQ.c('action_type').t('SendGCMToken');
                        if(error)
                        {
                            sendgcmtokenIQ.c('response').t('error saving in database');
                        }
                        else{
                            sendgcmtokenIQ.c('response').t('success');
                        }
                        logger.info(sendgcmresponse.toString());
                        client.send(sendgcmresponse);
                    });
                }
                if(query && query.attrs.xmlns == 'jabber:iq:roster')
                {
                    var toJid = new xmpp.JID(user);
                    if(!server.router.sessions.hasOwnProperty(client.jid.bare().toString()))
                        server.router.registerRoute(client.jid, client);
                    var message = new Message({
                     from_user: user
                    });

                    message.getRosterUsers(null, function(error, result, result_fields){

                        logger.info('getRosterUsers');

                        if(!error){
                             if(result.length > 0){
                                logger.info("Server: " + client.jid.local + " has roster messages");
                            }else {
                                logger.info("Server: " + client.jid.local + " has no roster messages");
                            }
                            var roster = new xmpp.Element('iq', {
                                id: stanza.attrs.id, // We copy the ID
                                to: stanza.attrs.from, // We send it back to the sender
                                type: 'result'
                            });
                            var query = roster.c('query', {xmlns: 'jabber:iq:roster', ver: 'ver13'});
                            for(var i = 0; i < result.length; i++){
                                var user_main;
                                if(result[i].group_jid)
                                {
                                    group = 1;
                                    user_main = result[i].group_jid;
                                }
                                else{
                                    var group = 0;
                                    if(result[i].to_user == user)
                                        user_main = RosterSplit(result[i].from_user);
                                    else
                                        user_main = RosterSplit(result[i].to_user);
                                }
                                // var ultra_name;
                                // if(user_main =='80508051@52.27.0.146')
                                //     ultra_name = 'lntuserbglr lntinfo';
                                // else if(user_main =='80508052@52.27.0.146')
                                //     ultra_name = 'FabriceBeau thalesuser';
                                // else
                                //     ultra_name = 'thalesuserfrance thalesaero';
                                if(result[i].last_name)
                                    var fln_name = result[i].first_name+' '+result[i].last_name;
                                else
                                    var fln_name = result[i].first_name;

                                var item = query.c("item", {
                                    jid: user_main, 
                                    name: fln_name,
                                    subscription: 'both',
                                    status: 'Custom Message Online'
                                });
                                logger.info(result);
                                logger.info('Hidden users list -- koosalagoobago');
                                var presence = new xmpp.Element('presence', {
                                    from: user_main, 
                                    id: 'presence_id_'+stanza.attrs.id,
                                    type: 'available'
                                });
                                
                                var hidden_jid_arr = [];
                                logger.info(result_fields);
                                if(result_fields[0].hidden_jids)
                                    hidden_jid_arr = result_fields[0].hidden_jids.split(",");

                                if(hidden_jid_arr.indexOf(user_main) > -1)
                                    presence.c('status').t('{ "rosterhidden":true }').up();
                                else
                                    presence.c('status').t('{ "rosterhidden":false }').up();
                                logger.info('presence for user: '+user_main);
                                logger.info(presence.toString());
                                client.send(presence);

                                //     if(group)
                                //     {
                                //         // send add group participant to all group rosters - moved to botttom
                                        
                                //     }
                            }
                            logger.info('*****Roster users sent to:: '+ user + ':: *****');
                            logger.info(roster.toString());
                            logger.info('*****Roster users end*****');
                            client.send(roster);
                            // logger.info('*****presence Stanza*****');
                            // logger.info(presence.toString());
                            // client.send(presence);
                        }
                    });
                }
                var stzArray = ltx.parse(stanza.toString());
                var message_history = stzArray.getChild('MessageHistoryIQ');
                if(message_history)
                    var action_type = stzArray.getChild('MessageHistoryIQ').getChild('action_type').getText();
                else
                    var action_type_offline = '';
                logger.info(action_type_offline);
                logger.info('action_type_offline');
                if(message_history  && message_history.attrs.xmlns == 'urn:xmpp:getmessagehistory' && action_type == 'getOldMessages')
                {
                    logger.info('Message history - Sending All messages from server to:: '+user);
                    var from_date = message_history.getChild('from')?message_history.getChild('from').getText():'';
                    var to_date = message_history.getChild('to')?message_history.getChild('to').getText():'';

                    var message_msg = new Message({
                        from_user: user,
                        message_delivered_dtime: from_date,
                        message_read_dtime : to_date
                    });
                    message_msg.getRosterMessages(null, function(error, result, groups){
                        logger.info(groups);
                        logger.info('groupssss');
                        var group_jids = []; 
                        for(var gg=0;gg<groups.length;gg++)
                        { 
                            group_jids.push(groups[gg].group_jid); 
                        }
                        logger.info(group_jids);
                        if(!error){

                            if(result.length > 0){
                                logger.info("Server: " + client.jid.local + " has unread messages");
                            }else {
                                logger.info("Server: " + client.jid.local + " has no unread messages");
                            }
                            var message_custom = new xmpp.Element('message', {
                                id: '0',
                                to: user,
                                from: user,
                                type: 'chat'
                            });
                            var contents = [];
                            var messageall = message_custom.c('messageall');
                            //var content = messageall.c('content');
                            var chatmessageall = message_custom.c('chatmessageall', {xmlns: 'chatmessageall:namespace'});
                            
                            for(var i = 0; i < result.length; i++){
                                var stanza = ltx.parse(result[i].stanza);
                                logger.info('getRosterMessages -- Sent message history');
                                var status = stanza.getChild('status');
                                var read = status.getChild('read')?status.getChild('read').getText():'';
                                var received = status.getChild('received')?status.getChild('received').getText():'';
                                
                                var body = stanza.getChild('body').getText();
                                var receivedTime = status.getChild('receivedTime')?status.getChild('receivedTime').getText():'';
                                var message_id = status.getChild('message_id')?status.getChild('message_id').getText():'';
                                var readTime = status.getChild('readTime')?status.getChild('readTime').getText():'';
                                
                                if(stanza.getChild('senderinfo'))
                                {
                                    if(stanza.getChild('senderinfo').getChild('sendername'))
                                        var sendername = stanza.getChild('senderinfo').getChild('sendername').getText();
                                    if(stanza.getChild('senderinfo').getChild('senderid'))
                                        var senderid = stanza.getChild('senderinfo').getChild('senderid').getText();
                                }
                                var date = new Date();
                                // var inside = {};
                                // inside.body = body;
                                // inside.message_id = message_id;
                                // inside.to = stanza.attrs.to;
                                // inside.to = stanza.attrs.from;
                                // inside.received = received;
                                // inside.receivedTime = receivedTime;
                                // inside.read = read;
                                // inside.readTime = readTime;
                                // contents.push(inside);
                                if(result[i].group_id == 1) //If in case of group msg
                                {
                                    logger.info('which groups have -1');
                                    logger.info(group_jids.indexOf(result[i].to_user));
                                    if(group_jids.indexOf(result[i].to_user) == '-1')
                                    {
                                        logger.info('Ignoring group - Not sending to user as he is not there in this group ::'+result[i].to_user);
                                        continue;
                                    }
                                    logger.info('checking group msg -- offflineeee');
                                    if(result[i].from_user == user)
                                    {
                                        logger.info('same user please work!');

                                        to_user = result[i].to_user;
                                        from_user = result[i].from_user;
                                    }
                                    else {
                                        to_user = user;
                                        from_user = result[i].to_user;
                                    }

                                }
                                else {
                                    to_user = result[i].to_user;
                                    from_user = result[i].from_user;
                                }
                                var message_tempall = chatmessageall.c('message', {
                                    id: stanza.attrs.id,
                                    to: to_user, // We send it back to the sender
                                    from: from_user,
                                    type: 'chat'
                                });
                                var date = new Date();
                                message_tempall.c('body').t(result[i].message).up(); // Because of the question mark n stuff
                                var status = message_tempall.c('status', {xmlns: 'status:namespace'});
                                status.c('message_id').t(message_id).up();
                                status.c('received').t(result[i].received).up();
                                status.c('receivedTime').t(result[i].receivedTime).up();
                                status.c('read').t(result[i].is_read).up();
                                status.c('readTime').t(result[i].readTime).up();
                                status.c('sentTime').t(result[i].sentTimeMicro).up();

                                var senderinfo = message_tempall.c('senderinfo', {xmlns: 'senderinfo:namespace'});
                                senderinfo.c('senderid').t(senderid).up();
                                senderinfo.c('sendername').t(sendername).up();
                                if(result[i].group_id == 1) //If in case of group msg
                                {
                                    message_tempall.c('groupinfo', {xmlns: 'groupinfo:namespace'});
                                }
                                message_tempall.c('offline', {xmlns: 'offline:namespace'}).t('').up();
                            }
                            //content.t(JSON.stringify(contents));
                            message_custom.c('offline', {xmlns: 'offline:namespace'}).t('').up();
                            client.send(message_custom);
                            logger.info(message_custom.toString());
                            client.send(new xmpp.Stanza('message', { to: '',from: '', type: 'chat'}).c('body').t('eom'));
                            // Make user online only after chatmessageall is sent
                            server.router.registerRoute(client.jid, client);
                        }
                    });
                    var config_table = new Config();
                    config_table.getlogOutAndLockOutTimes(null, function(error, result) {
                        logger.info("The error and result is");
                        logger.info(error);
                        logger.info(result);

                        if (!error) {
                            var getConfigDataJson = JSON.stringify(result);
                            var configDetails = getConfigDataJson.substring(1, getConfigDataJson .length-1);
                            logger.info(configDetails);

                            var iq = new xmpp.Element('iq', {
                                id: 'h22xA-10',
                                to: user,
                                type: 'get',
                            });

                            var configuresettingIQ = iq.c('configuresettingIQ', {
                                xmlns: 'urn:xmpp:GetConfigureSetting'
                            });
                            configuresettingIQ.c('settingDetails').t('').up()
                            .c('action_type').t('ConfigureSetting').up()
                            .c('response').t(configDetails).up();
                            logger.info("The Config IQ stanza is");
                            logger.info(iq.toString());
                            client.send(iq);
                        }
                    });
                    var message = new Message({
                        from_user: user
                    });

                    message.getRosterUsers(null, function(error, result){
                        if(!error){
                            for(var i = 0; i < result.length; i++){
                                if(result[i].group_jid)
                                {
                                    group = 1;
                                    user_main = result[i].group_jid;
                                }
                                else{
                                    var group = 0;
                                    if(result[i].to_user == user)
                                        user_main = RosterSplit(result[i].from_user);
                                    else
                                        user_main = RosterSplit(result[i].to_user);
                                }
                                if(group)
                                {
                                    var groupMessage = new GroupMessage({
                                        group_id: groupSplit(user_main),
                                        i: i,
                                        group_name: result[i].first_name,
                                        group_jid: user_main,
                                        is_broadcast: result[i].is_broadcast
                                    });
                                    groupMessage.getGroupinfo(null, function(error, result_users, i, group_name, group_jid, is_broadcast) {
                                        logger.info(result_users);
                                        logger.info('the eye'+i);
                                        if(RosterSplit(result_users[0].id_admin) == user)
                                            var owner = 1;
                                        else
                                            var owner = 0;
                                        var finalResult = {
                                            group_id: group_jid,
                                            group_owner_jid: RosterSplit(result_users[0].id_admin),
                                            groupname: group_name,
                                            is_owner: owner,
                                            error: false,
                                            GroupParticipants: result_users,
                                            status: 'success',
                                            message: "Add successful",
                                            type: 'result'
                                        }
                                        var toOthers = new xmpp.Element('iq', {
                                            id: stanza.attrs.id, // We copy the ID
                                            to: stanza.attrs.from, // We send it back to the sender
                                            type: 'get'
                                        });
                                        var addgroupparticipantIQ = toOthers.c('creategroupIQ', {
                                            xmlns: 'urn:xmpp:CreateGroup'
                                        });

                                        addgroupparticipantIQ.c('groupDetails').t('').up();
                                        logger.info("is is_broadcast"+is_broadcast);
                                        if(!is_broadcast){
                                            addgroupparticipantIQ.c('action_type').t('offlinesyncgroup').up(); 
                                        }else{
                                            logger.info("is offlinesyncBroadcastgroup");
                                            addgroupparticipantIQ.c('action_type').t('offlinesyncBroadcastgroup').up();
                                        }
                                        addgroupparticipantIQ.c('response').t(JSON.stringify(finalResult)).up();
                                        logger.info('--Roster group - Add participant stanza--');
                                        logger.info(toOthers.toString());
                                        client.send(toOthers);
                                    });
                                }
                            }
                        }
                    });
                }
                if(message_history  && message_history.attrs.xmlns == 'urn:xmpp:getmessagehistory' && action_type == 'getMessagesByDate')
                {
                    var from_date = message_history.getChild('from')?message_history.getChild('from').getText():'';
                    var to_date = message_history.getChild('to')?message_history.getChild('to').getText():'';
                    
                    var jid_to = message_history.getChild('jid_to')?message_history.getChild('jid_to').getText():'';
                    var jid_from = message_history.getChild('jid_from')?message_history.getChild('jid_from').getText():'';
                    
                    logger.info('Message history - Load more triggered - by:: '+user);
                    logger.info('Load more triggered - from date:: '+from_date);
                    logger.info('Load more triggered - to date:: '+to_date);
                    logger.info('Load more triggered - to:: '+jid_to);
                    logger.info('Load more triggered - from:: '+jid_from);

                    var message_msg = new Message({
                        from_user: user,
                        message_delivered_dtime: from_date,
                        message_read_dtime : to_date,
                        jid_to: jid_to,
                        jid_from: jid_from
                    });
                    message_msg.getRosterMessagesDate(null, function(error, result, checker){
                        if(!error){

                            if(result.length > 0){
                                logger.info("Server: " + client.jid.local + " has unread messages");
                            }else {
                                logger.info("Server: " + client.jid.local + " has no unread messages");
                            }
                            var message_custom = new xmpp.Element('message', {
                                id: '0',
                                to: user,
                                from: user,
                                type: 'chat'
                            });
                            var contents = [];
                            var messageall = message_custom.c('messageall');
                            //var content = messageall.c('content');
                            var chatmessageall = message_custom.c('chatmessageall', {xmlns: 'chatmessageall:namespace'});
                            
                            for(var i = 0; i < result.length; i++)
                            {
                                var stanza = ltx.parse(result[i].stanza);
                                logger.info('getRosterMessages -- Sent message history');
                                var status = stanza.getChild('status');
                                var read = status.getChild('read')?status.getChild('read').getText():'';
                                var received = status.getChild('received')?status.getChild('received').getText():'';
                                
                                var body = stanza.getChild('body').getText();
                                var receivedTime = status.getChild('receivedTime')?status.getChild('receivedTime').getText():'';
                                var message_id = status.getChild('message_id')?status.getChild('message_id').getText():'';
                                var readTime = status.getChild('readTime')?status.getChild('readTime').getText():'';
                                
                                if(stanza.getChild('senderinfo'))
                                {
                                    if(stanza.getChild('senderinfo').getChild('sendername'))
                                        var sendername = stanza.getChild('senderinfo').getChild('sendername').getText();
                                    if(stanza.getChild('senderinfo').getChild('senderid'))
                                        var senderid = stanza.getChild('senderinfo').getChild('senderid').getText();
                                }
                                var date = new Date();
                                // var inside = {};
                                // inside.body = body;
                                // inside.message_id = message_id;
                                // inside.to = stanza.attrs.to;
                                // inside.to = stanza.attrs.from;
                                // inside.received = received;
                                // inside.receivedTime = receivedTime;
                                // inside.read = read;
                                // inside.readTime = readTime;
                                // contents.push(inside);
                                if(result[i].group_id == 1) //If in case of group msg
                                {
                                    logger.info('checking group msg -- offflineeee');
                                    if(result[i].from_user == user)
                                    {
                                        logger.info('same user please work!');

                                        to_user = result[i].to_user;
                                        from_user = result[i].from_user;
                                    }
                                    else {
                                        to_user = user;
                                        from_user = result[i].to_user;
                                    }

                                }
                                else {
                                    to_user = result[i].to_user;
                                    from_user = result[i].from_user;
                                }
                                var message_tempall = chatmessageall.c('message', {
                                    id: stanza.attrs.id,
                                    to: to_user, // We send it back to the sender
                                    from: from_user,
                                    type: 'chat'
                                });
                                var date = new Date();
                                message_tempall.c('body').t(result[i].message).up();
                                var status = message_tempall.c('status', {xmlns: 'status:namespace'});
                                status.c('message_id').t(message_id).up();
                                status.c('received').t(result[i].received).up();
                                status.c('receivedTime').t(result[i].receivedTime).up();
                                status.c('read').t(result[i].is_read).up();
                                status.c('readTime').t(result[i].readTime).up();
                                status.c('sentTime').t(result[i].sentTimeMicro).up();

                                var senderinfo = message_tempall.c('senderinfo', {xmlns: 'senderinfo:namespace'});
                                senderinfo.c('senderid').t(senderid).up();
                                senderinfo.c('sendername').t(sendername).up();
                                if(result[i].group_id == 1) //If in case of group msg
                                {
                                    message_tempall.c('groupinfo', {xmlns: 'groupinfo:namespace'});
                                }
                                message_tempall.c('offline', {xmlns: 'offline:namespace'}).t('').up();
                            }
                            //content.t(JSON.stringify(contents));
                            message_custom.c('offline', {xmlns: 'offline:namespace'}).t('').up();
                            var messagescount = message_custom.c('messagescount', {xmlns: 'messagescount:namespace'});
                            messagescount.c('monthmessagecount').t(result.length).up();

                            logger.info(checker);
                            if(checker[0])
                                messagescount.c('totalremainingmessagecount').t(checker[0].count).up();
                            else 
                                messagescount.c('totalremainingmessagecount').t('0').up();
                            client.send(message_custom);
                            logger.info(message_custom.toString());
                            client.send(new xmpp.Stanza('message', { to: '',from: '', type: 'chat'}).c('body').t('eom'));
                        }
                    });
                }
            }
        });
    });
}