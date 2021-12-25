@echo off
cd /d "%~dp0"
path=%path%;%cd%;%cd%/tool;%cd%/script

:uac_check
if "%1" equ "main" goto cmd_start
net file 1>nul 2>nul
if "%errorlevel%" equ "0" goto uac_end

:uac_get
echo CreateObject^("Shell.Application"^).ShellExecute "%~0", "", "", "runas",1 > "%temp%\getadmin.vbs"
"%temp%\getadmin.vbs"
del /f /q "%temp%\getadmin.vbs" 1>nul 2>nul
goto:eof

:uac_end
nsudo -U:T -P:E cmd /k ""%~0" main"
goto:eof

:cmd_start
@echo off
cls
color 1E
title FlysoftPE
echo ************************************
echo FlysoftPE Command Prompt %OS_ARCH%
echo ************************************
echo Type "build" for more information.
prompt $P@%USERNAME%:~$$ 
@echo on