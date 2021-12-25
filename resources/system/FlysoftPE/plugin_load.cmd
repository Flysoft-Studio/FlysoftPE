@echo off
chcp 936
title FlysoftPE Loader
color 4F
mode con: cols=80 lines=12
:begin
cls
echo ================================================================================
echo You will load an unknown plugin on your FlysoftPE
echo 你将在你的 FlysoftPE 上加载一个未知的插件
echo ================================================================================
echo.
echo.
echo.
echo.
echo.
echo Load (%~1)?
echo Yes(Y) or No(N)
choice /c YN /n
set OP=%errorlevel%
if "%OP%" equ "1" (
    echo true>%FSPE_VAR%\FSPE_PLUGIN_LOAD.bin
)
if "%OP%" equ "2" (
    goto:eof
)
goto:eof