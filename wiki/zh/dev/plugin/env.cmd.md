# env.cmd

`env.cmd` 是插件初始化时会执行的批处理, 一般用于更改环境变量.

此文件用于设置所有插件都可立刻访问的变量.

**编码必须为 UTF8!**

**此文件仅在 FlysoftPE 3.2 以上版本生效!**

例子

```Batch
::附加 PowerShell 目录到搜索路径, 让其他插件可以访问
set PATH=%PATH%;%CUR%\ps
::刷新全局变量, 让新创建的进程可以访问
::setx PATH %PATH%
```

如果需要调用特殊功能或获取特殊目录, 请转到[API](zh/dev/plugin/api).
