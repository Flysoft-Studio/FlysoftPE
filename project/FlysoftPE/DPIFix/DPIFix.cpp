#define _CRT_SECURE_NO_WARNINGS
#include <iostream>
#include <windows.h>
#include <shellscalingapi.h>
#include <string>
#pragma comment(lib, "shcore.lib")

using namespace std;

int main(int argc, char* argv[]) {
    cout << "FlysoftPE DPIFix\n";
    cout << "Usage: dpifix\n";
    SetProcessDpiAwareness(PROCESS_SYSTEM_DPI_AWARE);
    int dpi = GetDpiForSystem();
    if (dpi >= 96 && dpi <= 108) {
        dpi = dpi + 4;
    }
    else if (dpi >= 108 && dpi <= 132) {
        dpi = dpi + 5;
    }
    else if (dpi >= 132 && dpi <= 156) {
        dpi = dpi + 6;
    }
    else if (dpi >= 156 && dpi <= 180) {
        dpi = dpi + 7;
    }
    else if (dpi >= 180 && dpi <= 204) {
        dpi = dpi + 8;
    }
    else if (dpi >= 204 && dpi <= 228) {
        dpi = dpi + 9;
    }
    else if (dpi >= 228 && dpi <= 252) {
        dpi = dpi + 10;
    }
    else if (dpi >= 252 && dpi <= 276) {
        dpi = dpi + 11;
    }
    else if (dpi >= 276 && dpi <= 300) {
        dpi = dpi + 12;
    }
    else if (dpi >= 300 && dpi <= 324) {
        dpi = dpi + 13;
    }
    else if (dpi >= 324 && dpi <= 348) {
        dpi = dpi + 14;
    }
    else if (dpi >= 348 && dpi <= 372) {
        dpi = dpi + 15;
    }
    else if (dpi >= 372 && dpi <= 396) {
        dpi = dpi + 16;
    }
    else if (dpi >= 396 && dpi <= 420) {
        dpi = dpi + 17;
    }
    else if (dpi >= 420 && dpi <= 444) {
        dpi = dpi + 18;
    }
    else if (dpi >= 444 && dpi <= 468) {
        dpi = dpi + 19;
    }
    else if (dpi >= 468 && dpi <= 480) {
        dpi = dpi + 20;
    }
    else {
        dpi = 100;
    }
    int size = dpi / 100.0 * -12;
    const char* file = "X:\\FlysoftPE\\res\\fonts.ini";
    //const char* file = "C:\\FlysoftPEProject\\resources\\system\\FlysoftPE\\res\\fonts.ini";
    WritePrivateProfileString("TitleFont", "Height", to_string(size).c_str(), file);
    WritePrivateProfileString("IconFont", "Height", to_string(size).c_str(), file);
    WritePrivateProfileString("PaletteFont", "Height", to_string(size).c_str(), file);
    WritePrivateProfileString("HintFont", "Height", to_string(size).c_str(), file);
    WritePrivateProfileString("MessageFont", "Height", to_string(size).c_str(), file);
    WritePrivateProfileString("MenuFont", "Height", to_string(size).c_str(), file);
    cout << dpi;
    return 0;
}