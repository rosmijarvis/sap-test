(function(window) {
	
  //var client = new BinaryClient('ws://127.0.0.1:9001');
  
  var client = new BinaryClient('wss://127.0.0.1:8090');
  //var client = new BinaryClient('wss://infarszc90963.nmumarl.lntinfotech.com:8090');
  //var client = new BinaryClient('wss://bed5ed35.ngrok.io:9001');
  // https://bed5ed35.ngrok.io
  
  var bufferSize = 2048;
  //var bufferSize = 512000;
  //var binaryServerPort = 9001;
  var binaryServerPort = 3705;
  
	client.on('stream', function(stream, meta){    
		var parts = [];
		stream.on('data', function(data){
			//console.log('==> received this back : ' + JSON.stringify(data, null, 3));
			if(data.sender=='User'){
				userVoiceInput(data.message);
			}
			if(data.sender=='Bot'){
				userVoiceOutput(data.message);
				responsiveVoice.speak(data.message, "UK English Male");
			}
		});
	});
      

  client.on('open', function() {
	
	var recording = false;
	
    //window.Stream = client.createStream();
	//window.Stream.on('data', function(data){ 
		//  console.log('client received response');
//    	  document.getElementById('speechText').value =data;
  //  });
	
	
	//var allcookies = document.cookie;
    //document.write ("All Cookies : " + allcookies );
	
			   
    if (!navigator.getUserMedia)
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
	  navigator.mozGetUserMedia || navigator.msGetUserMedia;

    //if (navigator.getUserMedia) {
    //  navigator.getUserMedia({audio:true,video:false}, success, function(e) {
     //   alert('Error capturing audio.');
    //  });
    //} else alert('getUserMedia not supported in this browser.');

	
	if (navigator.getUserMedia) {
        //navigator.getUserMedia({audio:{echoCancellation: false},video:false}, success, function(e) {
		navigator.getUserMedia({audio:true,video:false}, success, function(e) {	
        alert('Error capturing audio.');
      });
    } else alert('getUserMedia not supported in this browser.');
	
    //var recording = false;

    window.startRecording = function() {
			recording = true;	
	  
			window.Stream = client.createStream();
			
			//window.Stream.on('data', function(data){ 
			//console.log('client received response');
			//document.getElementById('speechText').value =data;
			//document.getElementById('demo').value=data;
			//});
    }

	
	window.stopRecording = function() {
      recording = false;
      window.Stream.end();
		  
    }

	
	
	
    function success(e) {
      audioContext = window.AudioContext || window.webkitAudioContext;
      context = new audioContext();

      // the sample rate is in context.sampleRate
      audioInput = context.createMediaStreamSource(e);

      //var bufferSize = 2048;
      recorder = context.createScriptProcessor(bufferSize, 1, 1);

      recorder.onaudioprocess = function(e){
        if(!recording) return;
        console.log ('recording');
        var left = e.inputBuffer.getChannelData(0);
        window.Stream.write(convertoFloat32ToInt16(left));
      }

      audioInput.connect(recorder)
      recorder.connect(context.destination); 
    }

	
	
	
	
    function convertoFloat32ToInt16(buffer) {
      var l = buffer.length;
      var buf = new Int16Array(l)

		while (l--) {
        buf[l] = buffer[l]*0xFFFF;    //convert to 16 bit
      }
      return buf.buffer
    }
	
	//function convertFloat32ToInt16(buffer) {
	//	l = buffer.length;
	//	buf = new Int16Array(l);
	//	while (l--) {
	//		buf[l] = Math.min(1, buffer[l])*0x7FFF;
	//	}
	//	return buf.buffer;
	//}
	
	
  });
})(this);
