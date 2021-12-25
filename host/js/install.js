const {
    mkdirSync
} = require("original-fs");

var tab_cur;
var mode_cur;
var device_cur;
var usb_cur;
var version_3rd;
var anyway = false;

com.init(() => {
    if (fs.existsSync(root + "\\info.fs") == false) {
        version_3rd = "";
    } else {
        var old3rd = version_3rd;
        version_3rd = fs.readFileSync(root + "\\info.fs").toString();
        if (version_3rd != old3rd) {
            lang.set3rd(version_3rd);
            lang.reload();
        }
    }
    if (geturlvar("mode") == "usbupdate") {
        usb_cur = geturlvar("device");
        tab_cur = "install";
        device_cur = "usb";
        wiz_device_next();
        return;
    }
    tab_cur = "welcome";
    wiz_switch(tab_cur);
});

var workers = [];
var tasks = 0;

function taskcreate(cmd) {
    workers.push(new Worker(__dirname + "\\js\\cmdworker.js"));
    workers[workers.length - 1].postMessage(cmd);
    tasks++;
}

function taskfinish(cb) {
    for (var i = 0; i < workers.length; i++) {
        workers[i].onmessage = (event) => {
            if (event.data == "taskfinish") {
                tasks--;
                if (tasks == 0) {
                    workers = [];
                    cb();
                }
            }
        }
    }
}

function geturlvar(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}

function wiz_switch(tab) {
    com.selector("#wiz_" + tab_cur).style.opacity = "0";
    setTimeout(() => {
        com.selector("#wiz_" + tab_cur).style.display = "none";
        com.selector("#wiz_" + tab).style.display = "block";
        setTimeout(() => {
            com.selector("#wiz_" + tab).style.opacity = "1";
            tab_cur = tab;
        }, 200);
    }, 200);
}

function wiz_mode_switch(mode) {
    mode_cur = mode;
    if (mode == "ramos") {
        com.selector("#wiz_mode_pe").classList.remove("wiz_card_active");
        com.selector("#wiz_mode_ramos").classList.add("wiz_card_active");
        com.selector("#wiz_mode_description_pe").style.display = "none";
        com.selector("#wiz_mode_description_ramos").style.display = "block";
    } else {
        com.selector("#wiz_mode_pe").classList.add("wiz_card_active");
        com.selector("#wiz_mode_ramos").classList.remove("wiz_card_active");
        com.selector("#wiz_mode_description_pe").style.display = "block";
        com.selector("#wiz_mode_description_ramos").style.display = "none";
    }

}

function wiz_device_switch(device) {
    device_cur = device;
    if (device == "iso") {
        com.selector("#wiz_device_usb").classList.remove("wiz_card_active");
        com.selector("#wiz_device_iso").classList.add("wiz_card_active");
    } else {
        com.selector("#wiz_device_usb").classList.add("wiz_card_active");
        com.selector("#wiz_device_iso").classList.remove("wiz_card_active");
    }
}

function wiz_device_next() {
    if (device_cur == undefined) {
        return;
    }
    wiz_switch("install");
    setTimeout(() => {
        if (device_cur == "iso") {
            if (fs.existsSync(root + "\\FlysoftPE\\") == false) {
                pop.open(lang.get("wiz_fileerr"), [lang.get("com_continue")], (id) => {
                    wiz_switch("device");
                    pop.close();
                });
                return;
            }
            var ret = remote.dialog.showSaveDialogSync(remote.getCurrentWindow(), {
                filters: [{
                    name: "ISO File",
                    extensions: ["iso"],
                }]
            });
            if (ret != undefined) {
                const temp = root + "\\isotemp";
                if (fs.existsSync(temp + "\\") == true) {
                    exec.execSync("rd \"" + temp + "\" /s /q");
                }
                exec.execSync("xcopy.exe \"" + root + "\\FlysoftPE\\*.*\" \"" + temp + "\\\" /y /e /c /i /h");
                exec.execSync("rd \"" + temp + "\\plans\\\" /s /q");
                if (mode_cur != undefined) {
                    if (fs.existsSync(root + "\\FlysoftPE\\plans\\" + mode_cur + "\\") == true) {
                        exec.execSync("xcopy.exe \"" + root + "\\FlysoftPE\\plans\\" + mode_cur + "\\*.*\" \"" + temp + "\\FlysoftPE\\\" /y /e /c /i /h");
                    }
                }
                exec.execSync("\"" + dirname + "\\data\\mkisofs.exe\" -iso-level 4 -udf -r -force-uppercase -duplicates-once -volid \"FlysoftPE\" -hide boot.catalog -hide-udf boot.catalog -b \"boot/etfsboot.com\" -no-emul-boot -boot-load-size 8 -eltorito-platform efi -no-emul-boot -b \"efi/microsoft/boot/efisys.bin\" -appid \"FlysoftPE with VENTOY COMPATIBLE\" -publisher \"Flysoft\" -o \"" + ret + "\" \"" + temp + "\"");
                if (fs.existsSync(temp + "\\") == true) {
                    exec.execSync("rd \"" + temp + "\\\" /s /q");
                }
            }
            setTimeout(() => {
                wiz_switch("device");
            }, 2000);
        } else if (device_cur == "usb") {
            if (fs.existsSync(root + "\\FlysoftPE\\") == false) {
                pop.open(lang.get("wiz_fileerr"), [lang.get("com_continue")], (id) => {
                    wiz_switch("device");
                    pop.close();
                });
                return;
            }
            if (usb_cur == undefined) {
                const logfile = dirname + "\\data\\ventoy\\log.txt";
                var logdata;
                const ventoy = "cd /d \"" + dirname + "\\data\\ventoy\" && \"" + dirname + "\\data\\ventoy\\Ventoy2Disk.exe\""
                exec.exec(ventoy);
                pop.open(lang.get("wiz_usbtip"), [lang.get("com_retry"), lang.get("com_continue"), lang.get("com_cancel")], (id) => {
                    if (id.dataset.id == "0") {
                        exec.exec(ventoy);
                        return;
                    }
                    if (id.dataset.id == "1") {
                        if (fs.existsSync(logfile) == false) {
                            return;
                        }
                        logdata = fs.readFileSync(logfile).toString();
                        var inst;
                        var end = -1;
                        var curdrive;
                        com.log("Ventoy log: " + logdata);
                        for (var i = 0; i < 36; i++) {
                            var drive = String.fromCharCode(65 + i) + ":";
                            var temp = logdata.lastIndexOf("Will use \'" + drive + "\' as volume mountpoint");
                            console.log(temp)
                            if (temp > end) {
                                end = temp;
                                curdrive = drive;
                            }
                            temp = logdata.lastIndexOf("SetVolumeMountPoint <" + drive + ">");
                            console.log(temp)
                            if (temp > end) {
                                end = temp;
                                curdrive = drive;
                            }
                        }
                        usb_cur = curdrive;
                        if (end != -1) {
                            try {
                                exec.execSync("label.exe " + usb_cur + " FlysoftPE");
                            } catch (e) {}
                            pop.close();
                            wiz_device_next();
                        }
                    }
                    if (id.dataset.id == "2") {
                        pop.close();
                        setTimeout(() => {
                            usb_cur = undefined;
                            wiz_switch("device");
                        }, 2000);
                    }
                });
                return;
                /*
                const temp = app.getAppPath("userData") + "\\part.dat"
                exec.execSync("\"" + process.cwd() + "\\resources\\PartAssist\\PartAssist.exe\" /list /usb /out:" + temp);
                var usbid = [];
                var usblet = [];
                var lines = fs.readFileSync(temp).toString().split("\n");
                for (var i = 0; i < lines.length; i++) {
                    for (var j = 1; j <= 40; j++) {
                        if (lines[i].indexOf(j + "\t|") != -1) {
                            usbid.push(j);
                        }
                    }
                }
                if (usbid.length == 0) {
                    pop.open(lang.get("wiz_usberr"), [lang.get("com_cancel")], (id) => {
                        wiz_switch("device");
                        pop.close();
                    });
                    return;
                }
                for (var i = 0; i < usbid.length; i++) {
                    exec.execSync("\"" + process.cwd() + "\\resources\\PartAssist\\PartAssist.exe\" /list:" + usbid[i] + " /out:" + temp);
                    var info = fs.readFileSync(temp).toString();
                    var set = false;
                    for (var j = 0; j < 36; j++) {
                        var drive = String.fromCharCode(65 + j) + ":";
                        if (info.indexOf(drive) != -1) {
                            set = true;
                            usblet.push(drive);
                        }
                    }
                    if (set == false) {
                        usblet.push("PhysicalDrive" + usbid[i]);
                    }
                }
                if (usblet.length != 0) {
                    usblet.push(lang.get("com_cancel"));
                    pop.open(lang.get("wiz_usbselect"), usblet, (id) => {
                        if (id.dataset.id == (usblet.length - 1).toString()) {
                            wiz_switch("device");
                            pop.close();
                            return;
                        }
                        var curusb = parseInt(id.dataset.id);
                        pop.open(lang.get("wiz_usbwarn"), [lang.get("com_continue"), lang.get("com_cancel")], (id) => {
                            if (id.dataset.id == 0) {
                                const runpart = (cmd) => {
                                    com.log("Running part command " + cmd)
                                    exec.execSync("\"" + process.cwd() + "\\resources\\PartAssist\\PartAssist.exe\" " + cmd);
                                }
                                runpart("/hd:" + usbid[curusb] + " /del:all");
                                runpart("/init:" + usbid[curusb]);
                                runpart("/rebuildmbr:" + usbid[curusb]);
                                runpart("/hd:" + usbid[curusb] + " /pri /cre /size:auto /fs:fat32 /align /label:FlysoftPE /letter:auto");
                                setTimeout(() => {
                                    runpart("/list:" + usbid[curusb] + " /out:" + temp);
                                    var info = fs.readFileSync(temp).toString();
                                    for (var i = 0; i < 36; i++) {
                                        var drive = String.fromCharCode(65 + i) + ":";
                                        if (info.indexOf(drive) != -1) {
                                            pop.close();
                                            usb_cur = drive;
                                            setTimeout(() => {
                                                wiz_device_next();
                                            }, 2000);
                                        }
                                    }
                                }, 5000);
                            }
                            wiz_switch("device");
                            pop.close();
                        });
                    });
                    return;
                }*/
            }
            try {
                if (fs.existsSync(usb_cur + "\\ventoy\\") == false) {
                    fs.mkdirSync(usb_cur + "\\ventoy\\");
                }
                taskcreate("copy \"" + root + "\\FlysoftPE\\sources\\boot.wim\" \"" + usb_cur + "\\Flysoft.wim\" /y");
                taskcreate("copy \"" + root + "\\FlysoftPE\\version.fs\" \"" + usb_cur + "\\version.fs\" /y");
                taskcreate("xcopy.exe \"" + root + "\\FlysoftPE\\FlysoftPE\\*.*\" \"" + usb_cur + "\\FlysoftPE\\\" /y /e /c /i /h");
                taskcreate("xcopy.exe \"" + dirname + "\\data\\root\\*.*\" \"" + usb_cur + "\\\" /y /e /c /i /h");
                if (packed == true) {
                    exec.execSync("xcopy \"" + dirname + "\\*.*\" \"" + root + "\\FlysoftPE\\FlysoftPE\\host\\resources\\\" /y /e /c");
                }
                if (mode_cur != undefined) {
                    if (fs.existsSync(root + "\\FlysoftPE\\plans\\" + mode_cur + "\\") == true) {
                        taskcreate("xcopy.exe \"" + root + "\\FlysoftPE\\plans\\" + mode_cur + "\\*.*\" \"" + usb_cur + "\\FlysoftPE\\\" /y /e /c /i /h");
                    }
                }
                taskfinish(() => {
                    setTimeout(() => {
                        wiz_switch("complete");
                    }, 2000);
                });
            } catch (e) {
                com.err(e);
                setTimeout(() => {
                    usb_cur = undefined;
                    wiz_switch("device");
                }, 2000);
            }
        }
    }, 2000);
}

function wiz_import_next() {
    wiz_switch("import");
    setTimeout(() => {
        var ret = remote.dialog.showOpenDialogSync(remote.getCurrentWindow(), {
            filters: [{
                name: "ISO File",
                extensions: ["iso"],
            }]
        });
        if (ret != undefined) {
            if (fs.existsSync(root + "\\FlysoftPE")) {
                exec.execSync("rd \"" + root + "\\FlysoftPE\\\" /s /q");
            }
            fs.mkdirSync(root + "\\FlysoftPE");
            taskcreate("\"" + dirname + "\\data\\7z.exe\" x \"" + ret + "\" \"-o" + root + "\\FlysoftPE\" -y");
            taskfinish(() => {
                var check = ["boot", "efi", "FlysoftPE", "sources\\boot.wim", "bootmgr", "bootmgr.efi"];
                for (var i = 0; i < check.length; i++) {
                    if (fs.existsSync(root + "\\FlysoftPE\\" + check[i]) == false) {
                        pop.open(lang.get("ip_formaterr"), [lang.get("com_continue")], (id) => {
                            wiz_switch("welcome");
                            pop.close();
                        });
                        return;
                    }
                }
                fs.writeFileSync(root + "\\FlysoftPE\\version.fs", "Imported by user");
                setTimeout(() => {
                    wiz_switch("complete");
                }, 2000);
            });
        } else {
            setTimeout(() => {
                wiz_switch("welcome");
            }, 2000);
        }
    }, 2000);
}