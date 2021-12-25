# config.reg

**使用他人素材制作主题包前请确保你已经获得了原作者的授权!**

`config.reg` 是一个会在主题初始化时导入的注册表文件, 你可以把任务栏配置和颜色主题放在这里.

如果需要浅色主题

```Registry
[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize]
"SystemUsesLightTheme"=dword:00000001
"AppsUseLightTheme"=dword:00000001
```

如果需要深色主题

```Registry
[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize]
"SystemUsesLightTheme"=dword:00000000
"AppsUseLightTheme"=dword:00000000
```

任务栏配置请用 Hub 内 PE 设置里的编辑任务栏按钮, 打开配置界面进行配置, 点击应用后复制出 U 盘下 `\FlysoftPE\config\openshell.reg`.

