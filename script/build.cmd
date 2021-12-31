@echo off
setlocal enabledelayedexpansion
set PATH_CUR=%cd%
cd /d "%~dp0.."

::::::::::::::::::::::::::::::::::::::::::::

net file 1>nul 2>nul
if "%errorlevel%" neq "0" (
    call:err "Access denied."
    call:err "Please run %0 as TrustedInstaller."
    pause > nul
    goto:eof
)
::::::::::::::::::::::::::::::::::::::::::::

set TOOL_VER=4.0
set TOOL_ARG=%1
set TOOL_ARG_FULL=full
set TOOL_ARG_RELEASE=release
set TOOL_ARG_EXTRACT=extract
set TOOL_ARG_UIHOST=uihost
set TOOL_ARG_PREPARE=prepare
set TOOL_ARG_PACK=PACK
set TOOL_ARG_CLEANUP=cleanup
set TOOL_ARG_SORT=sort
set TOOL_ARG_DEBUG=debug
set TOOL_ARG_CORE_EXTRACT=core_extract
set TOOL_ARG_CORE_PREPARE=core_prepare
set TOOL_ARG_CORE_HIVE_LOAD=core_hive_load
set TOOL_ARG_CORE_HIVE_UNLOAD=core_hive_unload
set TOOL_ARG_CORE_PACK=core_pack
set TOOL_ARG_ISO_CREATE=iso_create
set TOOL_ARG_ISO_PLAN=iso_plan
set TOOL_ARG_ISO_PACK=iso_pack
set TOOL_ARG_PLUG_EXTRACT=plug_extract
set TOOL_ARG_CONF=conf
set TOOL_ARG_ENV=env
set PATH_TEMP=.\temp
set PATH_TOOLS=.\tool
set PATH_SYS=.\system
set PATH_ISO=.\iso
set PATH_CONFIG=.\config
set PATH_HOST=.\host
set PATH_PROJECT=.\project
set PATH_store=.\store
set PATH_RES_SYS=.\resources\system
set PATH_RES_ISO=.\resources\iso
set PATH_RES_COM=.\resources\com
set PATH_RES_SYS_R=.\resources\release_system
set PATH_RES_ISO_R=.\resources\release_iso
set PATH_ISOFILE=.\FlysoftPE.iso
set PATH_WIMFILE=%PATH_TEMP%\boot.wim
set MODE_RELEASE=false
call:get_conf PATH_ISODIR H:
set PATH_ISODIR=%RETURN%
set PATH_INSTALLWIM=%PATH_ISODIR%\sources\install.wim
call:get_conf LANGUAGE en-US
set LANGUAGE=%RETURN%
PATH=%PATH%;%PATH_TOOLS%

echo FlysoftPE Builder (Version %TOOL_VER%)

::::::::::::::::::::::::::::::::::::::::::::

if "%TOOL_ARG%" neq "" (
    if "!TOOL_ARG_%TOOL_ARG%!" neq "" (
        if "!TOOL_ARG_%TOOL_ARG%!" neq "conf" (
            if not exist "%PATH_ISODIR%\sources\boot.wim" (
                call:err "This directory(%PATH_ISODIR%) is not a valid windows installation CD directory."
                exit /b
            )
        )
        call:log "Running function !TOOL_ARG_%TOOL_ARG%!..."
        goto !TOOL_ARG_%TOOL_ARG%! 2>nul
    )
)

::::::::::::::::::::::::::::::::::::::::::::

:help
echo Usage: %0 [functions]
echo Available functions:
echo.
echo Basic:
echo full - Full build (Fast)
echo release - Release build (Slow)
echo extract - Extract files
echo uihost - Create UIHost
echo prepare - Prepare files
echo pack - Pack files
echo cleanup - Cleanup files
echo.
echo Develop:
echo core_extract - Extract system from image
echo core_prepare - Prepare system core
echo core_hive_load - Load registry hive
echo core_hive_unload - Unload registry hive
echo core_pack - Pack system core
echo iso_create - Create ISO boot files
echo iso_plan - Copy plans
echo iso_pack - Generate final ISO file
echo.
echo Plugins:
echo plug_extract - Extract files and registry
echo.
echo Tools:
echo conf - Change config
echo sort - Sort file list
echo debug - Debug a plugin
goto:eof

:env
exit /b 0

:conf
set /p KEY=Key: 
set /p VALUE=Value: 
echo %VALUE%>%PATH_CONFIG%\%KEY%
goto:eof

:debug
set /p PLUG=Plugin Path: 
del /f /s /q "%PATH_ISO%\FlysoftPE\plugins\*.*"
if not exist "%PATH_ISO%\FlysoftPE\plugins\DBG_PLUGIN" mkdir "%PATH_ISO%\FlysoftPE\plugins\DBG_PLUGIN"
xcopy "%PLUG%\*.*" "%PATH_ISO%\FlysoftPE\plugins\DBG_PLUGIN\" /y /e
call:iso_pack
goto:eof

:release
set MODE_RELEASE=true
call:warn "-----------Release Mode-----------"
call:full
goto:eof

:full
call:log "Running full building..."
call:cleanup
call:extract
call:uihost
call:prepare
call:pack
goto:eof

:cleanup
call:log "Cleaning up..."
if exist "%PATH_ISO%" rd /s /q "%PATH_ISO%"
if not exist "%PATH_ISO%" mkdir "%PATH_ISO%"
if exist "%PATH_SYS%" rd /s /q "%PATH_SYS%"
if not exist "%PATH_SYS%" mkdir "%PATH_SYS%"
if exist "%PATH_TEMP%" rd /s /q "%PATH_TEMP%"
if not exist "%PATH_TEMP%" mkdir "%PATH_TEMP%"
if exist "%PATH_HOST%\dist" rd /s /q "%PATH_HOST%\dist"
if not exist "%PATH_HOST%\dist" mkdir "%PATH_HOST%\dist"
goto:eof

:sort
::call:cleanup
::wimlib-imagex extract "%PATH_ISODIR%\sources\boot.wim" 1 "@%PATH_RES_COM%\boot.txt" --no-acls --nullglob --dest-dir="%PATH_SYS%"
::copy "%PATH_RES_COM%\install.txt" "%PATH_RES_COM%\install.old.txt" /y
::echo ;FlysoftPE>"%PATH_RES_COM%\install.txt"
::for /f "delims=" %%i in (%PATH_RES_COM%\install.old.txt) do (
::    echo %%i | findstr "System32"
::    if "!errorlevel!" equ "1" (
::        echo %%i | findstr "SysWOW64"
::        if "!errorlevel!" equ "1" (
::            echo %%i>>"%PATH_RES_COM%\install.txt"
::        ) else (
::            echo %%i | findstr "??-??"
::            if "!errorlevel!" equ "1" (
::                if not exist "%PATH_SYS%\%%i" (
::                    echo %%i>>"%PATH_RES_COM%\install.txt"
::                )
::            ) else (
::                echo %%i>>"%PATH_RES_COM%\install.txt"
::            )
::        )
::    ) else (
::        echo %%i | findstr "??-??"
::        if "!errorlevel!" equ "1" (
::            if not exist "%PATH_SYS%\%%i" (
::                echo %%i>>"%PATH_RES_COM%\install.txt"
::            )
::        ) else (
::            echo %%i>>"%PATH_RES_COM%\install.txt"
::        )
::    )
::)
for %%i in (%PATH_RES_COM%\*.txt) do (
    call:log "Sorting %%i..."
    sort "%%i" /T "%PATH_TEMP%" /O "%%i"
)
goto:eof

:msvc_host
del /f /q "%PATH_RES_SYS%\Windows\System32\x3d*.dll"
del /f /q "%PATH_RES_SYS%\Windows\System32\xactengine*.dll"
del /f /q "%PATH_RES_SYS%\Windows\System32\XAPOFX*.dll"
xcopy "%SystemRoot%\System32\x3d*.dll" "%PATH_RES_SYS%\Windows\System32\" /y
xcopy "%SystemRoot%\System32\xactengine*.dll" "%PATH_RES_SYS%\Windows\System32\" /y
xcopy "%SystemRoot%\System32\XAPOFX*.dll" "%PATH_RES_SYS%\Windows\System32\" /y
goto:eof

:extract
call:core_extract
goto:eof

:prepare
call:core_hive_load
call:msvc_host
call:core_prepare
call:core_hive_unload
goto:eof

:pack
call:core_pack
call:iso_create
call:iso_pack
goto:eof

:uihost
call:log "Building UIHost..."
cd /d "%PATH_HOST%"
call:log "Testing CNPM..."
call cnpm 1>nul 2>nul
set NPM=cnpm
if "%errorlevel%" neq "0" (
    call:log "Testing NPM..."
    set NPM=npm
)
call %NPM% install
call %NPM% run pack
cd /d "%~dp0.."
xcopy "%PATH_HOST%\dist\win-unpacked\*.*" "%PATH_ISO%\FlysoftPE\host\" /y /e
goto:eof

:plug_extract
if exist "%PATH_CUR%\file_list.txt" (
    wimlib-imagex extract "%PATH_ISODIR%\sources\install.wim" 1 "@%PATH_CUR%\file_list.txt" --dest-dir="%PATH_CUR%\files" --nullglob --no-acls
)
set COUNT=1
if exist "%PATH_CUR%\reg_list.txt" (
    if not exist "%PATH_TEMP%\SYSTEM" (
        wimlib-imagex extract "%PATH_ISODIR%\sources\install.wim" 1 "\Windows\System32\config\software" --no-acls --nullglob --dest-dir="%PATH_TEMP%"
        wimlib-imagex extract "%PATH_ISODIR%\sources\install.wim" 1 "\Windows\System32\config\system" --no-acls --nullglob --dest-dir="%PATH_TEMP%"
        wimlib-imagex extract "%PATH_ISODIR%\sources\install.wim" 1 "\Windows\System32\config\drivers" --no-acls --nullglob --dest-dir="%PATH_TEMP%"
    )
    call:core_hive_load
    del /f /q "%PATH_CUR%\reg_*.reg"
    for /f "delims=" %%i in (%PATH_CUR%\reg_list.txt) do (
        reg export "HKLM\fs_os_%%i" "%PATH_CUR%\reg_!COUNT!.old.reg"
        for /f "delims=" %%j in ('type %PATH_CUR%\reg_!COUNT!.old.reg') do (
            set str=%%j
            call:log "Processing !str!"
            if "!str!" neq "" (
                set str=!str:HKEY_LOCAL_MACHINE\fs_os_default=HKEY_CURRENT_USER!
                set str=!str:HKEY_LOCAL_MACHINE\fs_os_=HKEY_LOCAL_MACHINE\!
                echo !str! >> %PATH_CUR%\reg_!COUNT!.reg
            ) else (
                echo. >> %PATH_CUR%\reg_!COUNT!.reg
            )
        )
        del /f /q /s "%PATH_CUR%\reg_!COUNT!.old.reg"
        set /a COUNT=!COUNT!+1
    )
    call:core_hive_unload
)
goto:eof

:core_prepare
call:log "Configuring system..."
if exist "%PATH_SYS%\Windows\System32\winpe.jpg" del /f /s /q "%PATH_SYS%\Windows\System32\winpe.jpg"
if exist "%PATH_SYS%\Windows\System32\winre.jpg" del /f /s /q "%PATH_SYS%\Windows\System32\winre.jpg"
if not exist "%PATH_SYS%\Program Files" mkdir "%PATH_SYS%\Program Files"
if not exist "%PATH_SYS%\Program Files (x86)" mkdir "%PATH_SYS%\Program Files (x86)"
if not exist "%PATH_SYS%\Program Files\Common Files" mkdir "%PATH_SYS%\Program Files\Common Files"
if not exist "%PATH_SYS%\Program Files (x86)\Common Files" mkdir "%PATH_SYS%\Program Files (x86)\Common Files"
if not exist "%PATH_SYS%\Users\Default\AppData\Roaming\Microsoft\Internet Explorer\Quick Launch\User Pinned\TaskBar" mkdir "%PATH_SYS%\Users\Default\AppData\Roaming\Microsoft\Internet Explorer\Quick Launch\User Pinned\TaskBar"
if not exist "%PATH_SYS%\Users\Default\AppData\Roaming\Microsoft\Internet Explorer\Quick Launch\User Pinned\StartMenu" mkdir "%PATH_SYS%\Users\Default\AppData\Roaming\Microsoft\Internet Explorer\Quick Launch\User Pinned\StartMenu"
binmay -u "%PATH_SYS%\Windows\System32\DeviceSetupManager.dll" -s u:SystemSetupInProgress -r u:DisableDeviceSetupMgr
xcopy "%PATH_RES_SYS%\*.*" "%PATH_SYS%\" /y /e
if "%MODE_RELEASE%" equ "true" (
    xcopy "%PATH_RES_SYS_R%" "%PATH_SYS%" /y /e
)
xcopy "%PATH_PROJECT%\FlysoftPE\x64\Release\*.exe" "%PATH_SYS%\FlysoftPE\tools" /y /e
attrib -H "%PATH_SYS%\Users\Default"
for /f "tokens=*" %%i in (%PATH_RES_COM%\system.txt) do (
    reg copy "HKLM\fs_os_system\%%i" "HKLM\fs_system\%%i" /s /f
)
for /f "tokens=*" %%i in (%PATH_RES_COM%\software.txt) do (
    reg copy "HKLM\fs_os_software\%%i" "HKLM\fs_software\%%i" /s /f
)
for /f "tokens=*" %%i in (%PATH_RES_COM%\drivers.txt) do (
    reg copy "HKLM\fs_os_drivers\%%i" "HKLM\fs_drivers\%%i" /S /F
)
regfind -p HKEY_LOCAL_MACHINE\fs_software\Classes\AppID -y Interactive User -r
reg import "%PATH_RES_COM%\default.reg"
reg import "%PATH_RES_COM%\software.reg"
reg import "%PATH_RES_COM%\system.reg"
reg import "%PATH_RES_COM%\drivers.reg"
goto:eof

:core_hive_load
reg load "HKLM\fs_default" "%PATH_SYS%\Windows\System32\config\DEFAULT"
reg load "HKLM\fs_system" "%PATH_SYS%\Windows\System32\config\SYSTEM"
reg load "HKLM\fs_software" "%PATH_SYS%\Windows\System32\config\SOFTWARE"
reg load "HKLM\fs_drivers" "%PATH_SYS%\Windows\System32\config\DRIVERS"
reg load "HKLM\fs_os_system" "%PATH_TEMP%\SYSTEM"
reg load "HKLM\fs_os_drivers" "%PATH_TEMP%\DRIVERS"
reg load "HKLM\fs_os_software" "%PATH_TEMP%\SOFTWARE"
goto:eof

:core_hive_unload
reg unload "HKLM\fs_default"
reg unload "HKLM\fs_system"
reg unload "HKLM\fs_software"
reg unload "HKLM\fs_drivers"
reg unload "HKLM\fs_os_system"
reg unload "HKLM\fs_os_drivers"
reg unload "HKLM\fs_os_software"
goto:eof

:core_extract
call:log "Extracting system from boot.wim..."
wimlib-imagex extract "%PATH_ISODIR%\sources\boot.wim" 1 "@%PATH_RES_COM%\boot.txt" --no-acls --nullglob --dest-dir="%PATH_SYS%"
call:log "Extracting system from install.wim..."
if exist "%PATH_ISODIR%\sources\install.wim" (
    set WIMFILE=%PATH_ISODIR%\sources\install.wim
) else (
    set WIMFILE=%PATH_ISODIR%\sources\install.esd
)
wimlib-imagex extract "%WIMFILE%" 1 "@%PATH_RES_COM%\install.txt" --dest-dir="%PATH_SYS%" --nullglob --no-acls

call:log "Extracting registry from install.wim..."
wimlib-imagex extract "%WIMFILE%" 1 "\Windows\System32\config\software" --no-acls --nullglob --dest-dir="%PATH_TEMP%"
wimlib-imagex extract "%WIMFILE%" 1 "\Windows\System32\config\system" --no-acls --nullglob --dest-dir="%PATH_TEMP%"
wimlib-imagex extract "%WIMFILE%" 1 "\Windows\System32\config\drivers" --no-acls --nullglob --dest-dir="%PATH_TEMP%"
call:log "Removing assemblies..."
for /f "delims=" %%i in (%PATH_RES_COM%\remove.txt) do (
    del /f /s /q "%PATH_SYS%\%%i"
)
goto:eof

:core_pack
call:log "Packing system..."
if "%MODE_RELEASE%" equ "false" (
    wimlib-imagex capture "%PATH_SYS%" "%PATH_WIMFILE%" "FlysoftPE" "FlysoftPE" --boot --flags=9 --compress=XPRESS --verbose
) else (
    wimlib-imagex capture "%PATH_SYS%" "%PATH_WIMFILE%" "FlysoftPE" "FlysoftPE" --boot --flags=9 --compress=LZX --verbose
)
if not exist "%PATH_ISO%\sources" mkdir "%PATH_ISO%\sources"
move /y "%PATH_WIMFILE%" "%PATH_ISO%\sources\"
goto:eof

:iso_create
call:log "Creating ISO..."
if not exist "%PATH_ISO%\boot" mkdir "%PATH_ISO%\boot"
if not exist "%PATH_ISO%\efi" mkdir "%PATH_ISO%\efi"
xcopy "%PATH_ISODIR%\boot\*.*" "%PATH_ISO%\boot\" /y /e
xcopy "%PATH_ISODIR%\efi\*.*" "%PATH_ISO%\efi\" /y /e
copy "%PATH_ISODIR%\bootmgr" "%PATH_ISO%\bootmgr" /y
copy "%PATH_ISODIR%\bootmgr.efi" "%PATH_ISO%\bootmgr.efi" /y
if exist "%PATH_ISO%\boot\Bootfix.bin" del /f /s /q "%PATH_ISO%\boot\Bootfix.bin"
if exist "%PATH_ISO%\boot\Resources" del /f /s /q "%PATH_ISO%\boot\Resources"
if exist "%PATH_ISO%\efi\Microsoft\boot\Resources" del /f /s /q "%PATH_ISO%\efi\Microsoft\boot\Resources"
set BCD_BOOT=%PATH_ISO%\boot\bcd
set BCD_EFI=%PATH_ISO%\efi\microsoft\boot\bcd
set BCD_DEFAULT={default}
bcdedit /store "%BCD_BOOT%" /set %BCD_DEFAULT% loadoptions DDISABLE_INTEGRITY_CHECKS
bcdedit /store "%BCD_EFI%" /set %BCD_DEFAULT% loadoptions DDISABLE_INTEGRITY_CHECKS
bcdedit /store "%BCD_BOOT%" /set %BCD_DEFAULT% locale %LANGUAGE%
bcdedit /store "%BCD_EFI%" /set %BCD_DEFAULT% locale %LANGUAGE%
bcdedit /store "%BCD_BOOT%" /set %BCD_DEFAULT% description "FlysoftPE"
bcdedit /store "%BCD_EFI%" /set %BCD_DEFAULT% description "FlysoftPE"
bcdedit /store "%BCD_BOOT%" /set {bootmgr} locale %LANGUAGE%
bcdedit /store "%BCD_EFI%" /set {bootmgr} locale %LANGUAGE%
bcdedit /store "%BCD_BOOT%" /set {memdiag} locale %LANGUAGE%
bcdedit /store "%BCD_EFI%" /set {memdiag} locale %LANGUAGE%
bcdedit /store "%BCD_BOOT%" /set {bootmgr} timeout 0
bcdedit /store "%BCD_EFI%" /set {bootmgr} timeout 0
bcdedit /store "%BCD_BOOT%" /set {bootmgr} displaybootmenu false
bcdedit /store "%BCD_EFI%" /set {bootmgr} displaybootmenu false
bcdedit /store "%BCD_BOOT%" /set %BCD_DEFAULT% bootmenupolicy legacy
bcdedit /store "%BCD_EFI%" /set %BCD_DEFAULT% bootmenupolicy legacy
bcdedit /store "%BCD_BOOT%" /default %BCD_DEFAULT%
bcdedit /store "%BCD_EFI%" /default %BCD_DEFAULT%
attrib -S -H "%BCD_BOOT%.log"
attrib -S -H "%BCD_BOOT%.log1"
attrib -S -H "%BCD_BOOT%.log2"
del /f "%BCD_BOOT%.log"
del /f "%BCD_BOOT%.log1"
del /f "%BCD_BOOT%.log2"
attrib -S -H "%BCD_EFI%.log"
attrib -S -H "%BCD_EFI%.log1"
attrib -S -H "%BCD_EFI%.log2"
del /f "%BCD_EFI%.log"
del /f "%BCD_EFI%.log1"
del /f "%BCD_EFI%.log2"
xcopy "%PATH_RES_ISO%\*.*" "%PATH_ISO%\" /y /e
if "%MODE_RELEASE%" equ "true" (
    call:iso_plan
)
del "%PATH_ISO%\empty" /f /s /q
goto:eof

:iso_plan
xcopy "%PATH_RES_ISO_R%\*.*" "%PATH_ISO%" /y /e
xcopy "%PATH_RES_COM%\Plans\*.*" "%PATH_ISO%\Plans\" /y /e
for /f "tokens=*" %%i in ('dir /ad /b "%PATH_ISO%\Plans"') do (
    for /f "tokens=*" %%j in (%PATH_ISO%\Plans\%%i\plugins\Plugins.txt) do (
        7z x "%PATH_STORE%\%%j.zip" -o"%PATH_ISO%\Plans\%%i\plugins\%%j\" -y
    )
)
goto:eof

:iso_pack
call:log "Packing ISO..."
mkisofs -iso-level 4 -udf -r -force-uppercase -duplicates-once -volid "FlysoftPE" -hide boot.catalog -hide-udf boot.catalog -b "boot/etfsboot.com" -no-emul-boot -boot-load-size 8 -eltorito-platform efi -no-emul-boot -b "efi/microsoft/boot/efisys.bin" -appid "FlysoftPE with VENTOY COMPATIBLE" -publisher "Flysoft"  -o "%PATH_ISOFILE%" "%PATH_ISO%"
goto:eof

::::::::::::::::::::::::::::::::::::::::::::

:log
echo [INFO] %~1
goto:eof

:err
echo [ERR] %~1
goto:eof

:warn
echo [WARN] %~1
goto:eof

:get_access
takeown /f %~1 /r /d Y
icacls %~1 /grant administrators:F /t

:get_access_file
takeown /f %~1
icacls %~1 /grant administrators:F
goto:eof

:get_conf
set RETURN=%~2
(
    set /p RETURN=<%PATH_CONFIG%\%~1
)1>nul 2>nul
goto:eof

:tolower
set TEXT=%~1
for %%i in (a b c d e f g h i j k l m n o p q r s t u v w x y z) do call set TEXT=%%TEXT:%%i=%%i%%
set RETURN=%TEXT%

:toupper
set TEXT=%~1
for %%i in (A B C D E F G H I J K L M N O P Q R S T U V W X Y Z) do call set TEXT=%%TEXT:%%i=%%i%%
set RETURN=%TEXT%