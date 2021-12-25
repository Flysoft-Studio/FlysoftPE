# API

### 变量

```Api
%~1 - 插件根目录(仅对 main.cmd 生效)
%Lang% - 系统语言(chs|eng)
%CUR% - 插件根目录(仅对 env.cmd 生效)
%LOADPLUGIN% - 是否为在启动后手动加载的插件(true|false)
%AppData% - 用户 AppData\Roaming
%LocalAppData% - 用户 AppData\Local
%LocalLowAppData% - 用户 AppData\LocalLow
%Desktop% - 公用桌面文件夹(用于存放程序快捷方式)
%StartMenu% - 公用开始菜单文件夹(用于存放程序快捷方式)
%FSPE_TEMP% - 存放日志和临时文件的文件夹
%FSPE_VAR% - 存放变量的文件夹
%FSPE_RES% - 存放资源文件的文件夹
%FSPE_USER% - 用户用于存放用户插件, 主题, 驱动程序等的文件夹
%FSPE_ENVMODE% - 环境模式, 可用于判断用户是否保留桌面, 下载等文件夹中的数据(true|false)
%FSPE_BRIGHTNESS% - 用户指定的屏幕亮度
```

### cursor

##### 用法

`cursor <鼠标指针目录>`

##### 作用

更改鼠标指针(也可用于重载鼠标指针, 详见[鼠标指针](zh/dev/theme/cursor))

##### 例子

```Batch
::注意, 路径带有空格的一定要加引号.
cursor "X:\Windows\Cursors"
```

### hide

##### 用法

`hide <程序命令行>`

##### 作用

在后台开启一个程序

### pin

##### 用法

`pin TaskBar <程序文件>`

##### 作用

将程序固定到任务栏

##### 例子

```Batch
::将程序固定到任务栏上
::注意, 路径带有空格的一定要加引号.
pin TaskBar "%~1\hello.exe"
```

### shortcut

##### 用法

`shortcut <程序文件> <快捷方式文件>`

##### 作用

创建一个快捷方式(一般在桌面和开始菜单上)

##### 例子

```Batch
::在桌面和开始菜单上创建快捷方式
::注意, 路径带有空格的一定要加引号, 快捷方式文件必须为 .lnk 结尾.
shortcut "%~1\hello.exe" "%Desktop%\Hello world.lnk"
shortcut "%~1\hello.exe" "%StartMenu%\Hello world.lnk"
```

### msgbox

##### 用法

`msgbox <内容> <标题>`

##### 作用

弹出一个警告对话框

##### 例子

```Batch
::弹出一个标题为 Hello 内容为 World 的对话框
::注意, 标题或内容带有空格的一定要加引号.
msgbox "World" "Hello"
```

### dpifix

##### 用法

`dpifix`

##### 作用

修改字体配置文件里的字体大小适配当前 DPI

##### 例子

```Batch
::一般更改系统字体会用到此 API
::复制自定义字体配置文件
copy "%~1/fonts.ini" "%FSPE_RES%/fonts.ini" /y
::修改字体配置文件里的字体大小适配当前 DPI
dpifix
::应用修改
nomeiryoui -set "%FSPE_RES%/fonts.ini"
```

### reslution

##### 用法

`reslution <屏幕宽度> <屏幕高度>`

##### 作用

更改屏幕分辨率

##### 例子

```Batch
::注意, 参数不能带有空格.
reslution 1920 1080
```

### 其他工具

NoMeiryoUI  的用法详见 https://github.com/Tatsu-syo/noMeiryoUI

UnZip 的用法详见 http://infozip.sourceforge.net/FAQ.html#UnZip
