var micRecord = 'false';
var errorMessage = 'Hi, there was an issue connecting with the chat server, please try again in some time';


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
		  
		
		var welcomeString = $('#chat span').html();
			if(welcomeString !== undefined && welcomeString.indexOf('Welcome to Jarvis helpdesk Mr. Alex Paul. How can I help you today')===-1){
				displayIncomingMessage('Welcome to Jarvis helpdesk Mr. Alex Paul. How can I help you today');
			}else if(welcomeString === undefined){
				displayIncomingMessage('Welcome to Jarvis helpdesk Mr. Alex Paul. How can I help you today');
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
		  // Instance of new date
		  
      
	     // Show the new Div 
		 //message ="hello I am Saurabh XX Help me with an issue XX And another message."
		 var res = message.split("XX");
		 
	     if(null != res && res.length > 0){
			 
			for(var i = 0; i < res.length ; i++ ){
				setTimeout( sentMessage, (i+1) * 2000, res[i]);
			}
				//responsiveVoice.speak(message);
		}
   }
	
	
	function sentMessage(message){
		var date=new Date();
        var time=date.toLocaleTimeString();
		//console.log("response =========", res[i],time);
		
		$("#chat").append("<table border='0'><tr><td><div style='margin-left: 85px; margin-right: 5px;  margin-bottom:15px; box-shadow: 1px 1px 4px; background-color: #d0eaea; padding: 8px; word-wrap: break-word; width: 207px; border-radius: 5px 5px 5px 5px'><span><b><font color='#4483c4' face='arial'>Jarvis -</font></b>&nbsp;&nbsp;&nbsp;<font size='1px' color='#727272'>" + time + "</font><br> <font color='#333333' face='arial'>"+ message +"</font></span></div></td><td style='vertical-align: top'><img src='./imgs/bot.png' height='40px' width='40px' style='margin-bottom: 15px; margin-right:20px;'></td></tr></table>");
		
		 var objDiv = document.getElementById("chat");
         objDiv.scrollTop = objDiv.scrollHeight;
	}	
	
	// Display the incoming message
	function displayOutgoingMessage( message ){
		  
		  // Instance of new date
		  var date=new Date();
          var time=date.toLocaleTimeString();
      
	       $("#chat").append("<table border='0'><tr><td style='vertical-align: top'><img src='./imgs/human.png' height='45px' width='45px' style='margin-bottom: 15px'></td><td><div style=' margin-bottom:15px; word-wrap: break-word; box-shadow: 1px 1px 4px; padding:8px; background-color: #f7e5c9; width: 207px; border-radius: 5px 5px 5px 5px'><span><b><font color='#b61c1c' face='arial'>Alex Paul -</font></b>&nbsp;&nbsp;&nbsp;<font size='1px' color='#727272'>"+ time +"</font><br> <font face='arial' color='#333333'>"+ message +"</font></span></td></tr></table></div>");
      
           var objDiv = document.getElementById("chat");
           objDiv.scrollTop = objDiv.scrollHeight;
		   $("#demo").attr("placeholder","Jarvis is typing.....");
		  // $("#typingMessage").html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="white" size="2px">Jarvis is typing...</font>');
		  
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

  

     