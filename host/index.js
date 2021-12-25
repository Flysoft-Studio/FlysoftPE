const electron = require("electron");
const exec = require("child_process");
const path = require("path");
const fs = require("fs");
const ipc = electron.ipcMain;
const menu = electron.Menu;
const app = electron.app;
const packed = app.isPackaged;
const root = ((packed) ? (path.dirname(app.getPath("exe"))) : (process.cwd()));
const dirname = ((packed) ? (root + "\\resources") : (process.cwd()));
var args;
var index;

function create_win(arg, url, closecb) {
    log("Creating window with args " + JSON.stringify(arg) + ", url " + url + ".");
    var window = new electron.BrowserWindow(arg);
    window.loadURL(url);
    if (app.isPackaged == false || args.devtools == true) {
        log("DevTools opened.");
        window.openDevTools();
    }
    window.on("ready-to-show", function (event) {
        log("Window is ready to show.");
        window.show();
    });
    window.on("moved", function (event) {
        window.webContents.send("get_pos");
    });
    window.on("resized", function (event) {
        window.webContents.send("get_pos");
    });
    window.on("close", function (event) {
        log("Clearing cache...");
        event.preventDefault();
        window.webContents.session.clearCache().then(() => {
            log("Successfully cleaned cache.");
            window.destroy();
        });
    });
    window.on("closed", function (event) {
        if (closecb != undefined) {
            closecb();
        }
        log("Window closed.");
        window = null;
    });
}

function log(msg) {
    console.log("[INFO] " + msg);
}

function err(msg) {
    console.log("[ERROR] " + msg);
}

function open_wiz(wiz) {
    create_win({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        resizable: true,
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegrationInWorker: true
        }
    }, "file://" + __dirname + "/" + wiz);
}
app.on("ready", function () {
    if (app.isPackaged == true) {
        args = require("minimist")(process.argv.slice(1));
    } else {
        args = require("minimist")(process.argv.slice(2));
    }
    log("Started with args " + JSON.stringify(args));
    const lock = app.requestSingleInstanceLock();
    if (lock == false) {
        err("Request single instance lock failed!");
        app.exit();
    }
    require("@electron/remote/main").initialize();
    menu.setApplicationMenu(null);
    ipc.on("get_args", function (sys) {
        sys.returnValue = args;
    });
    ipc.on("open_install", function (sys, mode, device) {
        open_wiz("install.html?mode=" + mode + "&device=" + device);
    });
    ipc.on("open_import", function (sys) {
        open_wiz("import.html");
    });
    ipc.on("open_rickroll", function (sys) {
        open_wiz("rick.html");
    });
    if (args.background == true) {
        create_win({
            width: 800,
            height: 600,
            resizable: true,
            frame: false,
            show: false,
            alwaysOnTop: true,
            fullscreen: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
                nodeIntegrationInWorker: true
            }
        }, "file://" + __dirname + "/init.html");
    } else if (args.install == true) {
        open_wiz("install.html");
    } else if (args.rick == true) {
        open_wiz("rick.html");
    } else if (args.import == true) {
        open_wiz("import.html");
    } else if (args.desk == true) {
        create_win({
            resizable: true,
            frame: false,
            show: false,
            webPreferences: {
                nativeWindowOpen: true,
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
                nodeIntegrationInWorker: true
            }
        }, "file://" + __dirname + "/desk.html");
    } else if (args.window == true) {
        create_win({
            resizable: true,
            frame: false,
            show: false,
            webPreferences: {
                nativeWindowOpen: true,
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
                nodeIntegrationInWorker: true
            }
        }, "file://" + __dirname + "/window.html");
    } else {
        create_win({
            width: 1000,
            height: 800,
            minWidth: 800,
            minHeight: 600,
            resizable: true,
            frame: false,
            show: false,
            webPreferences: {
                nativeWindowOpen: true,
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
                nodeIntegrationInWorker: true
            }
        }, "file://" + __dirname + "/hub.html", () => {
            try {
                exec.execSync("taskkill.exe /f /im aria2c_hub.exe");
            } catch (e) {}
        });
    }
});