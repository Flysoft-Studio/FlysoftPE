@echo off
chcp 65001>nul
setlocal enabledelayedexpansion
cd /d "%~dp0"
PATH=%PATH%;%cd%;%cd%\tools;%cd%\compat;
set AppData=%UserProfile%\AppData\Roaming
set LocalAppData=%UserProfile%\AppData\Local
set LocalLowAppData=%UserProfile%\AppData\LocalLow
set Desktop=%Public%\Desktop
set StartMenu=%SystemDrive%\ProgramData\Microsoft\Windows\Start Menu
set FSPE_TEMP=%SystemDrive%\FlysoftPE\temp
set FSPE_VAR=%SystemDrive%\FlysoftPE\var
set FSPE_RES=%SystemDrive%\FlysoftPE\res
set FSPE_BOOT=NULL
set FSPE_BOOTDIR=NULL
set FSPE_BOOTISO=NULL
set FAILED=false
set Mode=%~1
set ARG1=%~2
set ARG2=%~3
set LOADPLUGIN=false
mode con: cols=80 lines=12
title FlysoftPE Loader
call:log "FlysoftPE Loader"
(reg query "HKLM\System\ControlSet001\Control\Nls\Language" /v "InstallLanguage" | find "0804" && set Lang=chs || set Lang=eng)>nul
for %%i in (A B C D E F G H I J K L M N O P Q R S T U V W X Y Z) do (
    if exist "%%i:\FlysoftPE\flag.fs" (
        set FSPE_BOOT=%%i:
    )
)
if "%Mode%" equ "plugin" (
    set LOADPLUGIN=true
    set LOADPLUGINPATH=%ARG1%
    goto boot_step_user
)
:boot_start
if "%FSPE_BOOT%" equ "NULL" (
    call:warn "No boot disk detected^! Checking ventoy status..."
    vtoydump>%FSPE_TEMP%\VENTOY_DUMP.log
    if "!errorlevel!" neq "0" (
        call:err "No ventoy detected^! No boot disk detected^!"
        call:err "The system is stopping..."
        msgbox "FlysoftPE cannot detect the boot disk! Make sure the boot disk is plugged in and the resource file is not damaged or missing.\nFlysoftPE 无法检测到启动盘！请确保启动盘已经插上且资源文件没有损坏或丢失。\nFlysoftPE 無法檢測到開機磁片！請確保開機磁片已經插上且資源檔沒有損壞或遺失。" "Error"
        pause>nul
        goto:eof
    )
    vtoydump -m>"%FSPE_TEMP%\VENTOY_MOUNT.log"
    for /f "tokens=1,2" %%i in (%FSPE_TEMP%\VENTOY_MOUNT.log) do (
        set FSPE_BOOT=%%i
        set FSPE_BOOTISO=%%j
        call:log "ISO File: !FSPE_BOOT!"
        call:log "Mount Letter: !FSPE_BOOTISO!"
    )
)
:boot_step_user
if "%FSPE_BOOTISO%" neq "NULL" (
    for %%i in ("%FSPE_BOOTISO%") do (
        set FSPE_BOOTDIR=%%~di\FlysoftPE
        if not exist "!FSPE_BOOTDIR!" (
            mkdir "!FSPE_BOOTDIR!"
            echo This directory makes it easier for you to manage themes, plugins, and drivers etc.>"%FSPE_BOOTDIR%\Notice.txt"
        )
        if not exist "!FSPE_BOOTDIR!\themes" (
            mkdir "!FSPE_BOOTDIR!\themes"
        )
        if not exist "!FSPE_BOOTDIR!\drivers" (
            mkdir "!FSPE_BOOTDIR!\drivers"
        )
        if not exist "!FSPE_BOOTDIR!\plugins" (
            mkdir "!FSPE_BOOTDIR!\plugins"
        )
        if not exist "!FSPE_BOOTDIR!\config" (
            mkdir "!FSPE_BOOTDIR!\config"
        )
        if not exist "!FSPE_BOOTDIR!\profile" (
            mkdir "!FSPE_BOOTDIR!\profile"
        )
        set FSPE_USER=!FSPE_BOOTDIR!
    )
) else (
    set FSPE_USER=%FSPE_BOOT%\FlysoftPE
)
if "%LOADPLUGIN%" equ "true" goto boot_step_cmode
set LOGOK=true
if exist "%FSPE_USER%\loading.log" (
    start /wait "" "%ComSpec%" /c "failed.cmd"
    chcp 65001>nul
    if exist "%FSPE_VAR%\FSPE_SAFEMODE.bin" (
        set FAILED=true
        set LOGOK=false
    ) else (
        del /f "%FSPE_USER%\loading.log"
    )
)
if "%LOGOK%" equ "true" (
    echo FlysoftPE Loading Log>>"%FSPE_USER%\loading.log"
)
if not exist "%FSPE_USER%\profile\Downloads" (
    mkdir "%FSPE_USER%\profile\Downloads"
)
if not exist "%FSPE_USER%\profile\AppData" (
    mkdir "%FSPE_USER%\profile\AppData"
)
if not exist "%FSPE_USER%\profile\AppData\Roaming" (
    mkdir "%FSPE_USER%\profile\AppData\Roaming"
)
if not exist "%FSPE_USER%\profile\AppData\Local" (
    mkdir "%FSPE_USER%\profile\AppData\Local"
)
if not exist "%FSPE_USER%\profile\AppData\LocalLow" (
    mkdir "%FSPE_USER%\profile\AppData\LocalLow"
)
if not exist "%FSPE_USER%\profile\AppData\Local\Microsoft" (
    mkdir "%FSPE_USER%\profile\AppData\Local\Microsoft"
)
if not exist "%FSPE_USER%\profile\AppData\Local\Microsoft\Windows" (
    mkdir "%FSPE_USER%\profile\AppData\Local\Microsoft\Windows"
)
if not exist "%FSPE_USER%\profile\AppData\Local\Microsoft\Windows\INetCache" (
    mkdir "%FSPE_USER%\profile\AppData\Local\Microsoft\Windows\INetCache"
)
if not exist "%FSPE_USER%\profile\AppData\Local\Microsoft\Windows\INetCookies" (
    mkdir "%FSPE_USER%\profile\AppData\Local\Microsoft\Windows\INetCookies"
)
if not exist "%FSPE_USER%\profile\AppData\Local\Microsoft\Windows\History" (
    mkdir "%FSPE_USER%\profile\AppData\Local\Microsoft\Windows\History"
)
if not exist "%FSPE_USER%\profile\AppData\Roaming\Microsoft" (
    mkdir "%FSPE_USER%\profile\AppData\Local\Microsoft"
)
if not exist "%FSPE_USER%\profile\AppData\Roaming\Microsoft\Windows" (
    mkdir "%FSPE_USER%\profile\AppData\Roaming\Microsoft\Windows"
)
if not exist "%FSPE_USER%\profile\AppData\Roaming\Microsoft\Windows\Network Shortcuts" (
    mkdir "%FSPE_USER%\profile\AppData\Roaming\Microsoft\Windows\Network Shortcuts"
)
if not exist "%FSPE_USER%\profile\AppData\Roaming\Microsoft\Windows\Start Menu" (
    mkdir "%FSPE_USER%\profile\AppData\Roaming\Microsoft\Windows\Start Menu"
)
if not exist "%FSPE_USER%\profile\AppData\Roaming\Microsoft\Windows\Start Menu\Programs" (
    mkdir "%FSPE_USER%\profile\AppData\Roaming\Microsoft\Windows\Start Menu\Programs"
)
if not exist "%FSPE_USER%\profile\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup" (
    mkdir "%FSPE_USER%\profile\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup"
)
if not exist "%FSPE_USER%\profile\AppData\Roaming\Microsoft\Windows\Recent" (
    mkdir "%FSPE_USER%\profile\AppData\Roaming\Microsoft\Windows\Recent"
)
if not exist "%FSPE_USER%\profile\AppData\Roaming\Microsoft\Windows\SendTo" (
    mkdir "%FSPE_USER%\profile\AppData\Roaming\Microsoft\Windows\SendTo"
)
if not exist "%FSPE_USER%\profile\AppData\Roaming\Microsoft\Windows\Templates" (
    mkdir "%FSPE_USER%\profile\AppData\Roaming\Microsoft\Windows\Templates"
)
if not exist "%FSPE_USER%\profile\Desktop" (
    mkdir "%FSPE_USER%\profile\Desktop"
)
if not exist "%FSPE_USER%\profile\Favorites" (
    mkdir "%FSPE_USER%\profile\Favorites"
)
if not exist "%FSPE_USER%\profile\Music" (
    mkdir "%FSPE_USER%\profile\Music"
)
if not exist "%FSPE_USER%\profile\Pictures" (
    mkdir "%FSPE_USER%\profile\Pictures"
)
if not exist "%FSPE_USER%\profile\Videos" (
    mkdir "%FSPE_USER%\profile\Videos"
)
if not exist "%FSPE_USER%\profile\Documents" (
    mkdir "%FSPE_USER%\profile\Documents"
)
if not exist "%StartMenu%" (
    mkdir "%StartMenu%"
)
echo %FSPE_USER%>"%FSPE_VAR%\FSPE_USER.bin"
echo %FSPE_BOOT%>"%FSPE_VAR%\FSPE_BOOT.bin"
echo %FSPE_TEMP%>"%FSPE_VAR%\FSPE_TEMP.bin"
call:log "Booted from %FSPE_BOOT%"
label %SystemDrive% FlysoftPE
set FSPE_EXT=%FSPE_BOOT%\FlysoftPE
if "%LOADPLUGIN%" equ "true" goto boot_ime_end
call:log "Setting ime"
reg delete "HKCU\Software\Microsoft\CTF" /f
reg delete "HKCU\Keyboard Layout" /f
reg add "HKLM\SOFTWARE\Classes\CLSID\{E7EA138E-69F8-11D7-A6EA-00065B844310}" /ve /t REG_SZ /d "Sougou Pinyin" /f
reg add "HKLM\SOFTWARE\Classes\CLSID\{E7EA138E-69F8-11D7-A6EA-00065B844310}\InProcServer32" /ve /t REG_SZ /d "%SystemRoot%\System32\SogouTSF.ime" /f
reg add "HKLM\SOFTWARE\Classes\CLSID\{E7EA138E-69F8-11D7-A6EA-00065B844310}\InProcServer32" /v "ThreadingModel" /t REG_SZ /d "Apartment" /f
reg add "HKLM\SOFTWARE\Classes\WOW6432Node\CLSID\{E7EA138E-69F8-11D7-A6EA-00065B844310}" /ve /t REG_SZ /d "Sougou Pinyin" /f
reg add "HKLM\SOFTWARE\Classes\WOW6432Node\CLSID\{E7EA138E-69F8-11D7-A6EA-00065B844310}\InProcServer32" /ve /t REG_SZ /d "%SystemRoot%\SysWOW64\SogouTSF.ime" /f
reg add "HKLM\SOFTWARE\Classes\WOW6432Node\CLSID\{E7EA138E-69F8-11D7-A6EA-00065B844310}\InProcServer32" /v "ThreadingModel" /t REG_SZ /d "Apartment" /f
reg add "HKLM\SOFTWARE\Classes\WOW6432Node\CLSID\{CC43AF26-60C3-4612-B58D-27A07A40E90B}" /ve /t REG_SZ /d "SogouPY Text Service" /f
reg add "HKLM\SOFTWARE\Classes\WOW6432Node\CLSID\{CC43AF26-60C3-4612-B58D-27A07A40E90B}\InProcServer32" /ve /t REG_SZ /d "%ProgramFiles%\Input\9.8.0.3746\SogouTSF.dll" /f
reg add "HKLM\SOFTWARE\Classes\WOW6432Node\CLSID\{CC43AF26-60C3-4612-B58D-27A07A40E90B}\InProcServer32" /v "ThreadingModel" /t REG_SZ /d "Apartment" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\Category\Category\{046B8C80-1647-40F7-9B21-B93B81AABC1B}\{E7EA138E-69F8-11D7-A6EA-00065B844310}" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\Category\Category\{13A016DF-560B-46CD-947A-4C3AF1E0E35D}\{E7EA138E-69F8-11D7-A6EA-00065B844310}" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\Category\Category\{25504FB4-7BAB-4BC1-9C69-CF81890F0EF5}\{E7EA138E-69F8-11D7-A6EA-00065B844310}" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\Category\Category\{34745C63-B2F0-4784-8B67-5E12C8701A31}\{E7EA138E-69F8-11D7-A6EA-00065B844310}" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\Category\Category\{364215D9-75BC-11D7-A6EF-00065B84435C}\{E7EA138E-69F8-11D7-A6EA-00065B844310}" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\Category\Category\{364215DA-75BC-11D7-A6EF-00065B84435C}\{E7EA138E-69F8-11D7-A6EA-00065B844310}" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\Category\Category\{49D2F9CE-1F5E-11D7-A6D3-00065B84435C}\{E7EA138E-69F8-11D7-A6EA-00065B844310}" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\Category\Category\{49D2F9CF-1F5E-11D7-A6D3-00065B84435C}\{E7EA138E-69F8-11D7-A6EA-00065B844310}" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\Category\Category\{CCF05DD7-4A87-11D7-A6E2-00065B84435C}\{E7EA138E-69F8-11D7-A6EA-00065B844310}" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\Category\Item\{E7EA138E-69F8-11D7-A6EA-00065B844310}\{046B8C80-1647-40F7-9B21-B93B81AABC1B}" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\Category\Item\{E7EA138E-69F8-11D7-A6EA-00065B844310}\{13A016DF-560B-46CD-947A-4C3AF1E0E35D}" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\Category\Item\{E7EA138E-69F8-11D7-A6EA-00065B844310}\{25504FB4-7BAB-4BC1-9C69-CF81890F0EF5}" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\Category\Item\{E7EA138E-69F8-11D7-A6EA-00065B844310}\{34745C63-B2F0-4784-8B67-5E12C8701A31}" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\Category\Item\{E7EA138E-69F8-11D7-A6EA-00065B844310}\{364215D9-75BC-11D7-A6EF-00065B84435C}" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\Category\Item\{E7EA138E-69F8-11D7-A6EA-00065B844310}\{364215DA-75BC-11D7-A6EF-00065B84435C}" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\Category\Item\{E7EA138E-69F8-11D7-A6EA-00065B844310}\{49D2F9CE-1F5E-11D7-A6D3-00065B84435C}" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\Category\Item\{E7EA138E-69F8-11D7-A6EA-00065B844310}\{49D2F9CF-1F5E-11D7-A6D3-00065B84435C}" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\Category\Item\{E7EA138E-69F8-11D7-A6EA-00065B844310}\{CCF05DD7-4A87-11D7-A6E2-00065B84435C}" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\LanguageProfile\0x00000804\{E7EA138F-69F8-11D7-A6EA-00065B844311}" /v "Description" /t REG_SZ /d "Sougou Pinyin" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\LanguageProfile\0x00000804\{E7EA138F-69F8-11D7-A6EA-00065B844311}" /v "IconFile" /t REG_SZ /d "%SystemRoot%\system32\SogouTSF.ime" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\LanguageProfile\0x00000804\{E7EA138F-69F8-11D7-A6EA-00065B844311}" /v "IconIndex" /t REG_DWORD /d "0" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\LanguageProfile\0x00000804\{E7EA138F-69F8-11D7-A6EA-00065B844311}" /v "Enable" /t REG_DWORD /d "1" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\LanguageProfile\0x00000804\{E7EA138F-69F8-11D7-A6EA-00065B844311}" /v "HiddenInSettingUI" /t REG_DWORD /d "0" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{E7EA138E-69F8-11D7-A6EA-00065B844310}\LanguageProfile\0x00000804\{E7EA138F-69F8-11D7-A6EA-00065B844311}" /v "SubItemInSettingUI" /t REG_DWORD /d "0" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{CC43AF26-60C3-4612-B58D-27A07A40E90B}" /v "Enable" /t REG_SZ /d "1" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{CC43AF26-60C3-4612-B58D-27A07A40E90B}\Category\Category\{34745C63-B2F0-4784-8B67-5E12C8701A31}\{CC43AF26-60C3-4612-B58D-27A07A40E90B}" /f
reg add "HKLM\SOFTWARE\Microsoft\CTF\TIP\{CC43AF26-60C3-4612-B58D-27A07A40E90B}\Category\Item\{CC43AF26-60C3-4612-B58D-27A07A40E90B}\{34745C63-B2F0-4784-8B67-5E12C8701A31}" /f
reg add "HKLM\SOFTWARE\WOW6432Node\SogouInput" /v "ImeHint" /t REG_DWORD /d "0" /f
reg add "HKLM\SOFTWARE\WOW6432Node\SogouInput" /v "StartMenuFolder" /t REG_SZ /d "Sougou" /f
reg add "HKLM\SOFTWARE\WOW6432Node\SogouInput" /ve /t REG_SZ /d "%ProgramFiles%\Input" /f
reg add "HKLM\SOFTWARE\WOW6432Node\SogouInput" /v "Version" /t REG_SZ /d "9.8.0.3746" /f
reg add "HKLM\SOFTWARE\WOW6432Node\SogouInput" /v "Region" /t REG_SZ /d "0000_sogou_pinyin_98a" /f
reg add "HKLM\SOFTWARE\WOW6432Node\SogouInput" /v "VersionType" /t REG_SZ /d "Final" /f
reg add "HKLM\SOFTWARE\WOW6432Node\SogouInput" /v "PatchFlag" /t REG_DWORD /d "1" /f
reg add "HKLM\SOFTWARE\WOW6432Node\SogouInput" /v "EnableSogouEudc" /t REG_DWORD /d "1" /f
reg add "HKCU\SOFTWARE\SogouInput" /f
reg add "HKCU\SOFTWARE\Microsoft\CTF\SortOrder\Language" /v "00000000" /d "00000409" /f
call:log "Initializing PE"
reg add "HKLM\SYSTEM\Setup" /v "SystemSetupInProgress" /t REG_DWORD /d "0" /f
cd /d "%FSPE_TEMP%"
"%SystemRoot%\System32\wpeinit.exe"
cd /d "%~dp0"
call:log "Loading theme..."
set PATH_EXT=%FSPE_USER%\themes
call:themes
if exist "%FSPE_USER%\config\wallpaper.jpg" (
    copy /y "%FSPE_USER%\config\wallpaper.jpg" "%SystemRoot%\Web\Wallpaper\Windows\img0.jpg"
)
if exist "%FSPE_EXT%\host\FlysoftPE.exe" (
    call:log "Starting UIHost"
    echo FSPE_WATCH>"%FSPE_TEMP%\WATCH_INIT.tmp"
    if "%FAILED%" equ "true" (
        call:warn "Detected loading log. Host will not be loaded."
    ) else (
        start "" /high "%FSPE_EXT%\host\FlysoftPE.exe" --background
    )
    reg add "HKCR\DesktopBackground\Shell\FlysoftPE\command" /ve /t REG_SZ /d """%FSPE_EXT%\host\FlysoftPE.exe""" /f
    reg add "HKCR\FlysoftPE.Hub\shell\open\command" /ve /t REG_SZ /d """%FSPE_EXT%\host\FlysoftPE.exe""" /f
    reg add "HKCR\FlysoftPE.Hub\DefaultIcon" /ve /t REG_SZ /d "%FSPE_EXT%\host\FlysoftPE.exe,0" /f
    echo.>"%AppData%\Microsoft\Windows\Network Shortcuts\FlysoftPE Hub.fshub"
)
if %Lang% equ chs (
    reg add "HKCR\Directory\shell\LoadAsPlugin" /ve /t REG_SZ /d "作为插件包加载(&L)" /f
) else (
    reg add "HKCR\Directory\shell\LoadAsPlugin" /ve /t REG_SZ /d "&Load as plugin" /f
)
call:log "Setting font..."
call:log "Preparing font config..."
dpifix
start "" "%SystemDrive%\FlysoftPE\tools\nomeiryoui.exe" "%SystemDrive%\FlysoftPE\res\fonts.ini" -set
call:log "Setting color mode..."
:boot_step_cmode
if exist "%FSPE_USER%\config\cmode.bin" (
    set /p FSPE_CMODE=<%FSPE_USER%\config\cmode.bin
) else (
    set FSPE_CMODE=default
)
if "%LOADPLUGIN%" equ "true" goto boot_step_vol
if "%FSPE_CMODE%" equ "light" (
    reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" /v "SystemUsesLightTheme" /t REG_DWORD /d 1 /f
    reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" /v "AppsUseLightTheme" /t REG_DWORD /d 1 /f
    reg add "HKCU\Software\OpenShell\StartMenu\Settings" /v "TaskbarColor" /t REG_DWORD /d 16777215 /f
    reg add "HKCU\Software\OpenShell\StartMenu\Settings" /v "StartButtonPath" /t REG_SZ /d "%SystemDrive%\FlysoftPE\res\start_light.png" /f
)
if "%FSPE_CMODE%" equ "dark" (
    reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" /v "SystemUsesLightTheme" /t REG_DWORD /d 0 /f
    reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" /v "AppsUseLightTheme" /t REG_DWORD /d 0 /f
    reg add "HKCU\Software\OpenShell\StartMenu\Settings" /v "TaskbarColor" /t REG_DWORD /d 0 /f
    reg add "HKCU\Software\OpenShell\StartMenu\Settings" /v "StartButtonPath" /t REG_SZ /d "%SystemDrive%\FlysoftPE\res\start_dark.png" /f
)
call:log "Setting taskbar..."
if exist "%FSPE_USER%\config\openshell.reg" (
    reg import "%FSPE_USER%\config\openshell.reg"
)
call:log "Setting volume..."
:boot_step_vol
if exist "%FSPE_USER%\config\volume.bin" (
    set /p FSPE_VOL=<%FSPE_USER%\config\volume.bin
) else (
    set FSPE_VOL=32768
)
if "%LOADPLUGIN%" equ "true" goto boot_step_env
nircmd setsysvolume %FSPE_VOL%
call:log "Setting env..."
:boot_step_env
if exist "%FSPE_USER%\config\env.bin" (
    set /p FSPE_ENVMODE=<%FSPE_USER%\config\env.bin
) else (
    set FSPE_ENVMODE=false
)
set PATH_USF=HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders
set PATH_ENV=HKCU\Environment
set PATH_EXT=%FSPE_USER%\profile
if "%FSPE_ENVMODE%" equ "true" (
    set AppData=%PATH_EXT%\AppData\Roaming
    set LocalAppData=%PATH_EXT%\AppData\Local
    set LocalLowAppData=%PATH_EXT%\AppData\LocalLow
    echo %LOADPLUGIN%
    if "%LOADPLUGIN%" equ "true" goto boot_step_res
    
    reg add "%PATH_USF%" /v "{374DE290-123F-4565-9164-39C4925E467B}" /t "REG_SZ" /d "%PATH_EXT%\Downloads" /f
    reg add "%PATH_USF%" /v "AppData" /t "REG_SZ" /d "%PATH_EXT%\AppData\Roaming" /f
    reg add "%PATH_USF%" /v "Cache" /t "REG_SZ" /d "%PATH_EXT%\AppData\Local\Microsoft\Windows\INetCache" /f
    reg add "%PATH_USF%" /v "Cookies" /t "REG_SZ" /d "%PATH_EXT%\AppData\Local\Microsoft\Windows\INetCache" /f
    reg add "%PATH_USF%" /v "Desktop" /t "REG_SZ" /d "%PATH_EXT%\Desktop" /f
    reg add "%PATH_USF%" /v "Favorites" /t "REG_SZ" /d "%PATH_EXT%\Favorites" /f
    reg add "%PATH_USF%" /v "History" /t "REG_SZ" /d "%PATH_EXT%\AppData\Local\Microsoft\Windows\History" /f
    reg add "%PATH_USF%" /v "Local AppData" /t "REG_SZ" /d "%PATH_EXT%\AppData\Local" /f
    reg add "%PATH_USF%" /v "My Music" /t "REG_SZ" /d "%PATH_EXT%\Music" /f
    reg add "%PATH_USF%" /v "My Pictures" /t "REG_SZ" /d "%PATH_EXT%\Pictures" /f
    reg add "%PATH_USF%" /v "My Video" /t "REG_SZ" /d "%PATH_EXT%\Videos" /f
    reg add "%PATH_USF%" /v "NetHood" /t "REG_SZ" /d "%PATH_EXT%\AppData\Roaming\Microsoft\Windows\Network Shortcuts" /f
    reg add "%PATH_USF%" /v "Personal" /t "REG_SZ" /d "%PATH_EXT%\Documents" /f
    reg add "%PATH_USF%" /v "Programs" /t "REG_SZ" /d "%PATH_EXT%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs" /f
    reg add "%PATH_USF%" /v "Recent" /t "REG_SZ" /d "%PATH_EXT%\AppData\Roaming\Microsoft\Windows\Recent" /f
    reg add "%PATH_USF%" /v "SendTo" /t "REG_SZ" /d "%PATH_EXT%\AppData\Roaming\Microsoft\Windows\SendTo" /f
    reg add "%PATH_USF%" /v "Start Menu" /t "REG_SZ" /d "%PATH_EXT%\AppData\Roaming\Microsoft\Windows\Start Menu" /f
    reg add "%PATH_USF%" /v "Startup" /t "REG_SZ" /d "%PATH_EXT%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup" /f
    reg add "%PATH_USF%" /v "Templates" /t "REG_SZ" /d "%PATH_EXT%\AppData\Roaming\Microsoft\Windows\Templates" /f

    reg add "%PATH_ENV%" /v "Desktop" /t "REG_SZ" /d "%PATH_EXT%\Desktop" /f
    reg add "%PATH_ENV%" /v "Favorites" /t "REG_SZ" /d "%PATH_EXT%\Favorites" /f
    reg add "%PATH_ENV%" /v "Personal" /t "REG_SZ" /d "%PATH_EXT%\Documents" /f
    reg add "%PATH_ENV%" /v "Programs" /t "REG_SZ" /d "%PATH_EXT%\%PATH_EXT%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs" /f
    reg add "%PATH_ENV%" /v "QuickLaunch" /t "REG_SZ" /d "%PATH_EXT%\AppData\Roaming\Microsoft\Internet Explorer\Quick Launch" /f
    reg add "%PATH_ENV%" /v "SendTo" /t "REG_SZ" /d "%PATH_EXT%\AppData\Roaming\Microsoft\Windows\SendTo" /f
    reg add "%PATH_ENV%" /v "StartMenu" /t "REG_SZ" /d "%PATH_EXT%\AppData\Roaming\Microsoft\Windows\Start Menu" /f
    reg add "%PATH_ENV%" /v "Startup" /t "REG_SZ" /d "%PATH_EXT%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup" /f
)
if "%LOADPLUGIN%" equ "true" goto boot_step_res
call:log "Setting ime style..."
xcopy "%FSPE_RES%\ime\*.*" "%LocalLowAppData%\SogouPY\" /y /e
call:log "Loading drivers..."
set PATH_EXT=%FSPE_USER%\drivers
call:drv
call:log "Setting resolution..."
:boot_step_res
if exist "%FSPE_USER%\config\res_width.bin" (
    if exist "%FSPE_USER%\config\res_height.bin" (
        set /p FSPE_RESX=<%FSPE_USER%\config\res_width.bin
        set /p FSPE_RESY=<%FSPE_USER%\config\res_height.bin
        if "%LOADPLUGIN%" equ "true" goto boot_step_brightness
        call:log "Change to !FSPE_RESX!x!FSPE_RESY!^!"
        resolution !FSPE_RESX! !FSPE_RESY!
    )
)
if "%LOADPLUGIN%" equ "true" goto boot_step_brightness
call:log "Setting firmware information"
reg add "HKLM\Software\Microsoft\Windows\CurrentVersion\OEMInformation" /v "Model" /d "UEFI Firmware" /f
for /f "tokens=1,2,*" %%i in ('reg query "HKLM\System\CurrentControlSet\Control" ^| find /i "PEFirmwareType"') do (
    if "%%k" equ "0x1" (
        reg add "HKLM\Software\Microsoft\Windows\CurrentVersion\OEMInformation" /v "Model" /d "BIOS Firmware" /f
    )
)
call:log "Setting network"
net start wlansvc
call:log "Creating backups"
copy "%SystemRoot%\System32\SystemPropertiesAdvanced.exe" "%SystemRoot%\System32\SystemPropertiesProtection.exe" /y
copy "%SystemRoot%\System32\SystemPropertiesAdvanced.exe" "%SystemRoot%\System32\SystemPropertiesRemote.exe" /y
copy "%SystemDrive%\FlysoftPE\tools\version.exe" "%SystemRoot%\System32\changepk.exe"
call:log "Starting shell..."
start "" /high "%SystemRoot%\explorer.exe"
start "" /high "%ProgramFiles%\WLAN\WinXShell.exe" -ui -jcfg "%ProgramFiles%\WLAN\wxsUI\wlan.zip" -hidewindow
start "" /high "%ProgramFiles%\OpenShell\StartMenu.exe"
call:log "Setting brightness..."
:boot_step_brightness
if exist "%FSPE_USER%\config\brightness.bin" (
    set /p FSPE_BRIGHTNESS=<%FSPE_USER%\config\brightness.bin
) else (
    set FSPE_BRIGHTNESS=100
)
if "%LOADPLUGIN%" equ "true" goto plugins_load
start "" /high "brightness.exe" "%FSPE_BRIGHTNESS%"
del /f /s /q "%FSPE_TEMP%\WATCH_INIT.tmp"
call:log "Starting ime"
start "" /high "%SystemRoot%\System32\ctfmon.exe"
call:log "Starting T-Clock"
start "" /high "%ProgramFiles%\T-Clock\Clock64.exe"
call:log "Loading plugins..."
set PATH_EXT=%FSPE_USER%\plugins
call:plugins
del /f "%FSPE_USER%\loading.log"
pause>nul
:boot_end
goto:eof

:plugins_load
if "%LOADPLUGINPATH%" equ "" (
    goto:eof
)
cls
start /wait /b "" "%ComSpec%" /c ""plugin_load.cmd" "%LOADPLUGINPATH%""
chcp 65001>nul
cls
if not exist "%FSPE_VAR%\FSPE_PLUGIN_LOAD.bin" (
    goto:eof
)
del /f /q /s "%FSPE_VAR%\FSPE_PLUGIN_LOAD.bin">nul
call:plugins_loader "%LOADPLUGINPATH%" false
for %%i in ("%LOADPLUGINPATH%") do (
    set LOADPLUGINNAME=%%~ni
)
call:log "Finish loading plugin %LOADPLUGINPATH%."
pause>nul
goto:eof

:themes
set PATH_THEME=NULL
set /p PATH_THEME=<%PATH_EXT%\default.fs
cursor "%SystemRoot%\Cursors"
if "%PATH_THEME%" equ "NULL" goto:eof
if exist "%PATH_EXT%\%PATH_THEME%" (
    goto themes_set
) else (
    goto:eof
)
goto:eof

:themes_set
call:log "Current theme pack: %PATH_THEME%"
unzip -o "%PATH_EXT%\%PATH_THEME%" -d "%FSPE_TEMP%\themes\%PATH_THEME%"
if exist "%FSPE_TEMP%\themes\%PATH_THEME%\cursor\" (
    xcopy "%FSPE_TEMP%\themes\%PATH_THEME%\cursor\*.cur" "%SystemRoot%\Cursors\" /y /e /c
    xcopy "%FSPE_TEMP%\themes\%PATH_THEME%\cursor\*.ani" "%SystemRoot%\Cursors\" /y /e /c
)
if exist "%FSPE_TEMP%\themes\%PATH_THEME%\icon\imageres.dll" (
    copy "%FSPE_TEMP%\themes\%PATH_THEME%\icon\imageres.dll" "%SystemRoot%\System32\imageres.dll" /y
)
if exist "%FSPE_TEMP%\themes\%PATH_THEME%\icon\imagesp1.dll" (
    copy "%FSPE_TEMP%\themes\%PATH_THEME%\icon\imagesp1.dll" "%SystemRoot%\System32\imagesp1.dll" /y
)
if exist "%FSPE_TEMP%\themes\%PATH_THEME%\root\" (
    xcopy "%FSPE_TEMP%\themes\%PATH_THEME%\root\*.*" "%SystemDrive%\" /y /e /c
)
if exist "%FSPE_TEMP%\themes\%PATH_THEME%\config.reg" (
    reg import "%FSPE_TEMP%\themes\%PATH_THEME%\config.reg"
)
if exist "%FSPE_TEMP%\themes\%PATH_THEME%\start.png" (
    copy "%FSPE_TEMP%\themes\%PATH_THEME%\start.png" "%SystemRoot%\Resources\theme_start.png" /y
    reg add "HKCU\Software\OpenShell\StartMenu\Settings" /v "StartButtonPath" /t REG_SZ /d "%SystemRoot%\Resources\theme_start.png" /f
)
if exist "%FSPE_TEMP%\themes\%PATH_THEME%\wallpaper.jpg" (
    copy "%FSPE_TEMP%\themes\%PATH_THEME%\wallpaper.jpg" "%SystemRoot%\Web\Wallpaper\Windows\img0.jpg" /y
)
cursor "%SystemRoot%\Cursors"
goto:eof

:plugins
if "%FAILED%" equ "true" (
    call:warn "Detected loading log. Plugins will not be loaded."
    goto:eof
)
for %%i in ("%PATH_EXT%\*.zip") do (
    call:log "Loading RAM plugin: %%i"
    unzip -o "%%i" -d "%FSPE_TEMP%\plugins\%%~ni"
    call:plugins_loader "%FSPE_TEMP%\plugins\%%~ni" true
)
for /f "tokens=*" %%i in ('dir /ad /on /b "%PATH_EXT%"') do (
    call:log "Loading Disk plugin: %%i"
    call:plugins_loader "%PATH_EXT%\%%i" true
)
setx PATH %PATH%
goto:eof

:plugins_loader
if not exist "%~1\package.cmd" (
    call:err "Invaild plugin: %%i"
    goto:eof
)
set PATH_EXT=%FSPE_USER%\plugins
set LOGFILE="%FSPE_TEMP%\PLUGIN_%~n1.log"
if "%~2" equ "true" (
    if exist %LOGFILE% (
        goto:eof
    )
)
call:log "Loading Plugin %~1"
echo If this plugin does not work properly, please send this log file to the plugin provider.>>%LOGFILE%
if exist "%~1\depend.txt" (
    for /f "tokens=*" %%i in ('type "%~1\depend.txt"') do (
        echo Loading dependency: %%i>>%LOGFILE%
        if not exist "%PATH_EXT%\%%i" (
            echo Invaild dependency: %%i>>%LOGFILE%
            goto:eof
        )
        call:plugins_loader "%PATH_EXT%\%%i" true
    )
)
if exist "%~1\files\" (
    echo Copying files...>>%LOGFILE%
    xcopy "%~1\files\*.*" "%SystemDrive%\" /y /e /c>>%LOGFILE%
)
for %%i in ("%~1\reg_*.reg") do (
    echo Importing registry %%i...>>%LOGFILE%
    reg import "%%i">>%LOGFILE%
)
if exist "%~1\main.cmd" (
    echo Running plugin initialization...>>%LOGFILE%
    start /b /wait "" "%ComSpec%" /c "chcp 65001 && "%~1\main.cmd" "%~1"">>%LOGFILE%
)
if exist "%~1\hide.cmd" (
    echo Running plugin initialization in background...>>%LOGFILE%
    start /b "" "%ComSpec%" "%~1\hide.cmd" "%~1">>%LOGFILE%
)
if not exist "%~1\env.cmd" (
    call:log "Log: %LOGFILE%"
    goto:eof
)
echo Running plugin env...>>%LOGFILE%
set CUR=%~1
for /f "tokens=*" %%i in ("%~1\env.cmd") do (
    %%i>>%LOGFILE%
)
call:log "Log: %LOGFILE%"
goto:eof

:drv
if "%FAILED%" equ "true" (
    call:warn "Detected loading log. Drivers will not be loaded."
    goto:eof
)
for /f "tokens=*" %%i in ('dir /ad /b "%PATH_EXT%"') do (
    call:log "Loading Driver: %%i"
    for /f "delims=" %%j in ('dir /b "%PATH_EXT%\%%i\*.inf"') do (
        drvload "%PATH_EXT%\%%i\%%j"
    )
)
goto:eof

:log
echo [INFO] %~1
echo [INFO] %~1>>"%FSPE_TEMP%\LOADER.log"
if "%LOGOK%" equ "true" (
    echo [INFO] %~1>>"%FSPE_USER%\loading.log"
)
goto:eof

:err
echo [ERR] %~1
echo [ERR] %~1>>"%FSPE_TEMP%\LOADER.log"
if "%LOGOK%" equ "true" (
    echo [ERR] %~1>>"%FSPE_USER%\loading.log"
)
goto:eof

:warn
echo [WARN] %~1
echo [WARN] %~1>>"%FSPE_TEMP%\LOADER.log"
if "%LOGOK%" equ "true" (
    echo [WARN] %~1>>"%FSPE_USER%\loading.log"
)
goto:eof