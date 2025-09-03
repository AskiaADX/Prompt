(function($) {
    $.fn.adcPrompt = function(options) {
        return this.each(function() {
         console.log("Options passed in:", options);   
        var $this = $(this);            
		var adcinstanceID = options.instanceId;
		var maxPrompt = options.maxPrompts;
            console.log("maxPrompt typeof:", typeof maxPrompt);
            console.log("maxPrompt value:", maxPrompt);
		var cntPrompt = 0;
		var punctMarks = ['.', ',', '!', '?', ';'];


    function displayRandomMessage() {
		var questionText = '!!CurrentQuestion.LongCaption!!';
		var responseText = document.getElementById(options.inputId).value.trim();
    	
    

		// Just do nothing if there's no open end response or if the min char count is not met
		if (responseText != "" && responseText != undefined && responseText.trim().length >= options.minChars) {
			cntPrompt++;
        
        // Make "Next" visible if cntPrompt >= 1
    		if (cntPrompt >= 1) {
        		const nextBtn = document.getElementsByName("Next")[0];
       			 if (nextBtn) {
          			  nextBtn.style.visibility = "visible";
       			 }
   			 }
        
        	//Remove listeners if max prompts reached
            console.log("cntPrompt:", cntPrompt, "maxPrompt:", maxPrompt);
				if (cntPrompt >= maxPrompt && maxPrompt != 0) { 
		 			
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

if (options.useSpace) {
document.addEventListener('keydown', handleSpacedown);
}
                         
// PUNCTUATION LISTENER

function handlePunctdown(event) {
   if (punctMarks.includes(event.key)) {
      displayRandomMessage();
      console.log("Prompt triggered by punctuation (instance " + adcinstanceID + ")");
    }
  }

if (options.useEnd) {
    document.addEventListener('keydown', handlePunctdown);
}
// TIME-BASED PROMPTS

if (options.timePrompt > 0) {  
	let delay = options.timePrompt * 1000;
	let typingTimer; // Variable to store the timeout ID

	function handleKeyup() {
    	clearTimeout(typingTimer); // Clear any previous timeout
   	 	typingTimer = setTimeout(displayRandomMessage, delay); // Set a new timeout
	}


    window.addEventListener('keyup', handleKeyup);
}

console.log('adcinstanceID:', adcinstanceID);
console.log(options.maxPrompts);
    });
 };
})(jQuery);