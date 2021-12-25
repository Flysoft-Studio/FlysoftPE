#define _CRT_SECURE_NO_WARNINGS
#include <iostream>
#include <windows.h>
using namespace std;

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nShowCmd)
{
    cout << "FlysoftPE Hide Run\n";
    ShellExecute(NULL, "open", getenv("ComSpec"), (string("/c \"") + string(lpCmdLine) + string("\"")).c_str(), NULL, SW_HIDE);
    return 0;
}