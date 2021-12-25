process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true;
const remote = require("@electron/remote");
const app = remote.app;
const fs = require("fs");
const electron = require("electron");
const fspath = require("path");
const ipc = electron.ipcRenderer;
const args = ipc.sendSync("get_args");

const packed = app.isPackaged;
const root = ((packed) ? (fspath.dirname(app.getPath("exe"))) : (process.cwd()));
const dirname = ((packed) ? (root + "\\resources") : (process.cwd()));

const com = require("./js/common");

const init_file = process.env["SystemDrive"] + "\\FlysoftPE\\temp\\WATCH_INIT.tmp";
const bg_file = process.env["SystemRoot"] + "\\Web\\Wallpaper\\Windows\\img0.jpg";

var version_3rd;

com.init(() => {
    if (fs.existsSync(root + "\\info.fs") == false) {
        version_3rd = "";
    } else {
        version_3rd = fs.readFileSync(root + "\\info.fs").toString();
        com.selector("#boot > div").innerText = version_3rd;
    }
    com.selector("#full").style.backgroundImage = "url(file:///" + bg_file.split("\\").join("/") + ")";
});

setInterval(() => {
    if (packed == true) {
        if (fs.existsSync(init_file) == false) {
            remote.getCurrentWindow().close();
        }
    }
    remote.getCurrentWindow().setSize(window.screen.width, window.screen.height, false);
}, 100);