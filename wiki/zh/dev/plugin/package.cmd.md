# package.cmd

`package.cmd` 存放插件的信息(插件名, 作者和类型).

**编码必须为 UTF8!**

格式一般如下.

```Batch
(
    ::Package Name
    echo Hello world
    ::Author
    echo Flysoft
    ::Type (PLUGIN_PACK,THEME_PACK)
    echo PLUGIN_PACK
)>%INFO%
```

`Hello world` 为插件名称, `Flysoft` 为插件作者, `PLUGIN_PACK` 为包的类型(插件包使用 `PLUGIN_PACK` 即可).

**禁止在此批处理文件内放置其他内容!**
