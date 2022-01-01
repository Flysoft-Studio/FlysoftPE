const exec = require("child_process");
const fs = require("fs");
const os = require("os");
const net = require("net");
const fspath = require("path");
const asar = require("asar");
const electron = require("electron");
const remote = require("@electron/remote");
const electron_storage = require("electron-store");
const ini = require("ini");

const ipc = electron.ipcRenderer;
const menu = remote.Menu;
const dialog = remote.dialog;
const app = remote.app;
const shell = electron.shell;
const packed = app.isPackaged;
const root = ((packed) ? (fspath.dirname(app.getPath("exe"))) : (process.cwd()));
const dirname = ((packed) ? (root + "\\resources") : (process.cwd()));
const args = ipc.sendSync("get_args");
const storage = new electron_storage();
const no = undefined;

const com = require("./js/common");
const lang = require("./js/language");
const pop = require("./js/pop");
const win = require("./js/window");