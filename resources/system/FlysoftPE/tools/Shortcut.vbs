'FlysoftPE Link Creator

If WScript.Arguments.Count <> 2 Then
    WScript.Quit
End If
Dim Source,Target
Source = WScript.Arguments(0)
Target = WScript.Arguments(1)
Set WShell = WScript.CreateObject("WScript.Shell")
Set ShellLink = WShell.CreateShortcut(Target)
ShellLink.TargetPath = Source
ShellLink.IconLocation = Source & ",0"
ShellLink.Save