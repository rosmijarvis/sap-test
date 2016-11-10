var xmpp        = require('../index');
var ltx         = require('ltx');
var Message      = require("../../tables/message.js").Message;
var Message      = require("../../tables/message.js").Message;
var GroupMessage = require("../../tables/groupmessage.js").GroupMessage;
var logger       = require('../../utility/logger');
var Users = require("../../tables/users.js").Users;

// http://xmpp.org/extensions/xep-0160.html
function Offline() {
}

exports.configure = function(server) {

    server.router.on("recipientOffline", function(stanza) {
        if(stanza.is("message")) {
            // if(stanza.getChild('status'))
            // {
            //     if(stanza.getChild('status').getChild('received'))
            //         stanza.getChild('status').getChild('received').text('1');
            // }
            stanza.c("delay", {xmlns: 'urn:xmpp:delay', from: '', stamp: ISODateString(new Date())}).t("Offline Storage");
            // store message in database 
            //server.router.saveMessage(stanza, 1, 0);
        }
    });
    
    server.on('connect', function(client) {
        client.on("online", function() {

            // retrieve offline messages for logged in client - client.jid.bare().toString()
            // client.send(ltx.parse(message.stanza));
            
            var user = client.jid.user + '@' + client.jid._domain;

            logger.verbose("user :::"+ user);

            var groupMessage = new GroupMessage({
                user_id: user
            });
            groupMessage.getOfflineGroup(null, function(error, result){

                logger.verbose('getOffline Group Roster');
                // if(!error){
                //     for(var i=0;i<result.length;i++)
                //     {
                //         var group_details_other = {
                //             group_id: result[i].group_id,
                //             group_owner_jid: result[i].admin_id,
                //             groupname: groupName,
                //             is_owner: 0,
                //             error: false,
                //             status: 'success',
                //             message: 'Group Created',
                //             type: 'result'
                //         }
                //         var group_details_json = JSON.stringify(group_details_other);
                //         var rosterGrpMsgs_other = new xmpp.Element('iq', {
                //             id: stanza.attrs.id, // We copy the ID
                //             to: stanza.attrs.from, // We send it back to the sender
                //             type: 'get'
                //         });
                //         var searchIQ_other = rosterGrpMsgs_other.c('creategroupIQ', {
                //             xmlns: 'urn:xmpp:CreateGroup'
                //         });
                //         searchIQ_other.c('groupDetails').t('').up().c('action_type').t('Create Group').up().c('response').t(group_details_json).up();
                //         logger.verbose('Sending offline group roster');
                //         logger.verbose(rosterGrpMsgs_other.toString());
                //         client.send(rosterGrpMsgs_other);
                //     }
                // }

            });
            var message = new Message({
                to_user: user
            });
            message.getOfflineMessages(null, function(error, result){

                logger.verbose('getOfflineMessages');

                if(!error){

                    if(result.length > 0){
                        logger.verbose("Server: " + client.jid.local + " has unread messages");
                    }else {
                        logger.verbose("Server: " + client.jid.local + " has no unread messages");
                    }
                    for(var i = 0; i < result.length; i++){
                        var stanza = ltx.parse(result[i].stanza);
                        logger.verbose('offline msg - Thhhal');
                        
                        // logger.verbose(stanza.attrs.from);
                        // logger.verbose(stanza.attrs.to);
                        // logger.verbose('offline msg end');
                        stanza.getChild('status').getChild('message_id').text(result[i].message_id);
                        //client.send(stanza);
                        logger.verbose(stanza.toString());
                        // var senderid = stanza.getChild('senderinfo').getChild('senderid').getText();
                        // var users = new Users({
                        //     user_id: senderid
                        // });
                        // users.getUserWithId(null, function(error, user_details) {
                        //     //if(stanza.getChild('senderinfo'))
                        //     //    stanza.getChild('senderinfo').getChild('sendername').text(user_details[0].first_name+' '+user_details[0].last_name).up();
                        //     logger.verbose(stanza.toString());
                            
                        // });
                    }
                }
            });
            var groupMessage = new GroupMessage({
                user_id: user,
                delivered: 0
            });
            groupMessage.offlineGroupGet(null, function(error, result){
                logger.verbose(result);
                for(var i = 0; i < result.length; i++)
                {
                    client.send(result[i].stanza);
                    var groupMessage = new GroupMessage({
                        id: result[i].id,
                        delivered: 1
                    });
                    groupMessage.offlineGroupUpdate();
                }
            });
        });
    });
}

function ISODateString(d) {
    function pad(n){
        return n<10 ? '0'+n : n
    }
    return d.getUTCFullYear()+'-'
    + pad(d.getUTCMonth()+1)+'-'
    + pad(d.getUTCDate())+'T'
    + pad(d.getUTCHours())+':'
    + pad(d.getUTCMinutes())+':'
    + pad(d.getUTCSeconds())+'Z'
}

