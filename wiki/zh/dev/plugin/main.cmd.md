# main.cmd

`main.cmd` 是插件初始化时会执行的批处理, 一般用于注册组件, 创建快捷方式或复制运行库.

**编码必须为 UTF8!**

一个简单的插件初始化批处理如下.

```Batch
::为 hello\world.exe 创建桌面快捷方式, 不建议添加
shortcut "%~1\hello\world.exe" "%Desktop%\Hello world.lnk"
::创建开始菜单快捷方式
shortcut "%~1\hello\world.exe" "%StartMenu%\Hello world.lnk"
goto:eof
```

如果需要调用特殊功能或获取特殊目录, 请转到[API](zh/dev/plugin/api).
