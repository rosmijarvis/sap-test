var xmpp        = require('../index');
var ltx         = require('ltx');
var Message     = require("../../tables/message.js").Message;
var util        = require('util');
var EventEmitter = require('events').EventEmitter;
var logger       = require('../../utility/logger');
var schedule     = require('node-schedule');
var config_file = require('../../config');
var Message      = require("../../tables/message.js").Message;
var GroupMessage = require("../../tables/groupmessage.js").GroupMessage;
var Users = require("../../tables/users.js").Users;
var fs = require('fs');
var async = require('async');

function convertDate(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat);
  var val = parseInt(config_file.global.logspan);
  d.setDate(d.getDate()-val);
  return [pad(d.getMonth()+1), pad(d.getDate()), d.getFullYear()].join('-');
}

exports.configure = function(server, config) {

    var user_cron = new schedule.RecurrenceRule();
    user_cron.minute = new schedule.Range(0, 59, 1);

    schedule.scheduleJob(user_cron, function(){
        logger.info(user_cron);
        var self = server.router.sessions;
        logger.verbose('-- Executing Cron for user offline --');
        

        var self = server.router.sessions;
        logger.info(self);
        var jids = [];
        for(var k in self) jids.push(k);

        logger.info(jids);
        logger.info('-- online users for user offline --');
        for(var i=0;i<jids.length;i++)
        {
            var users = new Users({
                jid: jids[i]
            });
            users.checkUserOffline(null, function(error, result, jid){
                if(result.length == 0)
                {
                    var hear_beat_iq = new xmpp.Element('iq', {
                        id: 'r85Io-48',
                        to: jids[i],
                        type: 'get'
                    });
                    var HeartBeatIQ = hear_beat_iq.c('HeartBeatIQ', {xmlns: 'urn:xmpp:GetHeartBeat'});
                    HeartBeatIQ.c('action_type').t('IsClientAppAlive').up();
                    HeartBeatIQ.c('response').t('').up();

                    var self = server.router.sessions;
                    var toJid = new xmpp.JID(jid);
                    if (self.hasOwnProperty(toJid.bare().toString())) {
                        for (resource in self[toJid.bare().toString()]) {
                            logger.info('online guy sending hearbeat: '+toJid.bare().toString());
                            if(resource)
                            {
                                var self = server.router.sessions;
                                logger.info('hear_beat_iq');
                                logger.info(hear_beat_iq.toString());
                                logger.info(resource);
                                logger.info(toJid);
                                logger.info(self);
                                logger.info('dafaq??? is this??');
                                if(self[toJid.bare().toString()])
                                    self[toJid.bare().toString()][resource].send(hear_beat_iq);
                                server.router.unregisterRoute(toJid);
                            }
                        }
                    }
                }
            });
        }
        logger.info('-- online users end for user offline --');
    });

    var j = schedule.scheduleJob({hour: 00, minute: 00}, function(){
        logger.info('Deleting old logs');
        var last_date = convertDate(new Date());
        fs.readdir('././logs/', function (err,data){
            if(err)
            {
                logger.info(err);
            }
            else {
                logger.info(last_date);
                logger.info(data.length);
                for(var l = 0; l < data.length; l++)
                {
                    var date_string = data[l].substring(9, data[l].length);
                    var main_date = new Date(date_string);

                    if(main_date.getTime() < new Date(last_date).getTime())
                    {
                        logger.info(main_date);
                        fs.unlink('././logs/main.log.'+date_string);
                    }
                }
            }
        });
    });
    var rule = new schedule.RecurrenceRule();
    rule.second = [0, 20, 40];
    schedule.scheduleJob(rule, function(){
        var jids = [];
        logger.verbose('-- Executing Cron --');
        var self = server.router.sessions;
        logger.info(self);
        var jids = [];
        for(var k in self) jids.push(k);

        logger.info('-- online users --');
        logger.info(jids);
        logger.info('-- online users end --');

        for(var i=0;i<jids.length;i++)
        {
            var grp_offline = new GroupMessage({
                user_id: jids[i],
                jids:jids,
                i:i
            });
            grp_offline.getOfflineGroup(null, function(error, result_group, jids, i) {
                logger.verbose('-- Sending undelivered groups --');
                for(var g=0;g<result_group.length;g++)
                {
                    var group_stanza = ltx.parse(result_group[g].stanza.toString());
                    group_stanza.attrs.to = jids[i];
                    logger.verbose(group_stanza.toString());

                    var toJid = new xmpp.JID(group_stanza.attrs.to);

                    if (self.hasOwnProperty(toJid.bare().toString())) {
                        for (resource in self[toJid.bare().toString()]) {
                            logger.verbose(resource);
                            self[toJid.bare().toString()][resource].send(group_stanza);
                        }
                    }
                }
                var message = new Message({
                    from_user: jids[i],
                    i:i
                });
       /*          message.getCronMessages(null, function(error, result, i) {
                    var self = server.router.sessions;
                    if(result.length > 0)
                    {
                        logger.verbose('-- Sending undelivered messages --');
                        for(var j=0;j<result.length;j++)
                        {
                            if(result[j])
                            {
                                var message = result[j].message;
                                var user = result[j].user_id;
                                var stanza = ltx.parse(result[j].stanza.toString());
                                var toJid = new xmpp.JID(user);
                                if(result[j].group_id == 1)
                                {
                                    stanza.attrs.to = result[j].user_id;
                                    stanza.attrs.from = result[j].to_user;
                                    stanza.attrs.type = "chat";
                                }
                                else {
                                    stanza.attrs.to = result[j].to_user;
                                    stanza.attrs.from = result[j].from_user;
                                }
                                stanza.getChild('status').getChild('received').text('0');
                                stanza.getChild('status').getChild('receivedTime').text('0');
                                stanza.getChild('status').getChild('readTime').text('0');
                                if(stanza.getChild('status').getChild('message_id').getText() != 0)
                                {
                                    logger.verbose(stanza.toString());
                                    logger.verbose('cron1 - stanza');
                                    if (self.hasOwnProperty(toJid.bare().toString())) {
                                        for (resource in self[toJid.bare().toString()]) {
                                            logger.verbose(resource);
                                            self[toJid.bare().toString()][resource].send(stanza);
                                        }
                                    }
                                }
                                else {
                                    logger.verbose(stanza.toString());
                                    logger.verbose('cron1 - bug messageId with 0 - Debug - stanza');
                                }
                            }
                        }
                    }
                }); */
                var message = new Message({
                    from_user: jids[i],
                    i:i
                });
      /*           message.getCronMessagesStatus(null, function(error, result, i) {
                    var self = server.router.sessions;
                    if(result.length > 0)
                    {
                        logger.verbose('-- Sending undelivered statuses --');
                        for(var j=0;j<result.length;j++)
                        {
                            if(result[j])
                            {
                                if(result[j].group_id != 1) // No need for group status - they will get it anyways
                                {
                                    var message = result[j].message;
                                    var user = result[j].from_user;
                                    var stanza = ltx.parse(result[j].stanza.toString());
                                    var toJid = new xmpp.JID(user);
                                    stanza.attrs.to = result[j].from_user; // reverse users for correct update of confirm coloumns
                                    stanza.attrs.from = result[j].to_user;
                                    stanza.getChild('status').getChild('received').text('2');
                                    stanza.remove('delay');
                                    
                                    if(stanza.getChild('status').getChild('message_id').getText() != 0)
                                    {
                                        logger.verbose('cron2 - stanza');
                                        logger.verbose(stanza.toString());
                                        if (self.hasOwnProperty(toJid.bare().toString())) {
                                            for (resource in self[toJid.bare().toString()]) {
                                                logger.verbose(resource);
                                                if(resource)
                                                    self[toJid.bare().toString()][resource].send(stanza);
                                            }
                                        }
                                    }
                                    else {
                                        logger.verbose(stanza.toString());
                                        logger.verbose('cron2 - bug messageId with 0 - Debug - stanza');
                                    }
                                }
                            }
                        }
                    }
                }); */
            });
        }
    });
}

