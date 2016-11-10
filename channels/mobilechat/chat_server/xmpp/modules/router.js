var xmpp         = require('../index');
var ltx          = require('ltx');
var util         = require('util');
var EventEmitter = require('events').EventEmitter;
var logger       = require('../../utility/logger');
var Message      = require("../../tables/message.js").Message;
var Users = require("../../tables/users.js").Users;
var db = require("../../lib/Database"),
    dateHelper = require("../../utility/DateHelper");
	 var i=0 , j=0, k=0 , l=0;
function RosterSplit(jid) {
    var res = jid.split("/");
    return res[0];
}
function groupSplit(gid)
{
    var res = gid.split("@");
    return res[0];
}
function Router(server) {
    this.sessions = {};
    this.server = server;
}
util.inherits(Router, EventEmitter);

/**
* Routes messages */
Router.prototype.route = function(stanza, from) {
    var self = this;
    stanza.attrs.xmlns = 'jabber:client';
    if (stanza.attrs.type == 'chat' &&  stanza.attrs && stanza.attrs.to && stanza.attrs.to !== this.server.options.domain) {
        var groupinfo = stanza.getChild('groupinfo');
        
        if(groupinfo == undefined || typeof groupinfo === "undefined" )
        {
            if(stanza.getChild('status'))
            {
                if(stanza.getChild('status').getChild('delete'))
                {
                    var delete_id = stanza.getChild('status').getChild('delete').getText();
                    
                    var message = new Message({
                        message_id: delete_id
                    });
                    message.delete();
                }
            }
            var status = stanza.getChild('status')
            var received = status.getChild('received')?status.getChild('received').getText():'';
            if(received == 0)
                self.updateHide(stanza);

            var toJid = new xmpp.JID(stanza.attrs.to);
            logger.info('*********Messages - One to One*************');
                logger.info(stanza.toString());
            logger.info('**********************');
            //if(toJid.domain === this.server.options.domain) {
            if (self.sessions.hasOwnProperty(toJid.bare().toString())) {
                // Now loop over all the sesssions and only send to the right jid(s)
                var sent = false, resource;
                logger.info('1 Time');
                for (resource in self.sessions[toJid.bare().toString()]) {
					i++;
					logger.info("value of i ::"+i)
                    logger.info('2 Times');
                    sent = true;
                    var delay = new Date().getTime();
                    var status = stanza.getChild('status');
                    if(status)
                    {
                        var received = status.getChild('received')?status.getChild('received').getText():'';
                        var read = status.getChild('read')?status.getChild('read').getText():'';
                        var sentTime = status.getChild('sentTime')?status.getChild('sentTime').getText():delay;
                        logger.info('Received::'+received);
                        logger.info('read::'+read);
                        if(received == 0)
                        {
                            var from_user_r = RosterSplit(stanza.attrs.from);
                            var msg = stanza.getChild('body')?stanza.getChild('body').getText():'';

                            var message = new Message({
                                stanza: stanza.toString(),
                                message: stanza.getChild('body').getText(),
                                to_user: stanza.attrs.to,
                                from_user: from_user_r,
                                is_delivered: '1',
                                is_read: '0',
                                sentTime: sentTime , //
                                delay: 0
                            });

                            message.add(null, function(error, result) {
                                if(error){
                                    logger.error('Contoller: message: Error while getting - Error:' + JSON.stringify(error));
                                }else{

                                    logger.info('Successfully message saved in to DB. ' + JSON.stringify(result));
                                    var message_status = new Message({
                                        message_id: result.insertId,
                                        to_user: stanza.attrs.to,
                                        is_delivered: '1',
                                        is_read: 0
                                    });
                                    message_status.addStatus();
                                    if(stanza.getChild('status'))
                                    {
                                        if(stanza.getChild('status').getChild('message_id'))
                                            stanza.getChild('status').getChild('message_id').text(result.insertId);
                                    }
                                    // Send the guy the message sent along with the message id
                                    if(stanza.getChild('senderinfo'))
                                    {
                                        var senderid = stanza.getChild('senderinfo').getChild('senderid').getText();
                                        var users = new Users({
                                            user_id: senderid
                                        });
                                        users.getUserWithId(null, function(error, user_details) {

                                            var message_custom = new xmpp.Element('message', {
                                                id: stanza.attrs.id,
                                                to: stanza.attrs.to,
                                                from: stanza.attrs.from,
                                                type: 'chat'
                                            });
                                            var date = new Date();
                                            var status_t = stanza.getChild('status');
                                            var sentTime = status_t.getChild('sentTime')?status_t.getChild('sentTime').getText():'0'; // 0 senttime should never happen
                                            message_custom.c('body').t(msg).up();
                                            var status = message_custom.c('status', {xmlns: 'status:namespace'});
                                            status.c('message_id').t(result.insertId).up();
                                            status.c('received').t('0').up();
                                            status.c('receivedTime').t('0').up();
                                            status.c('read').t('0').up();
                                            status.c('readTime').t('0').up();
                                            status.c('sentTime').t(sentTime).up();
                                            var senderinfo = message_custom.c('senderinfo', {xmlns: 'senderinfo:namespace'});
                                            senderinfo.c('senderid').t(senderid).up();
                                            senderinfo.c('sendername').t(user_details[0].first_name+' '+user_details[0].last_name).up();
                                            logger.info(message_custom.toString());
											j++;
											logger.info("value of j"+j);
                                            self.sessions[toJid.bare().toString()][resource].send(message_custom);
                                        });
                                    }
                                    if(from) // send ack along with message_id -- 1 tick
                                    {
                                        var senderid = stanza.getChild('senderinfo') ? stanza.getChild('senderinfo').getChild('senderid').getText() : '';
                                        var users = new Users({
                                            user_id: senderid
                                        });
                                        users.getUserWithId(null, function(error, user_details) {
                                            var message_custom = new xmpp.Element('message', {
                                                id: stanza.attrs.id,
                                                to: stanza.attrs.from, // We send it back to the sender
                                                from: stanza.attrs.to,
                                                type: 'chat'
                                            });
                                            var date = new Date();
                                            var status_t = stanza.getChild('status');
                                            var sentTime = status_t.getChild('sentTime')?status_t.getChild('sentTime').getText():'0'; // 0 senttime should never happen
                                            message_custom.c('body').t(msg).up();
                                            var status = message_custom.c('status', {xmlns: 'status:namespace'});
                                            status.c('message_id').t(result.insertId).up();
                                            status.c('received').t('1').up();
                                            status.c('receivedTime').t('0').up();
                                            status.c('read').t('0').up();
                                            status.c('readTime').t('0').up();
                                            status.c('sentTime').t(sentTime).up();
                                            var senderinfo = message_custom.c('senderinfo', {xmlns: 'senderinfo:namespace'});
                                            senderinfo.c('senderid').t(senderid).up();
                                            senderinfo.c('sendername').t(user_details[0].first_name+' '+user_details[0].last_name).up();
                                            
                                            var nick_name = stanza.getChild('group') ? stanza.getChild('group').getChild('sender').getText() : '';
                                            if(nick_name != '')
                                            {
                                                logger.info(nick_name);
                                                var group = message_custom.c('group', {
                                                    xmlns: 'group:namespace'
                                                });
                                                group.c('sender').t(nick_name).up();
                                            }
                                            logger.info('^^^^^^ Message ack sent to user ^^^^^^^^^^');
                                            
                                             logger.info('Sender id is=====' + senderid);
                                             if('t111111' != senderid){

                                             from.send(message_custom); // client.send
                                         
                                             }

                                           logger.info(message_custom.toString());
											k++;
											logger.info("value of k"+k);
                                            self.updatemessage(message_custom);
                                        });
                                    }
                                }                  
                                  
                            });
                        }
                        else if((received == 2 || read == 1) && typeof delete_id === 'undefined') // send ack to "from user"
                        {
				l++;
				logger.info("value of l"+l);
                            self.sendack(stanza);
                            var sent = true;
                        }
                    }
                    // var delay=5000;
                    // setTimeout(function(){
                    //   var delay_five = dateHelper.toMySQL(new Date());
                    //   //self.saveMessage(stanza, 2, 0, from, 1, delay_five);
                    // }, delay); 
                }
                
                // We couldn't actually send to anyone!
                if (!sent) {
                    // Latest - why remove him from the roster?
                    // Delete because, the guy is in the roster, when the if(jid) thingy gives false - atleaset the next msg will go
                    // delete self.sessions[toJid.bare().toString()]; 
                    self.emit("recipientOffline", stanza);
                    var delay = new Date().getTime();
                    var real_delay = 1;
                    var status = stanza.getChild('status');
                    logger.info('in not sent here1');
                    if(status)
                    {
                        var received = status.getChild('received')?status.getChild('received').getText():'';
                        var receivedTime = status.getChild('receivedTime')?status.getChild('receivedTime').getText():'';
                        logger.info('received::: '+received);
                        if(stanza.getChild('body') && received == 0)
                        {
                            var jids = [];
                            jids.push(stanza.attrs.to);
                            logger.info('stanza.attrs.to');
                            logger.info(stanza.attrs.to);
                            self.server.gcm.sendGcmMessage(jids);
                            self.saveMessage(stanza, 1, 0, from, 0, delay, real_delay);
                        }
                        else if(received == 2 && typeof delete_id === 'undefined') // send ack to "from user"
                        {
                            self.sendack(stanza);
                            var sent = true;
                        }
                    }
                }
            }
            else {
                var real_delay = 1;
                self.emit("recipientOffline", stanza);
                var delay = new Date().getTime();
                var status = stanza.getChild('status');
                logger.info('here2');
                logger.info(status.toString());
                if(status)
                {
                    var received = status.getChild('received')?status.getChild('received').getText():'';
                    var receivedTime = status.getChild('receivedTime')?status.getChild('receivedTime').getText():'';
                    logger.info('received::: '+received);
                    if(stanza.getChild('body') && received == 0)
                    {
                        var jids = [];
                        jids.push(stanza.attrs.to);
                        logger.info('stanza.attrs.to');
                        logger.info(stanza.attrs.to);
                        self.server.gcm.sendGcmMessage(jids);
                        self.saveMessage(stanza, 1, 0, from, 0, delay, real_delay);
                    }
                    else if(received == 2 && typeof delete_id === 'undefined') // send ack to "from user"
                    {
                        self.sendack(stanza);
                        var sent = true;
                    }
                }
            }
        }
        //}
        // else {
        //     logger.info('Invalide User domain while sending message');
        // }
    }
   
};
Router.prototype.updateHide = function(stanza) {
    var to_jid = stanza.attrs.to?RosterSplit(stanza.attrs.to):'';
    var from_jid = stanza.attrs.from?RosterSplit(stanza.attrs.from):'';

    var to_uid = stanza.attrs.to?groupSplit(stanza.attrs.to):'';
    var from_uid = stanza.attrs.from?groupSplit(stanza.attrs.from):'';
    logger.info('to_jid'+to_jid);
    logger.info('from_jid'+from_jid);
    logger.info('to_uid'+to_uid);
    logger.info('from_uid'+from_uid);
    var self = this;
    var users = new Users({
        user_id: from_uid,
        to_hide_jid: to_jid
    });
    users.getHiddenUsers(null, function(error, result, to_hide_jid, from_jid){
        logger.info('hidden users - router');
        logger.info(result[0].hidden_jids);
        var hidden_jid_arr = [];
        if(result[0].hidden_jids)
            hidden_jid_arr = result[0].hidden_jids.split(",");
        if(hidden_jid_arr.indexOf(to_hide_jid) > -1)
        {
            // User already exits in the hidden list
            var i = hidden_jid_arr.indexOf(to_hide_jid);
            if(i != -1) {
                hidden_jid_arr.splice(i, 1);
            }
            var comma_list = hidden_jid_arr.join();
            logger.info('from_Jidddd'+from_jid);
            var users = new Users({
                user_id: from_jid,
                to_hide_jid: comma_list
            });
            users.updateHiddenUser();
        }
        else {
            // User does not exist in the list.
        }
    });

    var users = new Users({
        user_id: to_uid,
        to_hide_jid: from_jid
    });
    users.getHiddenUsers(null, function(error, result, to_hide_jid, to_jid){
        logger.info('hidden users - router');
        logger.info(result[0].hidden_jids);
        var hidden_jid_arr = [];
        if(result[0].hidden_jids)
            hidden_jid_arr = result[0].hidden_jids.split(",");
        if(hidden_jid_arr.indexOf(to_hide_jid) > -1)
        {
            // User already exits in the hidden list
            var i = hidden_jid_arr.indexOf(to_hide_jid);
            if(i != -1) {
                hidden_jid_arr.splice(i, 1);
            }
            var comma_list = hidden_jid_arr.join();
            logger.info('from_Jidddd22'+from_jid);
            var users = new Users({
                user_id: to_jid,
                to_hide_jid: comma_list
            });
            users.updateHiddenUser();
        }
        else {
            logger.info('User does not exits in the hidden list');
        }
    });
}

Router.prototype.sendack = function(stanza) {
    var send_it_to = stanza.attrs.to?stanza.attrs.to:'';
    var self = this;
    var status = stanza.getChild('status');
    var receivedConfirm = status.getChild('receivedConfirm') ? status.getChild('receivedConfirm').getText() : '';
    var readConfirm = status.getChild('readConfirm') ? status.getChild('readConfirm').getText() : '';
    logger.info(readConfirm);
    logger.info(receivedConfirm);
    logger.info('came inside -- From user:: '+send_it_to)
    if(send_it_to != '')
    {
        var body = stanza.getChild('body');
        var status = stanza.getChild('status')
        if(body)
        {
            if(readConfirm == 1 || receivedConfirm == 1)
            {
                // Do nothing -- Dont send ack
            }
            else 
            {
                var toJid = new xmpp.JID(send_it_to);
                if (self.sessions.hasOwnProperty(toJid.bare().toString())) { // Check if the guy is online
                    var body_text = body.getText();
                    if (self.sessions.hasOwnProperty(toJid.bare().toString())) {
                        for (resource in self.sessions[toJid.bare().toString()]) {
                            logger.info(resource);
                            self.sessions[toJid.bare().toString()][resource].send(stanza);
                        }
                    }
                }
            }
            // update receivedConfirm and readConfirm - anyway
            // update received and read as 2 even if the guy is offline.
            logger.info('sent ack to user about message - Now we Go update');
            self.updatemessage(stanza);
        }
    }
}
Router.prototype.updatemessage = function(stanza,nostanza_update) {
    var status = stanza.getChild('status');
    if(status)
    {
        var message_id = status.getChild('message_id');
        if(message_id)
        {
            var read = status.getChild('read')?status.getChild('read').getText():'';
            var received = status.getChild('received')?status.getChild('received').getText():'';
            var receivedTime = status.getChild('receivedTime').getText()?status.getChild('receivedTime').getText():'';
            var readTime = status.getChild('readTime').getText()?status.getChild('readTime').getText():'';
            var message_id = status.getChild('message_id').getText()?status.getChild('message_id').getText():'';
            var receivedConfirm = status.getChild('receivedConfirm')?status.getChild('receivedConfirm').getText():'';
            var readConfirm = status.getChild('readConfirm')?status.getChild('readConfirm').getText():'';
            var from_user = RosterSplit(stanza.attrs.from);
            var to_user = RosterSplit(stanza.attrs.to);
            if(nostanza_update == 1)
                stanza = undefined;
            var message = new Message({
                message_delivered_dtime: receivedTime,
                message_read_dtime: readTime,
                is_delivered: received,
                is_read: read,
                message_id: message_id,
                to_user: from_user,
                from_user: to_user,
                stanza: stanza,
                receivedConfirm: receivedConfirm,
                readConfirm: readConfirm
            });
            logger.info('updateeeee');
            message.update();
        }
    }
}
Router.prototype.saveMessage = function(stanza, is_delivered, is_read, client, dontsend, delay, real_delay) {
    var self = this;
    var real_delay = real_delay ? real_delay : 1;
    logger.info('modules/router.js - executing saveMessage()');
    var status = stanza.getChild('status');
    var sentTime = status.getChild('sentTime')?status.getChild('sentTime').getText():delay;
    logger.info(sentTime);
    logger.info('sentTime');
    var from_user_r = RosterSplit(stanza.attrs.from);
    var msg = stanza.getChild('body')?stanza.getChild('body').getText():'';
    var time = new Date().getTime();
    var message = new Message({
        stanza: stanza.toString(),
        message: stanza.getChild('body').getText(),
        to_user: stanza.attrs.to,
        from_user: from_user_r,
        sentTime: sentTime,
        delay: real_delay // Offline message 
    });

    message.add(null, function(error, result) {

        if(error){
        
            logger.error('Contoller: message: Error while getting - Error:' + JSON.stringify(error));
            
        
        }else{

            logger.info('Successfully message saved in to DB. ' + JSON.stringify(result));
            var message_status = new Message({
                message_id: result.insertId,
                to_user: stanza.attrs.to,
                is_delivered: is_delivered,
                is_read: is_read
            });
            message_status.addStatus();
            if(client)
            {
                if(!dontsend)
                {
                    var senderid = stanza.getChild('senderinfo') ? stanza.getChild('senderinfo').getChild('senderid').getText() : '';
                    var users = new Users({
                        user_id: senderid
                    });
                    users.getUserWithId(null, function(error, user_details) {
                        var message_custom = new xmpp.Element('message', {
                            id: stanza.attrs.id,
                            to: stanza.attrs.from, // We send it back to the sender
                            from: stanza.attrs.to,
                            type: 'chat'
                        });
                        var status_t = stanza.getChild('status');
                        var sentTime = status_t.getChild('sentTime')?status_t.getChild('sentTime').getText():'0'; // 0 senttime should never happen
                                                
                        //var date = new Date().getTime();
                        message_custom.c('body').t(msg).up();
                        var status = message_custom.c('status', {xmlns: 'status:namespace'});
                        status.c('message_id').t(result.insertId).up();
                        status.c('received').t(is_delivered).up();
                        status.c('receivedTime').t('0').up();
                        status.c('read').t(is_read).up();
                        status.c('readTime').t('0').up();
                        status.c('sentTime').t(sentTime).up();
                        var senderinfo = message_custom.c('senderinfo', {xmlns: 'senderinfo:namespace'});
                        senderinfo.c('senderid').t(senderid).up();
                        senderinfo.c('sendername').t(user_details[0].first_name+' '+user_details[0].last_name).up();
                        var nick_name = stanza.getChild('group') ? stanza.getChild('group').getChild('sender').getText() : '';
                        if(nick_name != '')
                        {
                            logger.info(nick_name);
                            var group = message_custom.c('group', {
                                xmlns: 'group:namespace'
                            });
                            group.c('sender').t(nick_name).up();
                        }
                        logger.info('^^^^^^ Message ack sent to user - save msg ^^^^^^^^^^');
                        client.send(message_custom);
                        self.updatemessage(message_custom);
                        logger.info(message_custom.toString());
                    });
                }
            }
        }
          
    });
}

Router.prototype.registerRoute = function(jid, client) {
    // Remove duplicates
    if (!this.sessions.hasOwnProperty(jid.bare().toString()))
        this.sessions[jid.bare().toString()] = {}; 
        
    this.sessions[jid.bare().toString()][jid.resource] = client;
    var user_jid = jid.bare().toString();
    var users = new Users({
        status: 1,
        jid: user_jid
    });
    users.addStatus(null, function(error, result){
        if(!error){
            logger.info('store status in mysql user table');
        }
    });
    return true;
};

Router.prototype.connectedClientsForJid = function(jid) {
    jid = new xmpp.JID(jid);
    if (!this.sessions.hasOwnProperty(jid.bare().toString())) {
        return [];
    }
    else {
        var jids = [];
        for(var resource in this.sessions[jid.bare().toString()]) {
            jids.push(new xmpp.JID(jid.bare().toString() + "/" + resource));
        }
        return jids;
    }
};


Router.prototype.unregisterRoute = function(jid, client) {
    if (!this.sessions.hasOwnProperty(jid.bare().toString())) {
        logger.error('There is no user with jid - ' + jid.bare().toString())
    } else {
        delete this.sessions[jid.bare().toString()];
    }
    logger.info('this.sessions');
    var date = new Date();
    logger.info('Removing user from list :: '+jid.bare().toString()+' AT:: '+date);
    logger.info(this.sessions);
    var user_jid = jid.bare().toString();
    var users = new Users({
        status: 0,
        jid: user_jid
    });

    users.addStatus(null, function(error, result){
        if(!error){
            logger.info('store status in mysql user table');
        }
    });
    return true;
};

exports.configure = function(server) {

    var router = new Router(server); 
    server.on('connect', function(client) {
        // When the user is online, let's register the route. there could be other things involed here... like presence! 
        client.on('online', function() {
            logger.info(" client online - in router ");

            logger.info(router.sessions.hasOwnProperty(client.jid.bare().toString()));

          //  if(router.sessions.hasOwnProperty(client.jid.bare().toString()))
              //  router.registerRoute(client.jid, client);
              if(true){
                  router.registerRoute(client.jid, client);
              }
        });
        
        // When the user is offline, we remove him from the router.
        client.on('end', function() {
            if(client.jid) {
                // We may not have a jid just yet if the client never connected before
                //router.unregisterRoute(client.jid, client);
            }
        });

        // this callback is called when the client sends a stanza.
        client.on('stanza', function(stanza) {
            router.route(stanza, client);  // Let's send the stanza to the router and let the router decide what to do with it.
            if (stanza.is('iq')) {
                var stzArray = ltx.parse(stanza.toString());
                var message_history = stzArray.getChild('MessageHistoryIQ');
                if(message_history)
                {
                    var action_type = stzArray.getChild('MessageHistoryIQ').getChild('action_type').getText();
                    if(action_type == 'quitapp')
                    {
                        var date = new Date();
                        logger.info('quitapp called at for user::'+client.jid+" at::"+date);
                        logger.info(stanza.toString());
                        router.unregisterRoute(client.jid, client);
                    }
                }
            }
        });

        // On Disconnect event. When a client disconnects
        client.on('disconnect', function () {

            logger.info('Server:', 'client got disconnected -- Router');

            if(client.jid){
                //router.unregisterRoute(client.jid, client);    
            }
            
        })

    });
    server.router = router; 
}
