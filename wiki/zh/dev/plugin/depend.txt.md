# depend.txt

`depend.txt` 存放插件的依赖列表, 一行一个插件文件夹名称.

在运行 `main.cmd` 前会加载此列表中所指定的所有依赖.

**如果其中任意一个依赖不存在, 则插件将停止加载!**

**同一个依赖不会被加载两次!**

如需调用 PowerShell, 可在 `depend.txt` 内写入以下内容.

```
PowerShell_Flysoft
```

插件加载时会先加载 `PowerShell_Flysoft` 插件, 该插件会将 PowerShell 添加至 PATH 内.

然后你就可以在 `main.cmd` 内调用 `pwsh` 命令运行 PowerShell 脚本了.

同理, 在 `depend.txt` 内加入 `PECMD_Flysoft` 就可以在 `main.cmd` 内调用 PECMD 脚本了.