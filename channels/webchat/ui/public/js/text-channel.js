var socket;
var medium;
var userName='';
var objectId='';
var newStatus='Success';
socket=io.connect(gOptions.chatServerTextUrl,{secure:true,rejectUnauthorized: false});
//socket=io.connect('https://localhost:8084',{secure:true,rejectUnauthorized: false});
//socket=io.connect('http://localhost:8084');	 //infarszc90963.nmumarl.lntinfotech.com/
medium = socket;
console.log('guid random generated --->>>'+guid);
var socket_login = io();
socket_login.emit('login_msg','connected to login socket');
socket_login.on('userId', function(userId){
	objectId=userId;
    console.log("got the user id: "+ userId);
	socket.emit('room',  objectId ); 
		
	//socket.on('connect', function() {
	//	socket.emit('room',  objectId ); // Emit the GUID which becomes the user ID //guid
	//}); 
		
});

	//Rosmi
	socket_login.on('username', function(username){
		userName=username;
			$("#user_name").html("<b>"+ username +"</b>");
		console.log("got the username: "+ username);
		});	
	
	//prateek
	
	socket_login.on('status', function(status){
		newStatus=status;
		if(newStatus=='Failure')	{
			$("#messageDisplay").html("<b>Please enter a valid username and password</b>");
		}
   });

console.log("text channel started");

/* socket.on('connect', function() {
		socket.emit('room', guid); // Emit the GUID which becomes the user ID
}); */
openTextSocketConnection();  
	 
	
function S4() {
return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
		
		
// Open the primary socket connection for subsequent communication
function openTextSocketConnection(){
	
	 
	// When the socket recieves a message
	socket.on('output-from-chatserver', function(data){
			  displayIncomingMessage(data.data);
			
			  //$("#typingMessage").html('');
			  $("#record_button").css("visibility","visible");
			  $("#demo").attr("placeholder","Say Something ...");
	});
	
}

// Emit a text message to the passed socket - Message goes to the chat server
function emitTextMessageInSocket(socket, messageInDiv){
	
	socket.emit('input-to-chatserver', messageInDiv);
	//console.log('Error connecting to the chat server');
	
}
