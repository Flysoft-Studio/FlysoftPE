#define _CRT_SECURE_NO_WARNINGS
#include <iostream>
#include <windows.h>
using namespace std;

int main(int argc, char* argv[])
{
    cout << "FlysoftPE Resolution\n";
    cout << "Usage: resolution <width> <height>\n";
    if (argc != 3) {
        return -1;
    }
    DEVMODE DevMode;
    EnumDisplaySettings(NULL, 0, &DevMode);
    DevMode.dmFields = DM_PELSWIDTH | DM_PELSHEIGHT;
    DevMode.dmPelsWidth = atoi(argv[1]);
    DevMode.dmPelsHeight = atoi(argv[2]);
    DevMode.dmDisplayFrequency = 30;
    DevMode.dmBitsPerPel = 32;
    ChangeDisplaySettings(&DevMode, 0);
    return 0;
}