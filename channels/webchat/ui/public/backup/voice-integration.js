

     window.SpeechRecognition = window.SpeechRecognition       ||
                                 window.webkitSpeechRecognition ||
                                 null;
      var recognizer;
	  var recordedText;
								 
      if (window.SpeechRecognition === null) {
        
		//alert('Not recognized');
		document.getElementById('ws-unsupported').classList.remove('hidden');
        document.getElementById('record').setAttribute('disabled', 'disabled');
        document.getElementById('stop').setAttribute('disabled', 'disabled');
     
	 } else {
		  
		//alert('Recognized');  
        recognizer = new window.SpeechRecognition();
		recognizer.continuous = true;
		
		
	  }	
	  
	     // Start recognising
        recognizer.onresult = function(event) {
          //transcription.textContent = '';
         
		  
          for (var i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              recordedText = event.results[i][0].transcript;
            } else {
				
              recordedText += event.results[i][0].transcript;
            }
          }
        };