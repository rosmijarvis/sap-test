function check(event)
   {
      var x=event.which || event.keyCode;
    //var m=document.getElementById('demo').value;
    //document.getElementById("date").innerHTML="Hello, the key value is "+x+" and text value is "+m;
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
   
     var a;
     if(null == message){
		 
	   //alert('In send message');
       a=document.getElementById('demo').value;
       document.getElementById('demo').value='';
		 
	 }else{
		 
		 a = message;
		 
	 }
   
       
       //var socket1=io.connect('http://127.0.0.1:8080');
     if(a)
     {
        var date1=new Date();
        var time1=date1.toLocaleTimeString();
        $("#chat").append("<table border='0'><tr><td style='vertical-align: top'><img src='human2.png' height='45px' width='45px' style='margin-bottom: 15px'></td><td><div style=' margin-bottom:15px; word-wrap: break-word; box-shadow: 1px 1px 4px; padding:8px; background-color: #f7e5c9; width: 207px; border-radius: 5px 5px 5px 5px'><span><b><font color='#b61c1c' face='arial'>Alex Paul -</font></b>&nbsp;&nbsp;&nbsp;<font size='1px' color='#727272'>"+time1+"</font><br> <font face='arial' color='#333333'>"+a+"</font></span></td></tr></table></div>");
       // console.log("Done");
       var objDiv = document.getElementById("chat");
         objDiv.scrollTop = objDiv.scrollHeight;
        //alert(a);
		socket.emit('input',a);
        //document.getElementById('status').innerHTML="Message Sent";
     }
   
   }
    function hideOne1()
      {
       //$("#changeText").html("<font color='red' size='2px'><b>&nbsp;&nbsp;LIVE CHAT :</b></font>&nbsp;&nbsp;<font color='white' size='2px'><b>Ask Query To The Bot&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b><span id='chatWindowMaximize' onclick='chatWindowMaximize()' style='font-size: 25px'>+</span>");
       //$("#start").html("<img src='message3.png' height='60px' width='45px' style='margin-bottom: 23px'>");
       $("#start").css({"width":"0px", "margin-bottom": "21px"});
       $("#chatBox").hide();
       $("#chatBoxextend").hide();
	   
	   //
	   
	 socket.on('output', function(data){
	 //alert('response');	 
      var date2=new Date();
      var time2=date2.toLocaleTimeString();
       //console.log("Doen Here")
         $("#chat").append("<table border='0'><tr><td><div style='margin-left: 85px; margin-right: 5px;  margin-bottom:15px; box-shadow: 1px 1px 4px; background-color: #d0eaea; padding: 8px; word-wrap: break-word; width: 207px; border-radius: 5px 5px 5px 5px'><span><b><font color='#4483c4' face='arial'>Jarvis -</font></b>&nbsp;&nbsp;&nbsp;<font size='1px' color='#727272'>"+time2+"</font><br> <font color='#333333' face='arial'>"+data+"</font></span></div></td><td style='vertical-align: top'><img src='bot3.png' height='40px' width='40px' style='margin-bottom: 15px; margin-right:20px;'></td></tr></table>");
         var objDiv = document.getElementById("chat");
         objDiv.scrollTop = objDiv.scrollHeight;
		  var msg = new SpeechSynthesisUtterance(data);
          window.speechSynthesis.speak(msg);
      });
     
	  
	  }
      

      function chatWindowMinimize(){
        $("#start").css("margin-bottom","0px")
        $("#chatBox").hide();
      $("#chatBoxextend").hide();
      }
      function openChat()
      {
        $("#start").css({ "width": "350px" , "margin-left" : "950px", "height":"100px"});
        $("#start").html("<table border='0'><tr><td><div><img src='message.png' height='40px' width='38px'></td></div><td style='vertical-align: top'><div id='changeText'><font color='red' size='2px'><b>&nbsp;&nbsp;LIVE CHAT :</b></font>&nbsp;&nbsp;<font color='white' size='2px'><b>Ask Query To The Bot&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b><b><span id='chatWindowMaximize' style='font-size: 25px'>-</b></font></div></td></tr><tr><td><input type='button'  id='record' value='Record'></td><td><input type='button'  id='stop' value='Stop'></td></tr></table>");
        $("html, body").animate({ scrollTop: $(document).height() }, 1000); 
        $("#start").css("margin-bottom","450px");
        $("#chatBox").show();
        $("#chatBoxextend").show();
		
		$( "#record" ).click(function() {
             //alert( "1234" );
			 recognizer.start();
			 //$('#record').attr('id','stop');
        });
		
		
		$( "#stop" ).click(function() {
             //alert( "5678" );
			 recognizer.stop();
			 //$('#stop').attr('id','record');
			 send_message(recordedText);
        });
		
      }
     