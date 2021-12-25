#define _CRT_SECURE_NO_WARNINGS
#include <iostream>
#include <windows.h>
#include <winuser.rh>
using namespace std;

string path;
void setcur(const char* file, int id) {
	SetSystemCursor(LoadCursorFromFileA((path + string("\\") + string(file)).c_str()), id);
}
int main(int argc, char* argv[])
{
	cout << "FlysoftPE Cursor Loader\n";
	cout << "Usage: cursor <path>\n";
	if (argc != 2) {
		return -1;
	}
	path = argv[1];
	setcur("aero_arrow.cur", OCR_NORMAL);
	setcur("aero_busy.ani", OCR_WAIT);
	setcur("aero_up.cur", OCR_UP);
	setcur("aero_nwse.cur", OCR_SIZENWSE);
	setcur("aero_nesw.cur", OCR_SIZENESW);
	setcur("aero_ew.cur", OCR_SIZEWE);
	setcur("aero_ns.cur", OCR_SIZENS);
	setcur("aero_move.cur", OCR_SIZEALL);
	setcur("aero_unavail.cur", OCR_NO);
	setcur("aero_link.cur", OCR_HAND);
	setcur("aero_working.ani", OCR_APPSTARTING);
	return 0;
}