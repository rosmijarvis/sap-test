'use strict';

var io = require('socket.io-client');
var option='';
var uuid = require('node-uuid');
var logger = require("./logger.js");

//var socket=io.connect('https://INFARSZC90963.nmumarl.lntinfotech.com:8010',{secure:true});
//var socket=io.connect('http://INFARSZC90963.nmumarl.lntinfotech.com:8082');
var socket=io.connect('http://127.0.0.1:8082');
var room=uuid.v1();

socket.on('connect', function() {
   // Connected, let's sign-up for to receive messages for this room
   socket.emit('room', room);
});

logger.debug('client sends data to chatserver with roomID ' + room);
socket.emit('input-to-chatserver' , ' hello ');

socket.on('output-from-chatserver', function (data) {
 	
   logger.debug('client receives data from  chatserver  with roomID ' + data.room + ' data ' + data.data);
   console.log('client receives data from  chatserver with roomID ' + data.room + ' data ' + data.data);
});


