'FlysoftPE Msgbox

If WScript.Arguments.Count <> 2 Then
    WScript.Quit
End If
Msgbox replace(replace(WScript.Arguments(0),"\\","\"),"\n",vbCrLf),vbExclamation,WScript.Arguments(1)