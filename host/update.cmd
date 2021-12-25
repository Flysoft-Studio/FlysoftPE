@echo off
chcp 65001 > nul
cd /d "%~dp0"
title FlysoftPE Hub Update
color 1E
mode con:cols=40 lines=20
echo ========================================
echo Please wait... 请稍等...
echo ========================================
taskkill /f /im FlysoftPE.exe 2> nul 1> nul
del /f ".\resources\app.asar" > nul
ren ".\resources\app_update.asar" "app.asar" > nul
start "" ".\FlysoftPE.exe"
goto:eof