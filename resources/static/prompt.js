async function getAI(aiInfo) {
	
    return fetch('https://ipsos.litellm-prod.ai/v1/chat/completions', {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
        {%="'" + CurrentADC.PropValue("apiHead") + "'"%}: {%="'" + CurrentADC.PropValue("apiAuth") + "'"%}   
       
	  },
	  body: JSON.stringify(aiInfo)
	})
	.then(response => {
	if (!response.ok) {
	  throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json();
	})
	.then(data => {
		console.log('Data received:', data);
		// Process the JSON data here
		return data;
	})
	.catch(error => {
		console.error('Fetch error:', error);
	});
}

(function($) {
    $.fn.adcPrompt = function(options) {
        return this.each(function() {
         console.log("Options passed in:", options);   
        var $this = $(this);            
		var adcinstanceID = options.instanceId;
		var maxPrompt = options.maxPrompts;
		var cntPrompt = 0;
		var punctMarks = ['.', ',', '!', '?', ';'];


    function displayRandomMessage() {
		
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
        
		// STEP 2: Build prompt (dynamic between AI selection)

            if (options.useAI === 1) {

                var randomIndex = Math.floor(Math.random() * options.promptArray.length); 
                var randomMessage = options.promptArray[randomIndex];
            }else{
                var aiInfo = {
		        "model": "gpt-4o",
		        "messages": [
			{
			  "role": "user",
			  "content": "Given this question '" + questionText + "' and this response '" + responseText + "' and using the language in the response, provide a short one sentence to prompt for more detail. Do not provide reasoning or explanation."
			}
		  ]
		};
            try {
                // STEP 3: Fetch AI result
                var aiResult = await getAI(aiInfo);
                var aiMessage = aiResult.choices[0].message.content;

                // STEP 4: Replace loading dots with AI message
                messageElement.textContent = aiMessage;

                // STEP 5: Animate bubble
                messageElement.classList.add("ChangeTo");
                setTimeout(() => {
                    messageElement.classList.remove("ChangeTo");
                }, 1000);
            } catch (error) {
                console.error("AI fetch error:", error);
                messageElement.textContent = "[Error generating prompt]";
                }
            }

    
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

//Step 4: Initialize Prompt Listeners
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