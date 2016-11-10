// to use methods from other files we simply use `require` with path name

var GoogleSTAdapter = require('./googleSTAdapter.js').GoogleSTAdapter;
var googleSpeechText = new GoogleSTAdapter();
	//send to google speech api
  googleSpeechText.invokeGoogleSpeechToText("audio2016091545310pm.wav", function( err,data ){
		if (data != null)
		  console.log(JSON.stringify(data));
  });
	

   