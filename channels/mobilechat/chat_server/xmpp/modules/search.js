var xmpp        = require('../index');
var ltx         = require('ltx');
var Message      = require("../../tables/message.js").Message;
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var logger       = require('../../utility/logger');

function Search(server) {
    this.server = server;
}
util.inherits(Search, EventEmitter);
exports.configure = function(server, config) {

    var search = new Search(server);
    server.on('connect', function(client) {
        client.on("stanza", function(stz) {
            if(stz && stz.children[0])
                var action_name = stz.children[0].name;
            if(stz.attrs.xmlns == null || action_name != 'searchIQ')
            {   
                // Dont do anything - Some other stanza
            }
            else if(action_name == 'searchIQ')
            {
                var stzArray = ltx.parse(stz.toString());
                var ty = stzArray.getChild('searchIQ').getChildren('search_key');
                var final_var = ty[0].toString();
                var search_key_1 = final_var.split('<search_key>');
                if(search_key_1[1])
                    var search_key = search_key_1[1].split('</search_key>');
                else 
                    var search_key = [];

                var user = client.jid.user + '@' + client.jid._domain;

                logger.info('Search Key::'+search_key[0]);
                logger.info('User:: '+user);
                var message = new Message({
                    stanza: search_key[0],
                    from_user: user
                });
                message.getSearchContact(null, function(error, result){
                    if(result.length > 0)
                        var json_users = JSON.stringify(result);
                    else
                        var json_users = '';
                    var userData = new xmpp.Element('iq', {
                        id: stz.attrs.id, // We copy the ID
                        to: stz.attrs.from, // We send it back to the sender
                        type: 'result'
                    });
                    userData.c('searchIQ', {xmlns: 'urn:xmpp:SearchContact'})// We add a children tag `query`, with the two attribute xmlns and ver
                    .c('search_key').t(search_key[0]).up()
                    .c('action_type').t('getSearchList').up()
                    .c('response').t(json_users).up();
                    client.send(userData);
                });
            }
        });

    });
    server.search = search;
}

