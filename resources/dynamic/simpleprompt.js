(function() {
var adcinstanceID = {%= CurrentADC.InstanceID %};

var maxPrompt = {};
var cntPrompt = {};
var punctMarks = ['.', ',', '!', '?', ';'];


maxPrompt[adcinstanceID] = {%=CurrentADC.PropValue("maxPrompts")%};
cntPrompt[adcinstanceID] = 0;


    function displayRandomMessage() {
		var questionText = '!!CurrentQuestion.LongCaption!!';
		var responseText = document.getElementById('!!CurrentQuestion.InputName()!!').value.trim();
    	
    

		// Just do nothing if there's no open end response or if the min char count is not met
		if (responseText != "" && responseText != undefined && responseText.trim().length >= {%=CurrentADC.PropValue("minChars")%}) {
			cntPrompt[adcinstanceID]++;
        
        // Make "Next" visible if cntPrompt >= 1
    		if (cntPrompt[adcinstanceID] >= 1) {
        		const nextBtn = document.getElementsByName("Next")[0];
       			 if (nextBtn) {
          			  nextBtn.style.visibility = "visible";
       			 }
   			 }
        
        	//Remove listeners if max prompts reached
				if (cntPrompt[adcinstanceID] >= maxPrompt[adcinstanceID] && maxPrompt[adcinstanceID] != 0) { 
		 			
		  			window.removeEventListener("keyup", handleKeyup);
          			document.removeEventListener('keydown', handleSpacedown);
         			document.removeEventListener('keydown', handlePunctdown);
          			console.log("Listeners removed for instance " + adcinstanceID);
			}

        
 //Get unique container for this instance
  var messageElement = document.getElementById("messageDisplay_" + adcinstanceID);
        
if (messageElement) {
            // STEP 1: Show jumping dots as loading indicator
            messageElement.innerHTML = `<span class="jumping-dots"><span></span><span></span><span></span></span> `;
            messageElement.style.display = '';        
        
		// STEP 2: Build prompt
  		var messages = [
		{%
			Dim i
			Dim myQuestion = Survey.Questions.FindByShortcut(CurrentADC.PropValue("promptQuestion"))
			For i = 1 To  myQuestion.Responses.Count 
			%}"{%:= myQuestion.Responses[i].Caption %}" {%:= On(i <> myQuestion.Responses.Count, ",", "") %}
			{%
  				Next
			%}

  		];

  var randomIndex = Math.floor(Math.random() * messages.length); 
  var randomMessage = messages[randomIndex];

    
  // STEP 3: Simulate a loading delay before showing Prompt
setTimeout(() => {
     messageElement.textContent = randomMessage;
     
	// STEP 4: Animate bubble
      messageElement.classList.add("ChangeTo");
      setTimeout(() => {
      messageElement.classList.remove("ChangeTo");
           }, 1000);
    }, 1000); // show loading dots for 1 second before displaying message
  } else {
    console.error("Element not found for ID: messageDisplay_" + adcinstanceID);
 		 }
	}
}

// SPACEBAR LISTENER

function handleSpacedown(event) {
    if (event.code === 'Space') {
         displayRandomMessage();
        console.log("Prompt triggered by spacebar (instance " + adcinstanceID + ")"); 
    }
}
{% IF CurrentADC.PropValue("useSpace") = "1" Then %}
document.addEventListener('keydown', handleSpacedown);
{% EndIF %}

// PUNCTUATION LISTENER

function handlePunctdown(event) {
   if (punctMarks.includes(event.key)) {
      displayRandomMessage();
      console.log("Prompt triggered by punctuation (instance " + adcinstanceID + ")");
    }
  }
{% IF CurrentADC.PropValue("useEnd") = "1" Then %}
document.addEventListener('keydown', handlePunctdown);
{% EndIF %}

// TIME-BASED PROMPTS
{% IF CurrentADC.PropValue("timePrompts") >= "1" Then %}

   
	let delay = {%=CurrentADC.PropValue("timePrompts")%} * 1000;
	let typingTimer; // Variable to store the timeout ID

	function handleKeyup() {
    	clearTimeout(typingTimer); // Clear any previous timeout
   	 	typingTimer = setTimeout(displayRandomMessage, delay); // Set a new timeout
	}

window.addEventListener('load', function() {
	window.addEventListener('keyup', handleKeyup);
});	
{% EndIF %}
console.log('adcinstanceID:', adcinstanceID);
})();