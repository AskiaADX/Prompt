/* open_loop.js */
{%
Dim i
Dim inputName
Dim plr = CurrentQuestion.ParentLoop.AvailableAnswers

For i = 1 To plr.Count
	inputName = CurrentQuestion.Iteration(plr[i].Index).InputName()
%}
{element : $('#{%= inputName%}')}{%= On(i < plr.Count, ",", "") %}
{% Next %}
