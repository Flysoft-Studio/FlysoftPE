@echo off
chcp 936
title FlysoftPE Loader
color 4F
mode con: cols=75 lines=24
:begin
cls
echo ===========================================================================
echo FlysoftPE run into a problem last time
echo FlysoftPE 在上次启动时遇到了一个问题
echo ===========================================================================
echo.
echo ===========================================================================
echo English
echo It may be caused by plugins or drivers
echo We suggest you enter safe mode for troubleshooting
echo In safe mode, all plugins and drivers will not be loaded
echo Press A to enable safe mode, B to ignore this message and C to open CMD
echo ===========================================================================
echo 简体中文
echo 这可能是插件或驱动引起的故障
echo 我们建议你进入安全模式进行故障排查
echo 在安全模式下, 所有插件和驱动都不会被加载
echo 按 A 启用安全模式, 按下 B 忽略此警告, 按下 C 打开命令提示符
echo ===========================================================================
echo 繁體中文
echo 這可能是挿件或驅動引起的故障
echo 我們建議你進入安全模式進行故障排查
echo 在安全模式下, 所有挿件和驅動都不會被加載
echo 按 A 啟用安全模式, 按下 B 忽略此警告, 按下 C 打開命令提示符
choice /c ABC /n
set OP=%errorlevel%
if "%OP%" equ "1" (
    echo true>%FSPE_VAR%\FSPE_SAFEMODE.bin
)
if "%OP%" equ "2" (
    goto:eof
)
if "%OP%" equ "3" (
    start
    goto:begin
)
goto:eof