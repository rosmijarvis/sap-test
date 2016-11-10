var db = require("../../lib/Database");
dateHelper = require("../../utility/DateHelper");
var xmpp = require('../index');
var config = require('../../config');
var util = require('util');
var ltx = require('ltx');
var EventEmitter = require('events').EventEmitter;
var GroupMessage = require("../../tables/groupmessage.js").GroupMessage;
var logger = require('../../utility/logger');
var Message      = require("../../tables/message.js").Message;
var Users = require("../../tables/users.js").Users;

function groupSplit(gid) {
    var res = gid.split("@");
    return res[0];
}

function RosterSplit(jid) {
    var res = jid.split("/");
    return res[0];
}

exports.configure = function(server, config) {
    server.on('connect', function(client) {
        client.on("stanza", function(stanza) {
            var user = client.jid.user + '@' + client.jid._domain;
            if (stanza.children[0])
                var action_name = stanza.children[0].name;
            if (stanza.is('iq')) {
                var stzArray = ltx.parse(stanza.toString());
                var creategroupIQ = stzArray.getChild('creategroupIQ');
                if(stzArray.getChild('creategroupIQ'))
                    var action_type = stzArray.getChild('creategroupIQ').getChild('action_type')?stzArray.getChild('creategroupIQ').getChild('action_type').getText():'';
                var addgroupparticipantIQ = stzArray.getChild('addgroupparticipantIQ');     
                var removegroupparticipantIQ = stzArray.getChild('removegroupparticipantIQ');
                var groupinfoIQ = stzArray.getChild('groupinfoIQ');
                var groupinfoIQ = stzArray.getChild('groupinfoIQ');
                var groupmsgstatusIQ = stanza.getChild('groupmsgstatusIQ');
                logger.verbose(groupmsgstatusIQ);


                var groupmsgstatusIQ = stanza.getChild('groupmsgstatusIQ');
                 logger.verbose(groupmsgstatusIQ);

                //Group Message Status Info
                if(groupmsgstatusIQ  && groupmsgstatusIQ.attrs.xmlns == 'urn:xmpp:GetGroupMsgStatusInfo'){
                     logger.verbose('Getting group message status information');
                    var group_details = JSON.parse(groupmsgstatusIQ.getChild('groupDetails').getText());
                     logger.verbose("The group Details are");
                     logger.verbose(group_details);
                    if (group_details.GroupMessageID != '') {
                        var groupMessage = new GroupMessage({
                            message_id: group_details.GroupMessageID
                        });
                        groupMessage.getGroupMessageStatusInfo(null, function(error, result) {
                             logger.verbose("The error is");
                             logger.verbose(error);
                            if(!error){
                                var messageInfoJson = JSON.stringify(result);
                                logger.verbose("420 Message");
                                logger.verbose(messageInfoJson);

                                var readParticipantArray = [];
                                var deliveredParticipantArray = [];

                                for(var i=0; i<result.length; i++){
                                    readParticipantArray.push({
                                        jid: result[i].jid,
                                        first_name: result[i].first_name,
                                        last_name: result[i].last_name,
                                        is_read: result[i].is_read,
                                        readtime: result[i].readTime
                                        //readtime: result[i].receivedTime

                                    });

                                    deliveredParticipantArray.push({
                                        jid: result[i].jid,
                                        first_name: result[i].first_name,
                                        last_name: result[i].last_name,
                                        received: result[i].received,
                                        receivedTime: result[i].receivedTime
                                        //receivedTime:result[i].readTime

                                    });
                                }

                                logger.verbose("The read and delivered array are");
                                logger.verbose(readParticipantArray);
                                logger.verbose(deliveredParticipantArray);

                                var finalResponseData = {
                                    status: 'success',
                                    error: '',
                                    message: 'Group Message Status Info',
                                    ReadParticipant: readParticipantArray,
                                    DeliveredParticipant: deliveredParticipantArray
                                };

                                logger.verbose("The final array is");
                                logger.verbose(finalResponseData);

                                var responseData = new xmpp.Element('iq', {
                                    id: stanza.attrs.id, // We copy the ID
                                    to: stanza.attrs.from, // We send it back to the sender
                                    type: 'get'
                                });

                                var groupmsgstatus = responseData.c('groupmsgstatusIQ', {
                                    xmlns: 'urn:xmpp:GetGroupMsgStatusInfo'
                                });
                                groupmsgstatus.c('groupDetails').t('').up();
                                groupmsgstatus.c('action_type').t('GroupMessageStatusInfo').up();
                                groupmsgstatus.c('response').t(JSON.stringify(finalResponseData)).up();

                                logger.verbose(responseData.toString());
                                client.send(responseData);
                                 logger.verbose("The response data is");
                                 logger.verbose(responseData.toString());
                            }
                        });
                    }
                }
                // Exit group
                if (creategroupIQ && action_type == 'ExitParticipantFromGroup') {
                    logger.info('Group Exit: User:: '+user);
                    if(creategroupIQ.getChild('groupDetails')) 
                    {
                        var groupDetails = JSON.parse(creategroupIQ.getChild('groupDetails').getText());
                        var groupMessage = new GroupMessage({
                            group_id: groupSplit(groupDetails.group_jid),
                            user_id: RosterSplit(groupDetails.group_participaintJID)
                        });
                         logger.verbose('Exit_group for user:: '+groupDetails.group_participaintJID);
                        groupMessage.exitGroup(null, function(error, result_del) {
                            if(!error)
                            {
                                var groupDetails = JSON.parse(creategroupIQ.getChild('groupDetails').getText());
                                var groupMessage = new GroupMessage({
                                    user_id: groupDetails.group_participaintJID
                                });
                                 logger.verbose("ddd:::"+groupDetails.group_participaintJID);
                                groupMessage.getGroupuserinfo(null, function(err,result){
                                     logger.verbose('get the users full');
                                     logger.verbose(result);
                                    if(!err)
                                    {
                                        var finalResult = {
                                            group_id: groupDetails.group_jid,
                                            group_owner_jid: RosterSplit(stanza.attrs.from),
                                            groupname: groupDetails.group_name,
                                            is_owner: 1,
                                            error: false,
                                            GroupParticipants: result,
                                            status: 'success',
                                            message: 'Exited Successfully',
                                            type: 'result'
                                        }
                                         logger.verbose(finalResult);
                                        var toOwner = new xmpp.Element('iq', {
                                            id: stanza.attrs.id, // We copy the ID
                                            to: stanza.attrs.from, // We send it back to the sender
                                            type: 'get'
                                        });
                                        var creategroupIQ = toOwner.c('creategroupIQ', {
                                            xmlns: 'urn:xmpp:CreateGroup'
                                        });
                                        creategroupIQ.c('groupDetails').t('').up()
                                        .c('action_type').t('ExitParticipantFromGroup').up()
                                        .c('response').t(JSON.stringify(finalResult)).up();
                                        logger.verbose('finddd ex');
                                        logger.verbose(toOwner.toString());
                                        client.send(toOwner);
                                        var groupMessage = new GroupMessage({
                                            group_id: groupSplit(groupDetails.group_jid)
                                        });
                                        groupMessage.getGroupinfo(null, function(error, result_users) {
                                            var self = server.router.sessions;
                                            for(var i = 0; i<result_users.length;i++)
                                            {
                                                logger.verbose('matched client:');
                                                logger.verbose(result_del);
                                                if(result_del[0])
                                                {
                                                    if(result_del[0].jid == result_users[i].jid)
                                                    {
                                                        var is_owner = 1;
                                                    }
                                                    else {
                                                        var is_owner = 0;
                                                    }
                                                    var finalResult = {
                                                        status: 'success',
                                                        message: "Remove successful",
                                                        GroupParticipants: result,
                                                        group_id: groupDetails.group_jid,
                                                        group_owner_jid: RosterSplit(result_del[0].jid),
                                                        groupname: groupDetails.group_name,
                                                        is_owner: is_owner,
                                                        error: false,
                                                        type: 'result'
                                                    };
                                                }
                                                else {
                                                    var finalResult = {
                                                        status: 'success',
                                                        message: "Remove successful",
                                                        GroupParticipants: result,
                                                        group_id: groupDetails.group_jid,
                                                        group_owner_jid: RosterSplit(stanza.attrs.from),
                                                        groupname: groupDetails.group_name,
                                                        is_owner: 0,
                                                        error: false,
                                                        type: 'result'
                                                    };
                                                }
                                                logger.verbose('the removed client:'+result_users[i].jid);
                                                // var toOtherusers_message = new xmpp.Stanza('message', 
                                                // { 
                                                //     to: result[i].jid, type: 'chat', 
                                                //     from: groupDetails.group_jid
                                                // })
                                                // .c('body').t(groupDetails.group_jid+' have exited group: '+ groupDetails.group_name).up();

                                                // var group = toOtherusers_message.c('group', {
                                                //     xmlns: 'group:namespace'
                                                // });
                                                // group.c('sender').t(groupDetails.group_name).up()
                                                // .c('info').t('yes').up();

                                                
                                                var toOthers = new xmpp.Element('iq', {
                                                    id: stanza.attrs.id, // We copy the ID
                                                    to: stanza.attrs.from, // We send it back to the sender
                                                    type: 'get'
                                                });
                                                var addgroupparticipantIQ = toOthers.c('creategroupIQ', {
                                                    xmlns: 'urn:xmpp:CreateGroup'
                                                });
                                                addgroupparticipantIQ.c('groupDetails').t('').up()
                                                .c('action_type').t('RemoveGroupParticipant').up()
                                                .c('response').t(JSON.stringify(finalResult)).up();
                                                logger.verbose('--- remove from the group while exit ');
                                                logger.verbose(toOthers.toString());
                                                var user_name = 'User';
                                                if(result[0])
                                                    user_name = result[0].first_name+' '+result[0].last_name;
                                                var toOtherusers_message = new xmpp.Stanza('message', { to: result_users[i].jid, from: groupDetails.group_jid, type: 'chat'})
                                                .c('body').t(user_name+' has exited from group').up();
                                                var serverTime = new Date().getTime();
                                                var status = toOtherusers_message.c('status', {xmlns: 'status:namespace'});
                                                status.c('message_id').t('0').up();
                                                status.c('received').t('0').up();
                                                status.c('receivedTime').t(serverTime).up();
                                                status.c('read').t('0').up();
                                                status.c('readTime').t(serverTime).up()
                                                status.c('sentTime').t(serverTime).up();
                                                var group = toOtherusers_message.c('groupinfo', {
                                                    xmlns: 'groupinfo:namespace'
                                                });
                                                group.c('isinfomessage').t('true');
                                                logger.verbose(toOtherusers_message.toString());
                                                toJid_others = new xmpp.JID(result_users[i].jid);
                                                if (self.hasOwnProperty(toJid_others.bare().toString())) {
                                                    for (resource in self[toJid_others.bare().toString()]) {
                                                        self[toJid_others.bare().toString()][resource].send(toOthers);
                                                        self[toJid_others.bare().toString()][resource].send(toOtherusers_message);
                                                    }
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
                if (creategroupIQ && creategroupIQ.attrs.xmlns == 'urn:xmpp:CreateGroup' && action_type == 'CreateGroup') {
                    if(creategroupIQ.getChild('status'))
                    {
                        var receivedConfirm = creategroupIQ.getChild('status').getChild('receivedConfirm').getText();
                        if(receivedConfirm)
                        {
                            var group_response = JSON.parse(creategroupIQ.getChild('response').getText());
                            logger.verbose(group_response);
                            var group_id = groupSplit(group_response.group_id);
                            var groupMessage = new GroupMessage({
                                user_id: RosterSplit(stanza.attrs.to),
                                group_id: group_id
                            });
                            logger.verbose('Acknolgement -Create Group- A OK for user::'+stanza.attrs.to);
                            groupMessage.setOfflineGroup();
                        }
                    }
                    else {
                        var groupDetails = creategroupIQ.getChild('groupDetails');
                        var arr = groupDetails.children;
                        arr = JSON.parse(arr);

                        //To fetch all the user IDs of a group
                        var groupContacts = arr.GroupContacts;

                        //To fetch name of a group
                        var groupName = arr.GroupName;

                        var groupMessage = new GroupMessage({
                            from_user: user,
                            group_name: groupName,
                            created_by_user_id: stanza.attrs.from,
                            is_deleted: 0
                        });
                        logger.info('Group created: Admin:: '+user);
                        groupMessage.createGroup(null, function(error, result) {
                            logger.verbose('createNewGroup');
                            var groupMessage = new GroupMessage(
                            { 
                                group_id: result.insertId,
                                group_jid: result.insertId+'@'+client.jid._domain
                            });
                            groupMessage.updateGroupJid();
                             logger.verbose('GD GP');
                             logger.verbose(groupContacts);
                            if (!error) {
                                var all_user_jids = [];
                                for(var b = 0;b<groupContacts.length;b++)
                                {
                                    all_user_jids.push("'"+groupContacts[b].participantJID+"'");
                                }
                                all_user_jids.push("'"+user+"'");
                                var groupMessage = new GroupMessage({
                                    user_id: all_user_jids
                                });
                                groupMessage.getGroupuserinfoIn(null, function(err,result_users){
                                    var group_details = {
                                        group_id: result.insertId+'@'+client.jid._domain,
                                        group_owner_jid: RosterSplit(stanza.attrs.from),
                                        groupname: groupName,
                                        is_owner: 1,
                                        error: false,
                                        GroupParticipants: result_users,
                                        status: 'success',
                                        message: 'Group Created',
                                        type: 'result'
                                    }
                                        //var json_users = JSON.stringify(participantJIDs);
                                    var group_details_json = JSON.stringify(group_details);
                                    var rosterGrpMsgs = new xmpp.Element('iq', {
                                        id: stanza.attrs.id, // We copy the ID
                                        to: stanza.attrs.from, // We send it back to the sender
                                        type: 'get'
                                    });
                                    var searchIQ = rosterGrpMsgs.c('creategroupIQ', {
                                        xmlns: 'urn:xmpp:CreateGroup'
                                    });
                                    searchIQ.c('groupDetails').t('').up().c('action_type').t('CreateGroup').up().c('response').t(group_details_json).up();
                                    client.send(rosterGrpMsgs);
                                    logger.verbose('--- group created admin ---');
                                    logger.verbose(rosterGrpMsgs.toString());
                            
                                });
                                for (var i = 0; i < participantJIDs.length; i++) {
                                    var self = server.router.sessions;
                                    var toJid = new xmpp.JID(participantJIDs[i]);
                                    // online
                                    if(user == toJid.bare().toString())
                                        var owner = 1;
                                    else
                                        var owner = 0;
                                    var groupMessage = new GroupMessage({
                                        group_id: result.insertId,
                                        user_id: RosterSplit(participantJIDs[i]),
                                        id_admin: RosterSplit(stanza.attrs.from),
                                        status: owner,
                                        is_owner: owner,
                                        group_jid: result.insertId+'@'+client.jid._domain
                                    });
                                    groupMessage.addUsersToGroup(null, function(error, result) {
                                        console.info('addUsersToGroup');
                                    });
                                }
                                // Now loop over all the sesssions and only send to the right jid(s)
                                var sent = false, resource;
                                var all_user_jids = [];
                                for(var b = 0;b<groupContacts.length;b++)
                                {
                                    all_user_jids.push("'"+groupContacts[b].participantJID+"'");
                                }
                                all_user_jids.push("'"+user+"'");
                                var groupMessage = new GroupMessage({
                                    user_id: all_user_jids
                                });
                                groupMessage.getGroupuserinfoIn(null, function(err, result_users){
                                    var self = server.router.sessions;
                                    for(var f=0;f<result_users.length;f++)
                                    {
                                        var toJid =  new xmpp.JID(result_users[f].jid);
                                        if(user == toJid.bare().toString())
                                            var owner = 1;
                                        else
                                            var owner = 0;
                                        var group_details = {
                                            group_id: result.insertId+'@'+client.jid._domain,
                                            group_owner_jid: RosterSplit(stanza.attrs.from),
                                            groupname: groupName,
                                            is_owner: owner,
                                            error: false,
                                            GroupParticipants: result_users,
                                            status: 'success',
                                            message: 'Group Created',
                                            type: 'result'
                                        }
                                            //var json_users = JSON.stringify(participantJIDs);
                                        var group_details_json = JSON.stringify(group_details);
                                        var rosterGrpMsgs = new xmpp.Element('iq', {
                                            id: stanza.attrs.id, // We copy the ID
                                            to: toJid.bare().toString(), // We send it back to the sender
                                            type: 'get'
                                        });
                                        var searchIQ = rosterGrpMsgs.c('creategroupIQ', {
                                            xmlns: 'urn:xmpp:CreateGroup'
                                        });
                                        searchIQ.c('groupDetails').t('').up().c('action_type').t('CreateGroup').up().c('response').t(group_details_json).up();
                                        logger.verbose('--- group created paricipants ---');

                                        if (self.hasOwnProperty(toJid.bare().toString())) {
                                            logger.verbose('online user CG: '+toJid.bare().toString());
                                            for (resource in self[toJid.bare().toString()]) {
                                                if(user != toJid.bare().toString())
                                                {
                                                    logger.verbose('--- group created paricipants sent---');
                                                    logger.verbose("who:"+toJid.bare().toString());
                                                    logger.verbose(rosterGrpMsgs.toString());
                                                    self[toJid.bare().toString()][resource].send(rosterGrpMsgs);
                                                    sent = true;
                                                }
                                            }
                                        }
                                        else {
                                            // Handling offline group create
                                            logger.verbose('offline user CG: '+toJid.bare().toString());
                                            var groupMessage = new GroupMessage({
                                                user_id: toJid.bare().toString(),
                                                stanza: rosterGrpMsgs,
                                                delivered: 0
                                            });
                                            groupMessage.offlineGroupSave();
                                        }
                                        var groupMessage = new GroupMessage({
                                            group_id: result.insertId,
                                            stanza: rosterGrpMsgs
                                        });
                                        groupMessage.updateGroupStanza();
                                    }
                                });
                            }
                        });
                        var participantJIDs = [];
                        participantJIDs.push(RosterSplit(stanza.attrs.from));
                        for (var i = 0; i < groupContacts.length; i++) {
                            participantJIDs.push(groupContacts[i].participantJID);
                        }
                         logger.verbose('Group Users are ' + participantJIDs);
                        var userIDs = JSON.stringify(participantJIDs);
                    }
                }
                //_______________________________________________________________________________________________________________
                else if (creategroupIQ && action_type == 'AddGroupParticipant') {
                    if(creategroupIQ.getChild('status'))
                    {
                        var receivedConfirm = creategroupIQ.getChild('status').getChild('receivedConfirm').getText();
                        if(receivedConfirm)
                        {
                            // TODO - add the ofline part
                        }
                    }
                    else {
                        // To Owner
                        var group_details = JSON.parse(stanza.getChild('creategroupIQ').getChild('groupDetails').getText());
                        logger.verbose(group_details.GroupContacts);
                            //   {"GroupContacts":[{"participantJID":"80508051@52.27.0.146"}],"GroupName":"grp","GroupJID":"1@52.27.0.146"}

                        var groupMessage = new GroupMessage({
                            group_id: groupSplit(group_details.GroupJID),
                            user_id: group_details.GroupContacts,
                            id_admin: RosterSplit(stanza.attrs.from),
                            status: '0',
                            is_owner: 0,
                            group_jid: RosterSplit(group_details.GroupJID)
                        });
                        groupMessage.addUsersToGroupIn(null, function(error, result_users) {
                            if(error)
                            {
                                logger.verbose(error);
                            }
                            else
                            {
                                // To owner
                                var all_user_jids = [];
                                for(var b = 0;b<group_details.GroupContacts.length;b++)
                                {
                                    all_user_jids.push("'"+group_details.GroupContacts[b].participantJID+"'");
                                }
                                var groupMessage = new GroupMessage({
                                    user_id: all_user_jids
                                });
                                groupMessage.getGroupuserinfoIn(null, function(error, result) {
                                    var finalResult = {
                                        group_id: group_details.GroupJID,
                                        group_owner_jid: RosterSplit(stanza.attrs.from),
                                        groupname: group_details.GroupName,
                                        is_owner: 1,
                                        error: false,
                                        GroupParticipants: result,
                                        status: 'success',
                                        message: "Add successful",
                                        type: 'result'
                                    }
                                    var toOwner = new xmpp.Element('iq', {
                                        id: stanza.attrs.id, // We copy the ID
                                        to: stanza.attrs.from, // We send it back to the sender
                                        type: 'get'
                                    });
                                    var addgroupparticipantIQ = toOwner.c('creategroupIQ', {
                                        xmlns: 'urn:xmpp:CreateGroup'
                                    });
                                    addgroupparticipantIQ.c('groupDetails').t('').up()
                                    .c('action_type').t('AddGroupParticipant').up()
                                    .c('response').t(JSON.stringify(finalResult)).up();
                                    logger.verbose('Add grup participant - Admin');
                                    logger.verbose(toOwner.toString());
                                    client.send(toOwner);
                                    var groupMessage = new GroupMessage({
                                        group_id: groupSplit(group_details.GroupJID)
                                    });
                                    groupMessage.getGroupinfo(null, function(error, result_others) {
                                        var self = server.router.sessions;
                                        var existing_users = [];
                                        for(var v = 0; v < group_details.GroupContacts.length; v++)
                                        {
                                            existing_users.push(group_details.GroupContacts[v].participantJID);
                                        }
                                        for(var i = 0; i<result_others.length;i++)
                                        {
                                            if(existing_users.indexOf(result_others[i].jid) == "-1")
                                            {
                                                if(result_others[i].jid != user)
                                                {
                                                    var finalResult = {
                                                        group_id: group_details.GroupJID,
                                                        group_owner_jid: RosterSplit(stanza.attrs.from),
                                                        groupname: group_details.GroupName,
                                                        is_owner: 0,
                                                        error: false,
                                                        GroupParticipants: result,
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
                                                    addgroupparticipantIQ.c('groupDetails').t('').up()
                                                    .c('action_type').t('AddGroupParticipant').up()
                                                    .c('response').t(JSON.stringify(finalResult)).up();
                                                    var toJid_others = new xmpp.JID(result_others[i].jid);

                                                    logger.verbose('**** Others add participants ****'+toJid_others.bare());
                                                    logger.verbose(toOthers.toString());

                                                    //Get all user's names into on
                                                    var obj = result;
                                                    var result_user_name = Object.keys(obj).map(function (key) {return obj[key]});
                                                    var user_names = [];
                                                    logger.verbose(result_user_name);
                                                    logger.verbose(result);
                                                    logger.verbose('user_names getemall');
                                                    for(var u = 0;u<result_user_name.length;u++)
                                                    {
                                                        user_names.push(result_user_name[u].first_name +' '+result_user_name[u].last_name);
                                                    }
                                                    logger.verbose(user_names);
                                                    var new_users = "New";
                                                    if(user_names.length > 0)
                                                        new_users = user_names.join();

                                                    var toOtherusers_message = new xmpp.Stanza('message', { to: result_others[i].jid, type: 'chat', from: group_details.GroupJID})
                                                    .c('body').t(new_users+' user(s) has been added to group').up();
                                                    var status = toOtherusers_message.c('status', {xmlns: 'status:namespace'});
                                                    var serverTime = new Date().getTime();
                                                    status.c('message_id').t('0').up();
                                                    status.c('received').t('0').up();
                                                    status.c('receivedTime').t(serverTime).up();
                                                    status.c('read').t('0').up();
                                                    status.c('readTime').t(serverTime).up();
                                                    status.c('sentTime').t(serverTime).up();
                                                    var group = toOtherusers_message.c('groupinfo', {
                                                        xmlns: 'groupinfo:namespace'
                                                    });
                                                    group.c('isinfomessage').t('true');
                                                    logger.verbose(toOtherusers_message.toString());
                                                    logger.info('Group user added: Admin:: '+user+' -- Added user ::'+stanza.attrs.from+' -- Group::'+group_details.GroupJID);
                                                    if (self.hasOwnProperty(toJid_others.bare().toString())) {
                                                        for (resource in self[toJid_others.bare().toString()]) {
                                                            self[toJid_others.bare().toString()][resource].send(toOthers);
                                                            self[toJid_others.bare().toString()][resource].send(toOtherusers_message);
                                                        }
                                                    }
                                                    else {
                                                        // Handling offline group create
                                                        var groupMessage = new GroupMessage({
                                                            user_id: toJid_others.bare().toString(),
                                                            stanza: toOthers,
                                                            delivered: 0
                                                        });
                                                        groupMessage.offlineGroupSave();
                                                    }
                                                }
                                            }
                                        }
                                    });
                                });
                                // To the newly added guy
                                var all_user_jids = [];
                                for(var b = 0;b<result_users.length;b++)
                                {
                                    all_user_jids.push("'"+result_users[b].jid+"'");
                                }
                                var groupMessage = new GroupMessage({
                                    user_id: all_user_jids
                                });
                                groupMessage.getGroupuserinfoIn(null, function(err,result){
                                     logger.verbose('get Groupuser information');
                                     logger.verbose(result);
                                    if(!err)
                                    {
                                        var self = server.router.sessions;
                                        for(var a=0;a<group_details.GroupContacts.length;a++)
                                        {
                                            var finalResult = {
                                                group_id: group_details.GroupJID,
                                                group_owner_jid: RosterSplit(stanza.attrs.from),
                                                groupname: group_details.GroupName,
                                                is_owner: 0,
                                                error: false,
                                                GroupParticipants: result,
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
                                            addgroupparticipantIQ.c('groupDetails').t('').up()
                                            .c('action_type').t('AddGroupParticipant').up()
                                            .c('response').t(JSON.stringify(finalResult)).up();
                                             logger.verbose('--Add group part - added guy-');
                                             logger.verbose(toOthers.toString());
                                            var toJid = new xmpp.JID(group_details.GroupContacts[a].participantJID);
                                            if (self.hasOwnProperty(toJid.bare().toString())) {
                                                for (resource in self[toJid.bare().toString()]) {
                                                     logger.verbose('--Add group part in roster - added guy-');
                                                     logger.verbose(toOthers.toString());
                                                    self[toJid.bare().toString()][resource].send(toOthers);
                                                }
                                            }
                                            else {
                                                // Handling offline group create
                                                var groupMessage = new GroupMessage({
                                                    user_id: toJid.bare().toString(),
                                                    stanza: toOthers,
                                                    delivered: 0
                                                });
                                                groupMessage.offlineGroupSave();
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
                //_________________________________________________________________________________________
                else if (creategroupIQ && action_type == 'RemoveGroupParticipant') {
                    var group_details = JSON.parse(stanza.getChild('creategroupIQ').getChild('groupDetails').getText());
                     logger.verbose(group_details);
                    var groupMessage = new GroupMessage({
                        group_id: groupSplit(group_details.group_jid),
                        user_id: RosterSplit(group_details.group_participaintJID)
                    });
                    groupMessage.removeUsersFromGroup(null, function(error, result) {
                        if(error)
                        {
                             logger.verbose(error);
                        }
                        else 
                        {
                            var groupMessage = new GroupMessage({
                                user_id: group_details.group_participaintJID
                            });
                            groupMessage.getGroupuserinfo(null, function(err,result){
                                if(!err)
                                {
                                    var finalResult = {
                                        status: 'success',
                                        message: "Remove successful",
                                        GroupParticipants: result,
                                        group_id: group_details.group_jid,
                                        group_owner_jid: RosterSplit(stanza.attrs.from),
                                        groupname: group_details.group_name,
                                        is_owner: 1,
                                        error: false,
                                        type: 'result'
                                    };
                                    var toOwner = new xmpp.Element('iq', {
                                        id: stanza.attrs.id, // We copy the ID
                                        to: stanza.attrs.from, // We send it back to the sender
                                        type: 'get'
                                    });
                                    var addgroupparticipantIQ = toOwner.c('creategroupIQ', {
                                        xmlns: 'urn:xmpp:CreateGroup'
                                    });
                                    addgroupparticipantIQ.c('groupDetails').t('').up()
                                    .c('action_type').t('RemoveGroupParticipant').up()
                                    .c('response').t(JSON.stringify(finalResult)).up();
                                     logger.verbose('--- remove group admin');
                                     logger.verbose(toOwner.toString());
                                    client.send(toOwner);

                                    // Send to the guy who was removed
                                    var self = server.router.sessions;
                                    var toJid = new xmpp.JID(group_details.group_participaintJID);
                                    var finalResult = {
                                        group_id: group_details.group_jid,
                                        group_owner_jid: RosterSplit(stanza.attrs.from),
                                        groupname: group_details.group_name,
                                        is_owner: 0,
                                        error: false,
                                        GroupParticipants: result,
                                        status: 'success',
                                        message: 'Exited Successfully',
                                        type: 'result'
                                    }
                                    var toRemoved = new xmpp.Element('iq', {
                                        id: stanza.attrs.id, // We copy the ID
                                        to: stanza.attrs.from, // We send it back to the sender
                                        type: 'get'
                                    });
                                    var addgroupparticipantIQ = toRemoved.c('creategroupIQ', {
                                        xmlns: 'urn:xmpp:CreateGroup'
                                    });
                                    addgroupparticipantIQ.c('groupDetails').t('').up()
                                    .c('action_type').t('ExitParticipantFromGroup').up()
                                    .c('response').t(JSON.stringify(finalResult)).up();
                                    logger.info('Group user removed: Admin:: '+user+' -- Removed user ::'+stanza.attrs.from+' -- Group::'+group_details.group_jid);
                                    if (self.hasOwnProperty(toJid.bare().toString())) {
                                        for (resource in self[toJid.bare().toString()]) {
                                             logger.verbose('--- Remove candidate --- to the participant');
                                             logger.verbose(toRemoved.toString());
                                             logger.verbose(toJid.bare());
                                            self[toJid.bare().toString()][resource].send(toRemoved);
                                        }
                                    }
                                    else {
                                        // Handling offline group remove
                                        var groupMessage = new GroupMessage({
                                            user_id: toJid.bare().toString(),
                                            stanza: toRemoved,
                                            delivered: 0
                                        });
                                        groupMessage.offlineGroupSave();
                                    }
                                    // To all other participants
                                    var groupMessage = new GroupMessage({
                                        group_id: groupSplit(group_details.group_jid)
                                    });
                                    groupMessage.getGroupinfo(null, function(error, result_users) {
                                        var self = server.router.sessions;
                                        for(var i = 0; i<result_users.length;i++)
                                        {
                                            if(result_users[i].jid == user || result_users[i].jid == group_details.group_participaintJID)
                                            {
                                                // Do nothing -- TODO -- nothing so far -- something will come up
                                            }
                                            else
                                            {
                                                var finalResult = {
                                                    status: 'success',
                                                    message: "Remove successful",
                                                    GroupParticipants: result,
                                                    group_id: group_details.group_jid,
                                                    group_owner_jid: RosterSplit(stanza.attrs.from),
                                                    groupname: group_details.group_name,
                                                    is_owner: 0,
                                                    error: false,
                                                    type: 'result'
                                                };
                                                var toOthers = new xmpp.Element('iq', {
                                                    id: stanza.attrs.id, // We copy the ID
                                                    to: stanza.attrs.from, // We send it back to the sender
                                                    type: 'get'
                                                });
                                                var addgroupparticipantIQ = toOthers.c('creategroupIQ', {
                                                    xmlns: 'urn:xmpp:CreateGroup'
                                                });
                                                addgroupparticipantIQ.c('groupDetails').t('').up()
                                                .c('action_type').t('RemoveGroupParticipant').up()
                                                .c('response').t(JSON.stringify(finalResult)).up();
                                                 logger.verbose('--- remove group others');
                                                 logger.verbose(toOthers.toString());

                                                 logger.verbose('the guy:'+result_users[i].jid);
                                                var toJid_others = new xmpp.JID(result_users[i].jid);

                                                // var toOtherusers_message = new xmpp.Stanza('message', { to: result_others[i].jid, type: 'chat', from: group_details.GroupJID})
                                                // .c('body').t('User has been removed from group').up();
                                                // var group = toOtherusers_message.c('groupinfo', {
                                                //     xmlns: 'groupinfo:namespace'
                                                // });
                                                // group.c('isinfomessage').t('true');
                                                // logger.verbose(toOtherusers_message.toString());
                                                logger.verbose(result);
                                                logger.verbose('isinfomessag = remove group'+ group_details.group_jid);
                                                var user_name = 'User';
                                                if(result[0])
                                                    user_name = result[0].first_name+' '+result[0].last_name;
                                                var toOtherusers_message = new xmpp.Stanza('message', { to: toJid_others.bare().toString(), from: group_details.group_jid, type: 'chat' })
                                                .c('body').t(user_name+'has been removed from group').up();
                                                var serverTime = new Date().getTime();
                                                var status = toOtherusers_message.c('status', {xmlns: 'status:namespace'});
                                                status.c('message_id').t('0').up();
                                                status.c('received').t('0').up();
                                                status.c('receivedTime').t(serverTime).up();
                                                status.c('read').t('0').up();
                                                status.c('readTime').t(serverTime).up();
                                                status.c('sentTime').t(serverTime).up();
                                                var group = toOtherusers_message.c('groupinfo', {
                                                    xmlns: 'groupinfo:namespace'
                                                });
                                                group.c('isinfomessage').t('true');
                                                logger.verbose(toOtherusers_message.toString());
                                                if (self.hasOwnProperty(toJid_others.bare().toString())) {
                                                    for (resource in self[toJid_others.bare().toString()]) {
                                                        self[toJid_others.bare().toString()][resource].send(toOthers);
                                                        self[toJid_others.bare().toString()][resource].send(toOtherusers_message);
                                                    }
                                                }
                                                else {
                                                    // Handling offline group remove
                                                    var groupMessage = new GroupMessage({
                                                        user_id: toJid.bare().toString(),
                                                        stanza: toOthers,
                                                        delivered: 0
                                                    });
                                                    groupMessage.offlineGroupSave();
                                                }
                                            }
                                        }
                                    });
                                }
                            });

                            // To the guy who has been added
                            // var group_details_js = {
                            //     group_id: group_details.GroupJID,
                            //     group_owner_jid: stanza.attrs.from,
                            //     groupname: group_details.GroupName,
                            //     is_owner: 0,
                            //     error: false,
                            //     status: 'success',
                            //     message: 'Group Created',
                            //     type: 'result'
                            // }
                            // var group_details_json = JSON.stringify(group_details_js);
                            // var toNewlyAddedUser = new xmpp.Element('iq', {
                            //     id: stanza.attrs.id, // We copy the ID
                            //     to: stanza.attrs.from, // We send it back to the sender
                            //     type: 'get'
                            // });
                            // var creategroupIQ = toNewlyAddedUser.c('creategroupIQ', {
                            //     xmlns: 'urn:xmpp:CreateGroup'
                            // });
                            // var self = server.router.sessions;
                            // creategroupIQ.c('groupDetails').t('').up().c('action_type').t('CreateGroup').up().c('response').t(group_details_json).up();
                            
                            // var toNewlyAddedUser_message = new xmpp.Stanza('message', { to: group_details.GroupContacts[0].participantJID, type: 'chat', from: group_details.GroupJID})
                            // .c('body').t('You have been added to group: '+ group_details.GroupName).up();

                            // var toJid = new xmpp.JID(group_details.GroupContacts[0].participantJID);
                            // logger.verbose(self);
                            // logger.verbose(toJid);

                            // if (self.hasOwnProperty(toJid.bare().toString())) {
                            //     for (resource in self[toJid.bare().toString()]) {
                            //         logger.verbose(resource);
                            //         self[toJid.bare().toString()][resource].send(toNewlyAddedUser);
                            //         self[toJid.bare().toString()][resource].send(toNewlyAddedUser_message);
                            //     }
                            // }
                        }
                    });
                }
                //___________________________________________________________________________________________
                else if (groupinfoIQ && groupinfoIQ.attrs.xmlns == 'urn:xmpp:GroupInfo') {
                    
                    logger.verbose('Getting group information');
                    var group_jid = groupinfoIQ.getChild('group_jid').getText() ? groupinfoIQ.getChild('group_jid').getText() : '';
                    var group_jid_wo = groupSplit(group_jid);
                    logger.info('Group info requested by '+user+' for group::'+group_jid);
                     logger.verbose(group_jid);
                     logger.verbose(group_jid_wo);
                    if (group_jid != '') {
                        var groupMessage = new GroupMessage({
                            group_id: group_jid_wo
                        });
                        groupMessage.getGroupinfo(null, function(error, result) {
                            var users_json = JSON.stringify(result);
                            var rosterGrpMsgs = new xmpp.Element('iq', {
                                id: stanza.attrs.id, // We copy the ID
                                to: stanza.attrs.from, // We send it back to the sender
                                type: 'result'
                            });
                            var groupinfoIQ = rosterGrpMsgs.c('groupinfoIQ', {
                                xmlns: 'urn:xmpp:GroupInfo'
                            });
                            groupinfoIQ.c('group_jid').t(group_jid + '@' + client.jid._domain).up()
                                .c('action_type').t('getGroupInfo').up()
                                .c('response').t(users_json).up();
                            client.send(rosterGrpMsgs);
                             logger.verbose(result);
                             logger.verbose(rosterGrpMsgs.toString());
                        });
                    }

                }
            }
            if (stanza.is('message')) {
                var stzArray = ltx.parse(stanza.toString());
                var groupinfo = stanza.getChild('groupinfo');
                if (stzArray.attrs.type == 'groupchat') {
                    logger.info('Group Message Sent by:: '+user+" to the group:: "+stanza.attrs.to);
                    var group_jid = groupSplit(stanza.attrs.to);
                    var group_plain_jid = stanza.attrs.to;
                     logger.verbose('grp jid::' + group_jid);

                    // Save as 1 message in msg table
                    var msg = stanza.getChild('body')?stanza.getChild('body').getText():'';

                    var status = stanza.getChild('status');
                    var sentTime = status.getChild('sentTime')?status.getChild('sentTime').getText():delay;
                    
                    var message = new Message({
                        stanza: stanza.toString(),
                        message: stanza.getChild('body').getText(),
                        to_user: RosterSplit(stanza.attrs.to),
                        from_user: RosterSplit(stanza.attrs.from),
                        delay: 0,
                        sentTime: sentTime,
                        group_id: 1
                    });
                    message.add(null, function(error, result) {
                        if(!error)
                        {
                            // Send ack to the guy who sent message to group - received = 1
                            stanza.getChild('status').getChild('message_id').text(result.insertId);
                            stanza.getChild('status').getChild('received').text('1');
                            
                            stanza.attrs.to = stanza.attrs.from; // Interchange Id's
                            stanza.attrs.from = group_plain_jid; // from the group - group id along with /Smack
                             logger.verbose('send the same guy his stanza with type chat');
                             logger.verbose(stanza.toString());

                            // We should not have type = "chat" when updating the stanza in our table with msg ID
                            stanza.attrs.type = 'chat';
                            client.send(stanza);

                            if(stanza.getChild('senderinfo'))
                                if(stanza.getChild('senderinfo').getChild('senderid'))
                                    var senderid = stanza.getChild('senderinfo').getChild('senderid').getText();
                            var users = new Users({
                                user_id: senderid,
                                stanza: stanza,
                                id: result.insertId
                            });
                            users.getUserWithId(null, function(error, user_details, id, result_user, stanza, group_plain_jid) {
                                // update group stanza with <message_id> tag
                                if(user_details[0].first_name)
                                {
                                    var nick_name = user_details[0].first_name+' '+user_details[0].last_name;
                                }
                                else {
                                    var nick_name = "Nick Name";
                                }
                                var msg = stanza.getChild('body').getText();
                                var message_custom = new xmpp.Element('message', {
                                    id: stanza.attrs.id,
                                    to: stanza.attrs.from, 
                                    from: stanza.attrs.to,
                                    type: 'groupchat'
                                });
                                var micro = new Date().getTime();
                                message_custom.c('body').t(msg).up();
                                var status_t = stanza.getChild('status');
                                var sentTime = status_t.getChild('sentTime')?status_t.getChild('sentTime').getText():'0';
                                var status = message_custom.c('status', {xmlns: 'status:namespace'});
                                status.c('message_id').t(id).up();
                                status.c('received').t('1').up();
                                status.c('receivedTime').t(micro).up();
                                status.c('read').t('0').up();
                                status.c('readTime').t(micro).up();
                                status.c('sentTime').t(sentTime).up();
                                message_custom.c('groupinfo', {xmlns: 'groupinfo:namespace'});
                                var senderinfo = message_custom.c('senderinfo', {xmlns: 'senderinfo:namespace'});
                                senderinfo.c('senderid').t(user_details[0].user_id).up();
                                if(user_details[0].first_name)
                                {
                                    var nick_name = user_details[0].first_name+' '+user_details[0].last_name;
                                }
                                else {
                                    var nick_name = "Nick Name";
                                }
                                senderinfo.c('sendername').t(nick_name).up();

                                logger.verbose('stanza -- updatedd with sendername - if there');
                                logger.verbose(message_custom.toString());
                                server.router.updatemessage(message_custom);
                            });



                            // We need the result.insertId - So keep it inside the add function
                            // Select all users from the group - Save message in message_status
                            var selectUsers = new GroupMessage({
                                group_id: group_jid
                            });
                            selectUsers.getGroupUsers(null, function(error, result_users) {
                                var obj = result_users;
                                var result_users = Object.keys(obj).map(function (key) {return obj[key]});

                                logger.verbose('list of users we need to send the group chat to');
                                logger.verbose(result_users);
                                var offline_users = [];
                                var offline = false;
                                for (var i = 0; i < result_users.length; i++) {
                                    // Save and send all messages in message_status - should not include the guy who sent it
                                    logger.verbose(result_users[i].user_id);
                                    logger.verbose(user);
                                    if(user != result_users[i].user_id)
                                    {
                                        var self = server.router.sessions;
                                        var toJid = new xmpp.JID(result_users[i].user_id);
                                        if (self.hasOwnProperty(toJid.bare().toString())) {
                                            var delay = 0;
                                        }
                                        else {
                                            var delay = 1;
                                        }
                                        var message_status = new Message({
                                            message_id: result.insertId,
                                            to_user: result_users[i].user_id,
                                            is_delivered: '1',
                                            is_read: 0,
                                            delay: delay
                                        });
                                        message_status.addStatus();

                                        if(stanza.getChild('senderinfo'))
                                            var senderid = stanza.getChild('senderinfo').getChild('senderid').getText();
                                        logger.verbose('what is happending');
                                        logger.verbose(result_users[i].user_id);
                                        
                                        var users = new Users({
                                            user_id: senderid,
                                            id: result.insertId,
                                            result_users: result_users[i].user_id,
                                            stanza: stanza,
                                            group_plain_jid: group_plain_jid
                                        });
                                        users.getUserWithId(null, function(error, user_details, id, result_user, stanza, group_plain_jid) {
                                            var self = server.router.sessions;

                                            var msg = stanza.getChild('body').getText();

                                            var message_custom = new xmpp.Element('message', {
                                                id: stanza.attrs.id,
                                                to: result_user, // Send to the guy in the list of group
                                                from: group_plain_jid,  // - They will send to as group JID - They want /Smack in the ID
                                                type: 'chat'
                                            });
                                            message_custom.c('body').t(msg).up();
                                            var micro = new Date().getTime();
                                            var status_t = stanza.getChild('status');
                                            var sentTime = status_t.getChild('sentTime')?status_t.getChild('sentTime').getText():'0';
                                            var status = message_custom.c('status', {xmlns: 'status:namespace'});
                                            status.c('message_id').t(id).up();
                                            status.c('received').t('0').up();
                                            status.c('receivedTime').t(micro).up();
                                            status.c('read').t('0').up();
                                            status.c('readTime').t(micro).up();
                                            status.c('sentTime').t(sentTime).up();
                                            
                                            message_custom.c('groupinfo', {xmlns: 'groupinfo:namespace'});
                                            var senderinfo = message_custom.c('senderinfo', {xmlns: 'senderinfo:namespace'});
                                            senderinfo.c('senderid').t(senderid).up();
                                            logger.verbose(user_details);
                                            if(user_details[0].first_name)
                                            {
                                                var nick_name = user_details[0].first_name+' '+user_details[0].last_name;
                                            }
                                            else {
                                                var nick_name = "Nick Name";
                                            }
                                            senderinfo.c('sendername').t(nick_name).up();

                                            logger.verbose('somegap please');
                                            logger.verbose(message_custom.toString());
                                            var toJid = new xmpp.JID(result_user);
                                            if (self.hasOwnProperty(toJid.bare().toString())) {
                                                for (resource in self[toJid.bare().toString()]) {
                                                    logger.info('online guy sending group msg: '+toJid.bare().toString());
                                                    self[toJid.bare().toString()][resource].send(message_custom);
                                                }
                                            }
                                            else {
                                                var jids = [];

                                                jids.push(toJid.bare().toString());
                                                logger.info('GCM messages sent to');
                                                logger.info(jids);
                                                server.gcm.sendGcmMessage(jids);
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
                if(groupinfo)
                {
                    logger.verbose('groupinfo');
                    logger.verbose(stanza.toString());
                    var received = stanza.getChild('status').getChild('received').getText();
                    var read = stanza.getChild('status').getChild('read').getText();
                    var receivedTime = stanza.getChild('status').getChild('receivedTime').getText();
                    var readTime = stanza.getChild('status').getChild('readTime').getText();
                    if(read == 1 || received == 2)
                    {
                        var message_id = stanza.getChild('status').getChild('message_id').getText();
                        if(groupinfo.getChild('sender'))
                            var sender = groupinfo.getChild('sender').getText();

                        // We should not have type = "chat" when updating the stanza in our table with msg ID
                        // stanza.attrs.type = 'groupchat';

                        // server.router.updatemessage(stanza);

                        if(stanza.getChild('senderinfo'))
                            if(stanza.getChild('senderinfo').getChild('senderid'))
                                var senderid = stanza.getChild('senderinfo').getChild('senderid').getText();
                        var users = new Users({
                            user_id: senderid,
                            stanza: stanza,
                            id: message_id,
                            read: read,
                            received: received,
                            readTime: readTime,
                            receivedTime: receivedTime
                        });
                        users.getUserWithId(null, function(error, user_details, id, result_user, stanza, group_plain_jid, read, received, receivedTime, readTime) {
                            // update group stanza with <message_id> tag
                            /*logger.verbose("ram asked");
                            logger.verbose(user_details[0]);
                            if(user_details[0].first_name)
                            {
                                var nick_name = user_details[0].first_name+' '+user_details[0].last_name;
                            }
                            else {
                                var nick_name = "Nick Name";
                            }*/
                            var msg = stanza.getChild('body').getText();
                            var message_custom = new xmpp.Element('message', {
                                id: stanza.attrs.id,
                                to: stanza.attrs.to, 
                                from: stanza.attrs.from,
                                type: 'groupchat'
                            });
                            message_custom.c('body').t(msg).up();
                            var status = message_custom.c('status', {xmlns: 'status:namespace'});
                            status.c('message_id').t(id).up();
                            status.c('received').t(received).up();
                            status.c('receivedTime').t(receivedTime).up();
                            status.c('read').t(read).up();
                            status.c('readTime').t(readTime).up();
                            message_custom.c('groupinfo', {xmlns: 'groupinfo:namespace'});
                            var senderinfo = message_custom.c('senderinfo', {xmlns: 'senderinfo:namespace'});
                            /*senderinfo.c('senderid').t(user_details[0].user_id).up();
                            if(user_details[0].first_name)
                            {
                                var nick_name = user_details[0].first_name+' '+user_details[0].last_name;
                            }
                            else {
                                var nick_name = "Nick Name";
                            }
                            senderinfo.c('sendername').t(nick_name).up();*/

                            logger.verbose('stanza with read and received 2 -- updatedd with sendername - if there');
                            logger.verbose(message_custom.toString());
                            server.router.updatemessage(message_custom,1);
                        });
                        // update message_status status
                        logger.verbose('update message_status status');
                        logger.verbose(stanza.toString());
                    }
                }
            }
        });
    });
}