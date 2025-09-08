async function getAI(aiInfo, options) {
	var inputElement = document.getElementById("other" + options.inputId);
	var inputValue = inputElement ? inputElement.value.trim() : "";
	var formElement = inputElement ? inputElement.previousElementSibling : null;

	if(formElement !== null) {
		formElement.value = "|" + inputValue;
	}

	if (window.askia
		&& window.arrLiveRoutingShortcut
		&& window.arrLiveRoutingShortcut.length > 0
		&& window.arrLiveRoutingShortcut.indexOf(options.currentQuestion) >= 0) {
		askia.triggerAnswer();
	}


	/* Client side request to AI service with dynamic headers */
	/*
	const headers = {
		'Content-Type': 'application/json',
		[options.apiHead]: options.apiAuth
	};

	console.log("Headers being sent:", headers); // ✅ Debug log

	return fetch('https://ipsos.litellm-prod.ai/v1/chat/completions', {
		method: 'POST',
		headers: headers,
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
		return data;
	})
	.catch(error => {
		console.error('Fetch error:', error);
	});
	*/
}

(function($) {
	$.fn.adcPrompt = function(options) {
		
			console.log("Options passed in:", options);
			var $this = $(this);
			var adcinstanceID = options.instanceId;
			var maxPrompt = options.maxPrompts;
			var cntPrompt = 0;
			var punctMarks = ['.', ',', '!', '?', ';'];
			var lastSpacePress = 0; 
			var cooldown = (options.timeDelay || 1) * 1000; 
			var inputElement = document.getElementById("other" + options.inputId);
			var formElement = inputElement ? inputElement.previousElementSibling : null;			
			var messageElement = document.getElementById("messageDisplay_" + adcinstanceID);

			function displayRandomMessage() {
				var questionText = options.questionText;
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

					// Remove listeners if max prompts reached
					console.log("cntPrompt:", cntPrompt, "maxPrompt:", maxPrompt);
					if (cntPrompt >= maxPrompt && maxPrompt != 0) {
						window.removeEventListener("keyup", handleKeyup);
						document.removeEventListener('keydown', handleSpacedown);
						document.removeEventListener('keydown', handlePunctdown);
						console.log("Listeners removed for instance " + adcinstanceID);
					}

					if (messageElement) {
						// STEP 1: Show jumping dots as loading indicator
						messageElement.innerHTML = `<span class="jumping-dots"><span></span><span></span><span></span></span> `;
						messageElement.style.display = '';

						// STEP 2: Build prompt (dynamic between AI selection)
						if (options.useAI === 1) {
							let aiInfo = {
								"model": "gpt-4o",
								"messages": [
									{
										"role": "user",
										"content": "Given this question '" + questionText + "' and this response '" + responseText + "' and using the language in the response, provide a short one sentence to prompt for more detail. Do not provide reasoning or explanation."
									}
								]
							};

							getAI(aiInfo, options);
							
							/*
							.then(data => {
								let aiMessage = data?.choices?.[0]?.message?.content || "AI error: no response";

								setTimeout(() => {
									messageElement.textContent = aiMessage;
									messageElement.classList.add("ChangeTo");
									setTimeout(() => {
										messageElement.classList.remove("ChangeTo");
									}, 1000);
								}, 1000);
							});
							*/
						} else {
							// fallback to random prompt
							var randomIndex = Math.floor(Math.random() * options.promptArray.length);
							var randomMessage = options.promptArray[randomIndex] || "";

							// STEP 3: Simulate a loading delay before showing Prompt
							setTimeout(() => {
								messageElement.textContent = randomMessage;
								messageElement.classList.add("ChangeTo");
								setTimeout(() => {
									messageElement.classList.remove("ChangeTo");
								}, 1000);
							}, 1000); // show loading dots for 1 second before displaying message
						}
					} else {
						console.error("Element not found for ID: messageDisplay_" + adcinstanceID);
					}
				}
			}

			// Step 4: Initialize Prompt Listeners
			// SPACEBAR LISTENER
			function handleSpacedown(event) {
				if (event.code === 'Space') {
					const now = Date.now();
					if (now - lastSpacePress >= cooldown) {
						displayRandomMessage();
						console.log("Prompt triggered by spacebar (instance " + adcinstanceID + ")");
						lastSpacePress = now;
					}
				}
			}

			if (options.useSpace) {
				document.addEventListener('keydown', handleSpacedown);
			}

			// PUNCTUATION LISTENER
			function handlePunctdown(event) {
				if (punctMarks.includes(event.key)) {
					const now = Date.now();
					if (now - lastSpacePress >= cooldown) {
						displayRandomMessage();
						console.log("Prompt triggered by punctuation (instance " + adcinstanceID + ")");
						lastSpacePress = now;
					}
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

			// GET AI RESPONSE
			function handlePromptResponse(event) {
				if(event.detail.question.shortcut === options.currentQuestion && event.detail.value.startsWith("||")) {
					var aiMessage = event.detail.value.split("||")[1] || "AI error: no response";

					setTimeout(() => {
						messageElement.textContent = aiMessage;
						messageElement.classList.add("ChangeTo");
						setTimeout(() => {
							messageElement.classList.remove("ChangeTo");

							// Reset value
							formElement.value = inputElement.value.trim();
						}, 1000);
					}, 1000);
				}
			}

			if (options.useAI === 1 && formElement !== null) {
				document.addEventListener('askiaSetValue', handlePromptResponse);
			}


			console.log('adcinstanceID:', adcinstanceID);
			console.log(options.maxPrompts);
	
	};
})(jQuery);
