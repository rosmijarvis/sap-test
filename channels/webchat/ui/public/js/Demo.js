var micRecord = 'false';
var errorMessage = 'Hi, there was an issue connecting with the chat server, please try again in some time';

    // A utility method to get current date time
    function getTimeDate() {
                                  var date=new Date();
                                  var month=1+date.getMonth();1
          var time=date.toLocaleTimeString();
                                  var dateDayYear=date.getDate()+'/'+month+'/'+date.getFullYear();
                                  var timeDate = time+' '+dateDayYear;
                                  return timeDate;
                                }


	function check(event)
   {
      var x=event.which || event.keyCode;
    
	if(x==13)
    {
      send_message();
    }
    setTimeout(refresh1,5000);
   }
   function refresh1()
   {
     //document.getElementById('status').innerHTML="Idle";
   }
   
  /* $('#loginForm').submit(function() {
	   alert('submit called..');
    // get all the inputs into an array.
    var $inputs = $('#myForm :input');

    // not sure if you wanted this, but I thought I'd add it.
    // get an associative array of just the values.
    var values = {};
    $inputs.each(function() {
        values[this.name] = $(this).val();
    });
	console.log(JSON.stringify(values));
}); */
   
   function send_message( message )
   {   
   
	 //alert('send message called ' + message);
     var messageInDiv;
     if(null == message){
		 
	   //alert('In send message');
       messageInDiv=document.getElementById('demo').value;
       document.getElementById('demo').value='';
		 
	 }else{
		 
		 messageInDiv = message;
	 
	 }
       
     if( messageInDiv )
     {
        // Display outgoing message
		displayOutgoingMessage( messageInDiv );
  
     	if(medium.connected){
			emitTextMessageInSocket(medium, messageInDiv);
		}else{
	       
		   displayIncomingMessage(errorMessage);
		   $("#demo").attr("placeholder", "Say Something ...");
		   
		   
		}
     }
   }
   
   
   
   function send_message_voice(message)
   {   
	 //alert('send message called ');
	 if( message)
     {
        // Display outgoing message
		displayOutgoingMessage( message);
		
		
     	if(medium.connected){
			
			emitTextMessageInSocket(medium, message);
			//$("#record_button").css("visibility","visible");
			$("#demo").attr("placeholder","Jarvis is responding ...");
			
		}else{
		
	       displayIncomingMessage(errorMessage);
		}
     }
   }
   
   


    function hideOne1()
    {
      $.get("/loginAuth", function(data){
		  //console.log("something happened on page load ajax"+ data );
	  })
	   $("#start").css({"width":"0px", "margin-bottom": "21px"});
       $("#chatBox").hide();
       $("#chatBoxextend").hide();
	
     }
      

      function chatWindowMinimize(){
        $("#start").css("margin-bottom","40px")
        $("#chatBox").hide();
        $("#chatBoxextend").hide();
      }
	  
	     
	
		// Open chat window	  
		function openChat()
		{
		  
		
                                var welcomeMessage='Welcome to Jarvis helpdesk ' +userName +' . How can I help you today?';
                
                                var welcomeString = $('#chat span').html();
                                                if(welcomeString !== undefined && welcomeString.indexOf(welcomeMessage)===-1){
                                                                displayIncomingMessage(welcomeMessage);
                                                }else if(welcomeString === undefined){
                                                                displayIncomingMessage(welcomeMessage);
                                                }

		
      
        $("#start").css({ "width": "350px" , "margin-left": "910px","height":"45px"});
	    $("#start").html("<table id='chatBoxHeader' border='0'><tr width = '350px' height = '40px'><td><div><img src='./imgs/message.png' height='30px' width='30px'></td></div><td style='vertical-align: top'><div id='changeText'><div id='chat_heading'><font color='white' size='2px'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LIVE CHAT :</font><font color='white' size='2px'>&nbsp;&nbsp;&nbsp;Ask Query To The Bot &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><span id='chatWindowMaximize' style='font-size: 25px'>-</b></font></div></td></div></tr></table>");
        $("html, body").animate({ scrollTop: $(document).height() },1200); 
        $("#start").css("margin-bottom","341px");
        $("#chatBox").show();
        $("#chatBoxextend").show();
	  }
	  
	  // Display the incoming message
	  function displayIncomingMessage(message){
		  
		  // Check whether the message has multiple utterances which should be seperated into ballons
		  // The delimiter is XX 
		  
		  var res = message.split("XX");
		  
		  //console.log(res.length);
		  // If not null and length is  > 0
		  if(null != res && res.length > 0){
			 
             for(i=0; i < res.length ; i++ ){
				 
				  // Set time out of 2 seconds between each message
				  setTimeout(displayIncomingMessageHtml , (i+1) * 1000, res[i]);
				 
			 }
			 
			 
			  
		  }
		  
	      
	    
		 
    }
	
	// Display the HTML for the incoming message
	function displayIncomingMessageHtml(message){
		 
		
		 // Show the new Div 
         $("#chat").append("<table border='0'><tr><td><div style='margin-left: 85px; margin-right: 5px;  margin-bottom:15px; box-shadow: 1px 1px 4px; background-color: #d0eaea; padding: 8px; word-wrap: break-word; width: 207px; border-radius: 5px 5px 5px 5px'><span><b><font color='#4483c4' face='arial'>Jarvis -</font></b>&nbsp;&nbsp;&nbsp;<font size='1px' color='#727272'>" + getTimeDate() + "</font><br> <font color='#333333' face='arial'>"+ message +"</font></span></div></td><td style='vertical-align: top'><img src='./imgs/bot.png' height='40px' width='40px' style='margin-bottom: 15px; margin-right:20px;'></td></tr></table>");
		 //responsiveVoice.speak(message);
         var objDiv = document.getElementById("chat");
         objDiv.scrollTop = objDiv.scrollHeight;
		
		
	}
	
	
	// Display the incoming message
	function displayOutgoingMessage( message ){
		 
      
	       $("#chat").append("<table border='0'><tr><td style='vertical-align: top'><img src='./imgs/human.png' height='45px' width='45px' style='margin-bottom: 15px'></td><td><div style=' margin-bottom:15px; word-wrap: break-word; box-shadow: 1px 1px 4px; padding:8px; background-color: #f7e5c9; width: 207px; border-radius: 5px 5px 5px 5px'><span><b><font color='#b61c1c' face='arial'>"+userName+ "-</font></b>&nbsp;&nbsp;&nbsp;<font size='1px' color='#727272'>"+ getTimeDate() +"</font><br> <font face='arial' color='#333333'>"+ message +"</font></span></td></tr></table></div>");
      
           var objDiv = document.getElementById("chat");
           objDiv.scrollTop = objDiv.scrollHeight;
		   $("#demo").attr("placeholder","Jarvis is typing.....");
	
		  
    }
		


	
	function userVoiceOutput(data){
		//displayOutgoingMessage(data);
		//$("#record_button").css("visibility","visible");
		//$("#demo").attr("placeholder","Say Something ...");
		//displayIncomingMessage(response[1]);
		//displayIncomingMessage(data);
		send_message_voice(data);
	}
	
	function startVoiceRecording(){
                                           
                               console.log('Browser is recording..........');
                             
                               //$("#button1").html('Stop');
							   $("#record_button").attr("onclick","endOfVoiceRecording()");
                               //$("#button1").attr("onclick","endOfVoiceRecording()");
                               //$("#recordingMessage").html('');
							   $("#demo").attr("placeholder","Recording.....");
                               //$("#recordingMessage").html('Recording.....');
							   startRecording();
				               micRecord = 'true';
                                          
    }
    

	
    function endOfVoiceRecording(){
                                           console.log('Browser has  stopped recording..........');
                                           //$("#button1").html('Record');
                                           //$("#recordingMessage").html('');
                                           //$("#button1").attr("onclick","startVoiceRecording()");
										   $("#record_button").attr("onclick","startVoiceRecording()");
										    stopRecording();
											micRecord = 'false';
											$("#record_button").css("visibility","hidden");
										   //$("#demo").attr("placeholder","Jarvis is responding.....");
											//$("#button1").hide();
                                          // $("#recordingMessage").html('Jarvis is responding.....');
                                           
    }

  

     