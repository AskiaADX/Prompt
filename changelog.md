
- Version 0.1.0
Added API connection properties
Implemented AI model script

- Version 0.2.0
Added Prompt properties
Implemented non-ai model script

- Version 0.3.0
Added and tested the following Prompt properties to non-ai model script:
Prompt Question
Maximum number of prompts to return
Minimum time interval between prompts
Minimum number of characters to trigger a prompt
Trigger prompt when Space is entered
Trigger prompt when punctuation (. , ! ? ;) is entered

- Version 0.3.1
updated version number and description

- Version 0.4.0
updated time interval to be disabled if 0 is selected
updated number of prompts to return be infinite if 0 is selected

- Version 0.5.0
fixed bugs relating to the Space and Punctuation options causing extra prompts to be returned past the limit
added console log printouts when a prompt is returned for debugging

- Version 0.6.0
incorporated AI functionality for Ipsos Facto API in ADC settings for AI model script
modified ai model script to utilize ADC options
added authentication header option for adc properties

- Version 0.7.0
added option to hide Next button until a prompt is returned. added CSS option to open.css
added additional CSS to incorporate a loading image while prompt is returned
replaced original timeout script to take into account pauses when typing

- Version 0.7.2
fixed an issue where the event listeners for space and punctuation would throw an error if not declared in ADC options

- Version 0.7.3
incorporated new ai script to non-ai model

- Version 0.7.4
changed naming convention for non-ai script model

- Version 0.8.1
encapsulated "simpleprompt" in a jquery function for initializing properties from default.js to remove askiascript substitution 