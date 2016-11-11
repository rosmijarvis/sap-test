(function(window) {
  
      window.SpeechRecognition = window.SpeechRecognition       ||
                                 window.webkitSpeechRecognition ||
                                 null;

      if (window.SpeechRecognition === null) {
		alert('getUserMedia not supported in this browser.');
		
      } else {
		  
        var recognizer = new window.SpeechRecognition();
        
        
        recognizer.continuous = true;
		recognizer.interimResults = false;
		
        // Start recognising
        recognizer.onresult = function(event) {
        
		  
          for (var i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
				//transcription.textContent = event.results[i][0].transcript;
				
				var textContent = event.results[i][0].transcript;
				
				//chatwindow
				//console.log(' invoking user output message start '+textContent);
				userVoiceOutput(textContent);
				//console.log(' invoking user output message end ');
				
				//chatserver
				//console.log(' invoking send message start '+textContent);
				//send_message_voice(textContent);
				//console.log(' invoking send message end');
            } else {
				//transcription.textContent += event.results[i][0].transcript;
				//userVoiceOutput(event.results[i][0].transcript);
            }
          }
        };

		
        // Listen for errors
        recognizer.onerror = function(event) {
          //log.innerHTML = 'Recognition error: ' + event.message + '<br />' + log.innerHTML;
        };

       

         
			  
		window.startRecording = function() {
			recognizer.start();
        }

		
		window.stopRecording = function() {
			recognizer.stop();
		}
		
        

      }
	})(this);  
	  