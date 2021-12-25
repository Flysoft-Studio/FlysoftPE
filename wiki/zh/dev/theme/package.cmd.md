# package.cmd

**使用他人素材制作主题包前请确保你已经获得了原作者的授权!**

`package.cmd` 存放主题的信息(主题名, 作者和类型).

**编码必须为 UTF8!**

格式一般如下.

```Batch
(
    ::Package Name
    echo Hello world
    ::Author
    echo Flysoft
    ::Type (PLUGIN_PACK,THEME_PACK)
    echo THEME_PACK
)>%INFO%
```

`Hello world` 为主题名称, `Flysoft` 为主题作者, `THEME_PACK` 为包的类型(主题包使用 `THEME_PACK` 即可).

**禁止在此批处理文件内放置其他内容!**

