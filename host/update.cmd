@echo off
title FlysoftPE Hub Update
color 1E
mode con:cols=40 lines=20
chcp 65001 > nul
cd /d "%~dp0"
echo ========================================
echo Updating FlysoftPE Hub...
echo 正在更新 FlysoftPE Hub...
echo ========================================
timeout /T 5 /NOBREAK 2> nul 1> nul
taskkill /f /t /im FlysoftPE.exe 2> nul 1> nul
taskkill /f /t /im aria2c_hub.exe 2> nul 1> nul
if exist ".\resources\tool.zip" (
    ".\resources\data\7z.exe" x ".\resources\tool.zip" "-o.\resources" 2> nul 1> nul
    del /f ".\resources\tool.zip" 2> nul 1> nul
)
if exist ".\resources\app_update.asar" (
    del /f ".\resources\app.asar" 2> nul 1> nul
    ren ".\resources\app_update.asar" "app.asar" 2> nul 1> nul
)
start "" ".\FlysoftPE.exe"
goto:eof