
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

(function() {
var adcinstanceID = {%= CurrentADC.InstanceID %};

var intervalID1;
var intervalID2;
var maxPrompt = {};
var cntPrompt = {};
var punctMarks = ['.', ',', '!', '?', ';'];

maxPrompt[adcinstanceID] = {%=CurrentADC.PropValue("maxPrompts")%};
cntPrompt[adcinstanceID] = 0;


async function displayRandomMessage() {

	var questionText = '!!CurrentQuestion.LongCaption!!';
	var responseInput = document.getElementById('!!CurrentQuestion.InputName()!!');
	var responseText = responseInput.value.trim();
    var messageElement = document.getElementById("messageDisplay_" + adcinstanceID);
    
	
		if (responseText != "" && responseText != undefined && responseText.trim().length >= {%=CurrentADC.PropValue("minChars")%}) {
				cntPrompt[adcinstanceID]++;
	
        // Make "Next" visible if cntPrompt >= 1
    		if (cntPrompt[adcinstanceID] >= 1) {
        		const nextBtn = document.getElementsByName("Next")[0];
       			 if (nextBtn) {
          			  nextBtn.style.visibility = "visible";
       			 }
   			 }
        
        // Stop further prompts when the maximum is reached
					if (cntPrompt[adcinstanceID] >= maxPrompt[adcinstanceID] && maxPrompt[adcinstanceID] != 0) { 	
                        
		  			window.removeEventListener("keyup", handleKeyup);
          			document.removeEventListener('keydown', handleSpacedown);
         			document.removeEventListener('keydown', handlePunctdown);
          			console.log("Listeners removed for instance " + adcinstanceID);
			}

    if (messageElement) {
            // STEP 1: Show jumping dots as loading indicator
            messageElement.innerHTML = `<span class="jumping-dots"><span></span><span></span><span></span></span> `;
            messageElement.style.display = '';
    
        // STEP 2: Build AI prompt
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
        } else {
            console.error("Element with ID 'messageDisplay_" + adcinstanceID + "' not found.");
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