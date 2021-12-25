#define _CRT_SECURE_NO_WARNINGS
#include <iostream>
#include <string>
#include <windows.h>
using namespace std;
LRESULT CALLBACK WindowProc(
	HWND hwnd,
	UINT uMsg,
	WPARAM wparam,
	LPARAM lparam
)
{
	return DefWindowProc(hwnd, uMsg, wparam, lparam);
}
string wstr_to_str(const wstring& wstr, UINT CodePage = CP_OEMCP)
{
	string str;
	int buffer_size = 0;
	char* pchar_str = NULL;
	buffer_size = WideCharToMultiByte(CodePage, NULL, wstr.c_str(), -1, 0, 0, NULL, FALSE);
	pchar_str = new char[buffer_size + 1];
	if (pchar_str == NULL)
	{
		return str;
	}
	memset(pchar_str, 0, buffer_size + 1);
	if (WideCharToMultiByte(CodePage, NULL, wstr.c_str(), -1, pchar_str, buffer_size, NULL, FALSE))
	{
		str = pchar_str;
	}
	delete pchar_str;
	return str;
}
char** CommandLineToArgv(LPCWSTR lpCmdLine, __out int* pNumArgs)
{
	LPWSTR* szArgList;
	int argCount;
	BOOL bRet = FALSE;
	if (NULL == lpCmdLine)
	{
		*pNumArgs = 0;
		return NULL;
	}
	szArgList = CommandLineToArgvW(lpCmdLine, &argCount);
	if (szArgList == NULL)
	{
		*pNumArgs = 0;
		return NULL;
	}

	char** szArgListA = NULL;
	HLOCAL hLocalList = NULL, hLocalListItem = NULL;

	szArgListA = (char**)malloc(sizeof(char*) * argCount);
	memset(szArgListA, 0x0, sizeof(char*) * argCount);
	for (int i = 0; i < argCount; i++)
	{
		string str = wstr_to_str(szArgList[i]);

		szArgListA[i] = (char*)malloc(str.length() + 1);
		memset(szArgListA[i], 0x0, str.length());
		strncpy(szArgListA[i], str.c_str(), str.length());
		szArgListA[i][str.length()] = '\0';
	}
	LocalFree(szArgList);
	*pNumArgs = argCount;
	bRet = LocalUnlock(hLocalList);
	return szArgListA;
}
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nShowCmd)
{
	int value = 100;
	char** argv;
	int argc;
	argv = CommandLineToArgv(GetCommandLineW(), &argc);
	if (argv == NULL) {
		MessageBox(NULL, "Invalid argv.", "FlysoftPE.Brightness.Host", MB_OK | MB_ICONERROR);
		return 1;
	}
	if (argc != 2) {
		MessageBox(NULL, "Invalid argc.", "FlysoftPE.Brightness.Host", MB_OK | MB_ICONERROR);
		return 1;
	}
	value = atoi(argv[1]);
	if (value > 100 || value < 20) {

		MessageBox(NULL, "Invalid input value.", "FlysoftPE.Brightness.Host", MB_OK | MB_ICONERROR);
		return 1;
	}
	WNDCLASS wc;
	wc.hbrBackground = (HBRUSH)GetStockObject(BLACK_BRUSH);
	wc.hInstance = hInstance;
	wc.lpfnWndProc = WindowProc;
	wc.lpszClassName = "FlysoftPE.Brightness.Host";
	wc.hCursor = LoadCursor(NULL, IDC_ARROW);
	wc.hIcon = LoadIcon(NULL, IDI_APPLICATION);
	wc.lpszMenuName = NULL;
	wc.style = 0;
	RegisterClass(&wc);
	int width = GetSystemMetrics(SM_CXSCREEN);
	int height = GetSystemMetrics(SM_CYSCREEN);
	HWND hwnd = CreateWindowEx(WS_EX_TRANSPARENT | WS_EX_LAYERED | WS_EX_TOOLWINDOW, wc.lpszClassName, wc.lpszClassName, WS_VISIBLE | WS_POPUP, 0, 0, width, height, NULL, NULL, hInstance, NULL);
	SetLayeredWindowAttributes(hwnd, NULL, (int)((1 - value / 100.0) * 255), LWA_ALPHA);
	SetWindowPos(hwnd, HWND_TOPMOST, NULL, NULL, NULL, NULL, SWP_NOMOVE | SWP_NOSIZE);
	ShowWindow(hwnd, SW_SHOWNORMAL);
	UpdateWindow(hwnd);
	MSG msg;
	while (true) {
		if (GetMessage(&msg, NULL, 0, 0) == FALSE)
		{
			break;
		}
		TranslateMessage(&msg);
		DispatchMessage(&msg);
	}
	return 0;
}