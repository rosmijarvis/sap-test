var db = require("../../lib/Database");
dateHelper = require("../../utility/DateHelper");
var xmpp = require('../index');
var config = require('../../config');
var util = require('util');
var ltx = require('ltx');
var EventEmitter = require('events').EventEmitter;
var GroupMessage = require("../../tables/groupmessage.js").GroupMessage;
var logger = require('../../utility/logger');
var Message = require("../../tables/message.js").Message;
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

            logger.info("logged user :: " + user);
            //if (stanza.children[0])
            //var action_name = stanza.children[0].name;
            if (stanza.is('presence')) {
                logger.info("Presence Block is Executing");
                var stzArray = ltx.parse(stanza.toString());
                logger.info(stzArray.toString());

                var status = stzArray.getChild('status');
                logger.info("status :: " + status);
                var action_type = stzArray.getChild('status') ? stzArray.getChild('status').getText() : '';

                var status_update;

                if (status && action_type == 'DoNotDisturb') {
                    logger.info("Do Not Disturb block is executing");
                    status_update = 2;
                } else if (status && action_type == 'Busy') {
                    logger.info("Busy block is executing");
                    status_update = 3;
                } else {
                    logger.info("Online block is executing");
                    status_update = 1;
                }

                var User_status = new Users({
                    jid: user,
                    status: status_update
                });

                User_status.addStatus();



                var self = server.router.sessions;

                var jids = [];
                for (var k in self) jids.push(k);

                logger.info('-- online users --');
                logger.info(jids);
                logger.info('-- online users end --');


                var msgl = new Message({

                    from_user: user,
                    jids: jids
                });

                msgl.getRosterUsersForStatus(null, function(err, result, jids) {
                    var msgjids = [];
                    logger.info("Result Length :: " + result.length);
                    for (var k = 0; k < result.length; k++) {
                        if(user == result[k].to_user)
                            msgjids.push(result[k].from_user);
                        else
                            msgjids.push(result[k].to_user);
                    } //for K
                    logger.info('msgjids');
                    logger.info(msgjids);
                    for (var i = 0; i < jids.length; i++) {

                        if (msgjids.indexOf(jids[i]) != -1) {

                            // var toJid = new xmpp.JID(jids[i]);

                            var toOthers = new xmpp.Element('presence', {
                                id: stanza.attrs.id, // We copy the ID
                                from: user,
                                to: jids[i] // We send it back to the sender

                            });
                            var status = toOthers.c('status').t(action_type).up();

                            var crp = toOthers.c('c', {
                                xmlns: "",
                                hash: "sha-1",
                                node: "",
                                ver: "NfJ3flI83zSdUDzCEICtbypursw="
                            }).up();
                            var self = server.router.sessions;
                            var toJid = new xmpp.JID(jids[i]);
                            logger.info(toOthers.toString());
                            logger.info("toJid :: " + toJid);
                            if (self.hasOwnProperty(toJid.bare().toString())) {
                                for (resource in self[toJid.bare().toString()]) {
                                    self[toJid.bare().toString()][resource].send(toOthers); // send response to all 
                                }
                            }

                        } //IF


                    } // for i

                    logger.info(" toOthers :: " + toOthers);
                });

                logger.info("Status Method Exit");

            }

        });
    });
}