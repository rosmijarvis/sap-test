var socket;
var medium;
socket=io.connect('https://infarszc90963.nmumarl.lntinfotech.com:8084',{secure:true,rejectUnauthorized: false});
//socket=io.connect('http://localhost:8084');	 //infarszc90963.nmumarl.lntinfotech.com/
medium = socket;
var guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
	 socket.on('connect', function() {
		socket.emit('room', guid); // Emit the GUID which becomes the user ID
});  
	 
	
function S4() {
return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
		
		
// Open the primary socket connection for subsequent communication
function openTextSocketConnection(){
	//socket=io.connect('https://infarszc90963.nmumarl.lntinfotech.com:8084',{secure:true,rejectUnauthorized: false});
	//socket=io.connect('http://localhost:8084');	 //infarszc90963.nmumarl.lntinfotech.com/
    //medium = socket; 	
	
	 //var guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
	 //socket.on('connect', function() {
		//socket.emit('room', guid); // Emit the GUID which becomes the user ID
		
	 //});  
	 
	// When the socket recieves a message
	socket.on('output-from-chatserver', function(data){
			  displayIncomingMessage(data.data);
			  //$("#typingMessage").html('');	
	});
	
}

// Emit a text message to the passed socket - Message goes to the chat server
function emitTextMessageInSocket(socket, messageInDiv){
	
	socket.emit('input-to-chatserver', messageInDiv);
	//console.log('Error connecting to the chat server');
	
}
  