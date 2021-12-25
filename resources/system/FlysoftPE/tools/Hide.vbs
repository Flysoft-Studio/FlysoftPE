'FlysoftPE HideRun

If WScript.Arguments.Count <> 1 Then
    WScript.Quit
End If
Dim Program
Program = WScript.Arguments(0)
Set WShell = WScript.CreateObject("WScript.Shell")
WShell.run Program,0,TRUE