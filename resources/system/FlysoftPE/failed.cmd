@echo off
chcp 936
title FlysoftPE Loader
color 4F
mode con: cols=75 lines=24
:begin
cls
echo ===========================================================================
echo FlysoftPE run into a problem last time
echo FlysoftPE ���ϴ�����ʱ������һ������
echo ===========================================================================
echo.
echo ===========================================================================
echo English
echo It may be caused by plugins or drivers
echo We suggest you enter safe mode for troubleshooting
echo In safe mode, all plugins and drivers will not be loaded
echo Press A to enable safe mode, B to ignore this message and C to open CMD
echo ===========================================================================
echo ��������
echo ������ǲ������������Ĺ���
echo ���ǽ�������밲ȫģʽ���й����Ų�
echo �ڰ�ȫģʽ��, ���в�������������ᱻ����
echo �� A ���ð�ȫģʽ, ���� B ���Դ˾���, ���� C ��������ʾ��
echo ===========================================================================
echo ���w����
echo �@�����ǒ�����������Ĺ���
echo �҂����h���M�밲ȫģʽ�M�й����Ų�
echo �ڰ�ȫģʽ��, ���В������Ӷ����������d
echo �� A ���ð�ȫģʽ, ���� B ���Դ˾���, ���� C ���_������ʾ��
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