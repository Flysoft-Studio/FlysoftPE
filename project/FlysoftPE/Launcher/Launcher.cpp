#define _CRT_SECURE_NO_WARNINGS
#include <iostream>
#include <windows.h>
using namespace std;

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nShowCmd)
{
    cout << "FlysoftPE Launcher\n";
    HANDLE mutex = CreateMutex(NULL, true, "FlysoftPEMutex");
    if (GetLastError() == ERROR_ALREADY_EXISTS) {
        MessageBox(NULL, "Failed to create mutex. You cannot run FlysoftPE Launcher manually", "FlysoftPE.Launcher", MB_OK | MB_ICONERROR);
        return 1;
    }
    ShellExecute(NULL, "open", "X:\\FlysoftPE\\main.cmd", NULL, NULL, SW_HIDE);
    for (;;) {
        Sleep(1);
    }
    return 0;
}