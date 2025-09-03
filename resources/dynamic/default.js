

{%
 Dim strInputIds = ""
 Dim inputName  =  CurrentQuestion.InputName()
 Dim exclusiveQuestion = CurrentADC.PropQuestion("exclusiveResponsesQuestion")
 If exclusiveQuestion <> "" Then
   If (exclusiveQuestion.Type = "single") Then
     Dim inputId
     Dim ar = exclusiveQuestion.AvailableResponses
     Dim i
     For i = 1 To ar.Count
       inputId = (exclusiveQuestion.InputName() + "_" + ar[i].InputValue()).Replace("U", "askia-input")
       If strInputIds <> "" Then
         strInputIds = strInputIds + ","
       Endif
       strInputIds = strInputIds + inputId
     Next i
   EndIf
 EndIf
%}

$(window).on("load",function() {
	$('#adc_{%= CurrentADC.InstanceId %}').adcPrompt({
     instanceId : {%= CurrentADC.InstanceID %},
     inputId : '{%=CurrentQuestion.InputName()%}',
     direction:"{%=CurrentADC.PropValue("counter")%}",
     maxchar:{%=CurrentADC.PropValue("maxChar")%},
     minchar:{%=CurrentADC.PropValue("minChar")%},
     currentQuestion: '{%:= CurrentQuestion.Shortcut %}',
     showcongrats:{%=CurrentADC.PropValue("showCongrats")%},
     suggestedchar:{%=CurrentADC.PropValue("suggestedChar").ToNumber()%},
     usebrowservalidation: {%=CurrentADC.PropValue("useBrowserValidation")%},
     strExclusiveResponseIds : '{%=strInputIds %}',
     isInLoop : {%= (CurrentADC.PropValue("isInLoop") = "1") %},
     maxPrompts : {%=CurrentADC.PropValue("maxPrompts")%},
     promptQuestion : "{%=CurrentADC.PropValue("promptQuestion")%}",
     useAI : {%=CurrentADC.PropValue("useAI")%},
     timePrompt : {%=CurrentADC.PropValue("timePrompts")%},
     minChars : {%=CurrentADC.PropValue("minChars")%},
     useSpace : {%=CurrentADC.PropValue("useSpace")%},
     useEnd : {%=CurrentADC.PropValue("useEnd")%},
     
     items : [
       {% IF CurrentADC.PropValue("isInLoop") = "1" Then %}
           {%:= CurrentADC.GetContent("dynamic/open_loop.js").ToText() %}
       {% EndIF %}   
     ]
    
 });
});

{% IF CurrentADC.PropValue("useAI") = "1" Then %}
      {%:= CurrentADC.GetContent("dynamic/simpleprompt.js").ToText() %}
{% Else %}
      {%:= CurrentADC.GetContent("dynamic/aiprompt.js").ToText() %}
{% EndIF %}
