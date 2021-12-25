var pe = false;
var installed = false;
var drv_loaded = false;
var usb_cur;
var tab_cur;

var path = {
    fs: no,
    config: no,
    drv: no,
    pf: no,
    plugin: no,
    plug: root + "\\plugins",
};

var version = {
    api: {},
    new: no,
    newhub: no,
    latest: no,
    latesthub: no,
    dl: no,
    links: no,
    usb: no,
    latestusb: no,
    channel: no,
    mirror: no,
    hub: no,
    threerd: no,
    sta: {
        process: false,
        finish: false,
    },
    stop: false,
};

var dl = {
    max: 0,
    count: {},
    wait: false,
}

var no_sidebar = false;

var store = {
    list: [],
    tab_cur: no,
};

com.init(() => {
    hub_switch("home");
    hub_version_load(true);
    hub_search();
    setInterval(hub_search, 5000);
    remote.getCurrentWindow().hookWindowMessage(0x0219, hub_search);
});

function hub_version_load(init = false) {
    com.get("https://api.flysoft.tk/update/flysoftpe.json").then((xhr) => {
        version.api = JSON.parse(xhr.responseText);
        if (init == true) hub_search();
    });
}

function hub_search() {
    if (version.stop == true) return;
    com.log("Starting Version refresh...");
    if (process.env["SystemDrive"] == "X:" && fs.existsSync(process.env["SystemDrive"] + "\\FlysoftPE\\") == true) {
        pe = true;
    }
    if (fs.existsSync(root + "\\channel.fs") == false) {
        version.channel = "stable";
    } else {
        version.channel = fs.readFileSync(root + "\\channel.fs").toString();
    }
    version.dl = fs.existsSync(root + "\\FlysoftPE");
    installed = false;
    for (var i = 0; i < 36; i++) {
        var drive = String.fromCharCode(65 + i) + ":";
        if (fs.existsSync(drive + "\\FlysoftPE\\") == true && fs.existsSync(drive + "\\Flysoft.wim") == true) {
            com.log("Found USB " + drive + ".");
            installed = true;
            usb_cur = drive;
            path.fs = usb_cur + "\\FlysoftPE"
            path.pf = path.fs + "\\profile";
            path.config = path.fs + "\\config";
            path.drv = path.fs + "\\drivers";
            path.plugin = path.fs + "\\plugins";
            if (fs.existsSync(usb_cur + "\\version.fs") == false) {
                version.usb = "0.0";
            } else {
                version.usb = fs.readFileSync(usb_cur + "\\version.fs").toString();
            }
            if (packed == true) {
                if (version.sta.process == false) {
                    if (version.sta.finish == false) {
                        version.sta.process = true;
                        com.get(version.api.api.sta).then((data) => {
                            var json = JSON.parse(data);
                            if (json.code == 0) {
                                version.sta.finish = true;
                            }
                            version.sta.process = false;
                        }).catch(() => {
                            version.sta.process = false;
                        });
                    }
                }
            }
            try {
                if (version.channel == "beta") {
                    version.latestusb = version.api.pe.latest_beta == version.usb;
                } else {
                    version.latestusb = version.api.pe.latest == version.usb;
                }
            } catch (e) {
                com.warn("Version information not found. Refreshing version information...");

            }
            hub_store_event();
            break;
        }
    }
    if (installed == false) {
        com.log("USB not found.");
    }
    if (fs.existsSync(__dirname + "\\version.fs") == false) {
        version.hub = "0.0";
    } else {
        version.hub = fs.readFileSync(__dirname + "\\version.fs").toString();
    }
    if (fs.existsSync(root + "\\FlysoftPE\\version.fs") == false) {
        version.cur = "0.0";
    } else {
        version.cur = fs.readFileSync(root + "\\FlysoftPE\\version.fs").toString();
    }
    if (fs.existsSync(root + "\\info.fs") == false) {
        version.threerd = "";
    } else {
        var old3rd = version.threerd;
        version.threerd = fs.readFileSync(root + "\\info.fs").toString();
        if (version.threerd != old3rd) {
            lang.set3rd(version.threerd);
            lang.reload();
        }
    }
    hub_version_reload();
    hub_home_reload();
}

function hub_home_reload() {
    if (version.threerd != "") {
        com.selector(".sidebar_logo > div").innerText = version.threerd;
    }
    com.selector("#tab_home_icon").innerHTML = "<span class=\"fas fa-rotate\"></span>";
    if (version.latesthub == false) {
        com.selector("#tab_home_title").innerText = lang.get("hub_home_updatehub_title") + " (" + version.newhub + ")";
        com.selector("#tab_home_sub").innerText = lang.get("hub_home_updatehub_sub");
        com.selector("#tab_home_btn").innerText = lang.get("hub_home_updatehub_btn");
        com.selector("#tab_home_btn").onclick = () => {
            hub_update_hub();
        }
        return;
    }
    com.selector("#tab_home_icon").innerHTML = "<span class=\"fas fa-download\"></span>";
    if (version.dl == false && pe == false) {
        com.selector("#tab_home_title").innerText = lang.get("hub_home_no_title") + " (" + version.new + ")";
        com.selector("#tab_home_sub").innerText = lang.get("hub_home_no_sub");
        com.selector("#tab_home_btn").innerText = lang.get("hub_home_no_btn");
        com.selector("#tab_home_btn").onclick = () => {
            hub_update();
        }
        return;
    }
    if (version.latest == false && version.dl == true) {
        com.selector("#tab_home_title").innerText = lang.get("hub_home_update_title") + " (" + version.new + ")";
        com.selector("#tab_home_sub").innerText = lang.get("hub_home_update_sub");
        com.selector("#tab_home_btn").innerText = lang.get("hub_home_update_btn");
        com.selector("#tab_home_btn").onclick = () => {
            hub_update();
        }
        return;
    }
    com.selector("#tab_home_icon").innerHTML = "<span class=\"fas fa-usb-drive\"></span>";
    if (installed == false && version.dl == true) {
        com.selector("#tab_home_title").innerText = ((version.threerd == "") ? (lang.get("hub_home_write_title")) : (lang.get("hub_home_write_title").replace("FlysoftPE", version.threerd)));
        com.selector("#tab_home_sub").innerText = lang.get("hub_home_write_sub");
        com.selector("#tab_home_btn").innerText = lang.get("hub_home_write_btn");
        com.selector("#tab_home_btn").onclick = () => {
            ipc.send("open_install");
        }
        return;
    }
    com.selector("#tab_home_icon").innerHTML = "<span class=\"fas fa-rotate\"></span>";
    if (version.latestusb == false && version.dl == true) {
        com.selector("#tab_home_title").innerText = lang.get("hub_home_updateusb_title") + " (" + version.cur + ")";
        com.selector("#tab_home_sub").innerText = lang.get("hub_home_updateusb_sub");
        com.selector("#tab_home_btn").innerText = lang.get("hub_home_updateusb_btn");
        com.selector("#tab_home_btn").onclick = () => {
            ipc.send("open_install", "usbupdate", usb_cur);
        }
        return;
    }
    com.selector("#tab_home_icon").innerHTML = "<span class=\"fas fa-fire\"></span>";
    com.selector("#tab_home_title").innerText = (lang.get("hub_home_ok_title") + ((version.threerd == "") ? (" (" + version.usb + ")") : ("")));
    com.selector("#tab_home_sub").innerText = lang.get("hub_home_ok_sub");
    com.selector("#tab_home_btn").innerText = lang.get("hub_home_ok_btn");
    com.selector("#tab_home_btn").onclick = () => {
        hub_switch("store");
    }
}

function hub_restartshell() {
    try {
        exec.execSync("taskkill.exe /f /im explorer.exe");
    } catch (e) {}
    exec.exec("explorer.exe");
}

function hub_set_wp_live(file) {
    exec.execSync("copy \"" + file + "\" \"X:\\Windows\\Web\\Wallpaper\\Windows\\img0.jpg\" /y");
    try {
        exec.execSync("del \"" + path.pf + "\\AppData\\Roaming\\Microsoft\\Windows\\Themes\\*.*\" /f /s /q");
    } catch (e) {
        exec.execSync("del \"X:\\Users\\Default\\AppData\\Roaming\\Microsoft\\Windows\\Themes\\*.*\" /f /s /q");
    }
    hub_restartshell();
}

function hub_set_wp_reload() {
    if (fs.existsSync(path.config + "\\wallpaper.jpg") == true) {
        com.selector("#tab_set_wp_img").src = path.config + "\\wallpaper.jpg?timestamp=" + com.ts();
    } else {
        com.selector("#tab_set_wp_img").src = __dirname + "\\img\\wallpaper.jpg?timestamp=" + com.ts();
    }
}

function hub_set_wp_mod() {
    var ret = remote.dialog.showOpenDialogSync(remote.getCurrentWindow(), {
        filters: [{
            name: "JPEG File",
            extensions: ["jpg", "jpeg"],
        }]
    });
    if (ret != no) {
        if (ret.length == 1) {
            exec.execSync("copy \"" + ret[0] + "\" \"" + path.config + "\\wallpaper.jpg\" /y");
            if (pe == true) {
                hub_set_wp_live(path.config + "\\wallpaper.jpg");
            }
            hub_set_wp_reload();
        }
    }
}

function hub_set_wp_export() {
    var ret = remote.dialog.showSaveDialogSync(remote.getCurrentWindow(), {
        filters: [{
            name: "JPEG File",
            extensions: ["jpg", "jpeg"],
        }]
    });
    if (ret != no) {
        if (fs.existsSync(path.config + "\\wallpaper.jpg") == true) {
            exec.execSync("copy \"" + path.config + "\\wallpaper.jpg\" \"" + ret + "\" /y");
        } else {
            fs.copyFileSync(__dirname + "\\img\\wallpaper.jpg", ret);
        }
    }
}

function hub_set_app_taskbar_remove() {
    try {
        exec.execSync("del \"" + path.config + "\\openshell.reg\"");
    } catch (e) {}
}

function hub_set_app_taskbar_edit() {
    if (pe == false) {
        pop.open(lang.get("com_onlype"), [lang.get("com_ok")], () => {
            pop.close();
        });
        return;
    }
    exec.exec("\"X:\\Program Files\\OpenShell\\StartMenu.exe\" -settings");
}

function hub_set_app_reload() {
    var config;
    if (fs.existsSync(path.config + "\\cmode.bin") == true) {
        config = fs.readFileSync(path.config + "\\cmode.bin").toString();
    }
    if (config == "light") {
        com.selector("#hub_set_app_cmode_light").checked = true;
    } else if (config == "dark") {
        com.selector("#hub_set_app_cmode_dark").checked = true;
    } else {
        com.selector("#hub_set_app_cmode_theme").checked = true;
    }
}

function hub_set_app_cmode(value) {
    var path;
    path = "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize";
    exec.execSync("reg.exe add \"" + path + "\" /v \"SystemUsesLightTheme\" /t REG_DWORD /d " + value + " /f");
    exec.execSync("reg.exe add \"" + path + "\" /v \"AppsUseLightTheme\" /t REG_DWORD /d " + value + " /f");
    path = "HKCU\\Software\\OpenShell\\StartMenu\\Settings";
    exec.execSync("reg.exe add \"" + path + "\" /v \"TaskbarColor\" /t REG_DWORD /d " + ((value == "1") ? ("16777215") : ("0")) + " /f");
    exec.execSync("reg.exe add \"" + path + "\" /v \"StartButtonPath\" /t REG_SZ /d \"%SystemDrive%\\FlysoftPE\\res\\start_" + ((value == "1") ? ("light") : ("dark")) + ".png\" /f");
    hub_restartshell();
}

function hub_set_app_apply() {
    if (com.selector("#hub_set_app_cmode_theme").checked == true) {
        fs.writeFileSync(path.config + "\\cmode.bin", "default");
    } else if (com.selector("#hub_set_app_cmode_light").checked == true) {
        fs.writeFileSync(path.config + "\\cmode.bin", "light");
        if (pe == true) {
            hub_set_app_cmode("1");
        }
    } else if (com.selector("#hub_set_app_cmode_dark").checked == true) {
        fs.writeFileSync(path.config + "\\cmode.bin", "dark");
        if (pe == true) {
            hub_set_app_cmode("0");
        }
    }
    if (pe == true) {
        exec.execSync("reg.exe export \"HKCU\\Software\\OpenShell\\StartMenu\\Settings\" \"" + path.config + "\\openshell.reg\" /y");
    }
}

function hub_set_disp_show() {
    if (com.selector("#hub_set_disp_res_other").checked == true) {
        com.selector("#hub_set_disp_res_other_list").onchange = () => {
            com.selector("#hub_set_disp_res_other_title").innerText = com.selector("#hub_set_disp_res_other_list").options[com.selector("#hub_set_disp_res_other_list").selectedIndex].text;
        }
        com.selector("#hub_set_disp_res_other_select").style.display = "block";
    } else {
        com.selector("#hub_set_disp_res_other_select").style.display = "none";
    }
}

function hub_set_disp_reload() {
    var config;
    if (fs.existsSync(path.config + "\\brightness.bin") == true) {
        config = fs.readFileSync(path.config + "\\brightness.bin").toString();
    }
    com.selector("#hub_set_disp_bright_range").value = parseInt(config) * 10;
    var config_x, config_y;
    if (fs.existsSync(path.config + "\\res_width.bin") == true) {
        config_x = fs.readFileSync(path.config + "\\res_width.bin").toString();
    }
    if (fs.existsSync(path.config + "\\res_height.bin") == true) {
        config_y = fs.readFileSync(path.config + "\\res_height.bin").toString();
    }
    var opt = com.selector("#hub_set_disp_res_other_list").options;
    if (config_x != no || config_y != no) {
        com.selector("#hub_set_disp_res_other").checked = true;
        for (var i = 0; i < opt.length; i++) {
            if (opt[i].text == config_x + "x" + config_y) {
                com.selector("#hub_set_disp_res_other_list").selectedIndex = i;
                break;
            }
        }
    } else {
        com.selector("#hub_set_disp_res_def").checked = true;
    }
    hub_set_disp_show();
}

function hub_set_disp_bright(value) {
    exec.execSync("taskkill.exe" + " /f /im Brightness.exe");
    exec.exec("\"X:\\FlysoftPE\\tools\\brightness.exe\" \"" + value + "\"");
}

function hub_set_disp_res(x, y) {
    exec.exec("\"X:\\FlysoftPE\\tools\\resolution.exe\" " + x + " " + y);
}

function hub_set_disp_apply() {
    var value = Math.round(com.selector("#hub_set_disp_bright_range").value / 10).toString();
    fs.writeFileSync(path.config + "\\brightness.bin", value);
    if (pe == true) {
        hub_set_disp_bright(value);
        hub_restartshell();
    }
    if (com.selector("#hub_set_disp_res_other").checked == true) {
        var res;
        res = com.selector("#hub_set_disp_res_other_list").options[com.selector("#hub_set_disp_res_other_list").selectedIndex].text.split("x");
        if (res.length != 2) {
            return;
        }
        fs.writeFileSync(path.config + "\\res_width.bin", res[0]);
        fs.writeFileSync(path.config + "\\res_height.bin", res[1]);
        if (pe == true) {
            hub_set_disp_res(res[0], res[1]);
        }
    } else {
        if (fs.existsSync(path.config + "\\res_width.bin") == true) {
            exec.execSync("del " + path.config + "\\res_width.bin");
        }
        if (fs.existsSync(path.config + "\\res_height.bin") == true) {
            exec.execSync("del " + path.config + "\\res_height.bin");
        }
    }
}

function hub_set_sound_reload() {
    var config = "0";
    if (fs.existsSync(path.config + "\\volume.bin") == true) {
        config = fs.readFileSync(path.config + "\\volume.bin").toString();
    }
    com.selector("#hub_set_sound_vol_range").value = parseInt(config) / 65535 * 100 * 10;
}

function hub_set_sound_vol(value) {
    try {
        exec.execSync("\"X:\\FlysoftPE\\tools\\nircmd.exe\" setsysvolume " + value);
    } catch (e) {}
}

function hub_set_sound_apply() {
    var value = Math.round(com.selector("#hub_set_sound_vol_range").value / 10 / 100 * 65535).toString();
    fs.writeFileSync(path.config + "\\volume.bin", value);
    if (pe == true) {
        hub_set_sound_vol(value);
    }
}

function hub_set_env_reload() {
    var config;
    if (fs.existsSync(path.config + "\\env.bin") == true) {
        config = fs.readFileSync(path.config + "\\env.bin").toString();
    }
    if (config == "true") {
        com.selector("#hub_set_env_mode_save").checked = true;
    } else {
        com.selector("#hub_set_env_mode_nosave").checked = true;
    }
}

function hub_set_env_apply() {
    if (com.selector("#hub_set_env_mode_save").checked == true) {
        fs.writeFileSync(path.config + "\\env.bin", "true");
    } else if (com.selector("#hub_set_env_mode_nosave").checked == true) {
        fs.writeFileSync(path.config + "\\env.bin", "false");
    }
}

function hub_set_insider_reload() {
    if (version.channel == "beta") {
        com.selector("#hub_set_insider_join_join").innerText = lang.get("com_quit");
        com.selector("#hub_set_insider_join_code").style.display = "none";
    } else {
        com.selector("#hub_set_insider_join_join").innerText = lang.get("com_join");
        com.selector("#hub_set_insider_join_code").style.display = "block";
    }
}

function hub_set_insider_join() {
    if (version.channel == "beta") {
        try {
            fs.writeFileSync(root + "\\channel.fs", "stable");
            version.channel = "stable";
            hub_set_insider_reload();
            hub_version.reload();
            hub_home_reload();
        } catch (e) {}
        return;
    }
    if (com.selector("#hub_set_insider_join_code").value == "hellobetaworld") {
        try {
            fs.writeFileSync(root + "\\channel.fs", "beta");
            version.channel = "beta";
            hub_set_insider_reload();
            hub_version.reload();
            hub_home_reload();
        } catch (e) {}
    } else {
        pop.open(lang.get("hub_set_insider_err"), [lang.get("com_ok")], (id) => {
            pop.close();
        });
    }
}

function hub_version_reload() {
    try {
        if (version.threerd != "") {
            version.latest = true;
            version.latestusb = true;
            return;
        }
        if (version.cur == "Imported by user") {
            version.latest = true;
            version.latestusb = true;
            return;
        }
        if (version.channel == "beta") {
            version.new = version.api.pe.latest_beta;
            version.latest = version.api.pe.latest_beta == version.cur;
            version.links = version.api.pe.links;
        } else {
            version.new = version.api.pe.latest;
            version.latest = version.api.pe.latest == version.cur;
            version.links = version.api.pe.links;
        }
        if (packed == true) {
            version.new = version.api.hub.latest;
            version.latesthub = version.hub == version.api.hub.latest;
        }
    } catch (e) {}
}

function hub_store_event() {
    if (installed == false) return;
    if (store.list.length == 0) return;
    var list = store.list;
    store.list = [];
    var workers = [];
    var tasks = 0;
    var taskcreate = (cmd) => {
        workers.push(new Worker(__dirname + "\\js\\cmdworker.js"));
        workers[workers.length - 1].postMessage(cmd);
        tasks++;
    }
    pop.loading_open(() => {
        for (var i = 0; i < list.length; i++) {
            com.log("Adding plugin: " + list[i]);
            com.selector("#loading_text > span").innerText = list[i];
            taskcreate("xcopy.exe \"" + path.plug + "\\" + list[i] + "\\*.*\" \"" + path.plugin + "\\" + list[i] + "\\\" /y /e /c /i /h");
        }
        for (var i = 0; i < workers.length; i++) {
            workers[i].onmessage = (event) => {
                if (event.data == "taskfinish") {
                    tasks--;
                    if (tasks == 0) {
                        setTimeout(pop.loading_close, 1000);
                    }
                }
            }
        }
    }, lang.get("hub_store_adding"), lang.get("hub_store_adding"));
}

function hub_store_wait() {
    pop.loading_open(() => {}, lang.get("hub_store_waiting"), lang.get("hub_store_waiting"), [lang.get("com_cancel")], () => {
        store.list = [];
        pop.loading_close();
    });
}

function hub_store_download(element) {
    if (dl.wait == true) {
        return;
    }
    dl.wait = true;
    var url = element.dataset.url;
    var name = element.dataset.name;
    const PLUGPATH = path.plug + "\\" + name;
    const DLPATH = path.plug + "\\" + name + ".zip";
    var aria2;
    pop.loading_open(() => {
        aria2 = hub_download(url, path.plug, name + ".zip", (info) => {
            var per = Math.ceil(info.process * 100) + "%";
            var speed = Math.ceil(info.speed / 1024 / 1024) + " MB/s";
            var now = Math.ceil(info.now / 1024 / 1024) + " MB";
            var all = Math.ceil(info.all / 1024 / 1024) + " MB";
            com.selector("#loading_text > span").innerText = name + "  " + per + "  " + speed + "  " + now + "/" + all;
        }, () => {
            com.selector("#loading_text > span").innerText = "";
            exec.exec("\"" + dirname + "\\data\\7z.exe\" x \"" + DLPATH + "\" \"-o" + path.plug + "\" -y", () => {
                exec.execSync("del \"" + DLPATH + "\" /f /s /q");
                store.list.push(name);
                hub_store_wait();
                dl.wait = false;
                element.innerText = lang.get("hub_store_success");
                element.classList.remove("button_no");
            });
        });
    }, lang.get("hub_store_downloading"), lang.get("hub_store_downloading"), [lang.get("com_cancel")], () => {
        hub_download_stop(aria2);
        pop.loading_close();
        dl.wait = false;
    });
}

function hub_store_push(ele) {
    var file = ele.dataset.file;
    store.list.push(file);
    hub_store_wait();
}

function hub_store_explore(ele) {
    var file = ele.dataset.file;
    try {
        exec.exec("explorer.exe \"" + file + "\"");
    } catch (e) {}
}

function hub_store_remove(ele) {
    var file = ele.dataset.file;
    if (fs.existsSync(file) == true) {
        pop.loading_open(() => {
            try {
                exec.execSync("rd /s /q \"" + file + "\"");
            } catch (e) {}
            hub_store_switch(store.tab_cur);
            pop.close();
        }, lang.get("hub_store_remove"), lang.get("hub_store_remove"));
    }
}

function hub_store_switch(id) {
    store.tab_cur = id;
    if (fs.existsSync(path.plug) == false) {
        fs.mkdirSync(path.plug);
    }
    var html = "";
    var showempty = (html, msg) => {
        if (html == "") {
            com.selector("#tab_store_empty").style.display = null;
            if (msg == no) msg = lang.get("hub_store_empty");
            com.selector("#tab_store_empty > .title").innerText = msg;
        } else {
            com.selector("#tab_store_empty").style.display = "none";
        }
    }
    if (store.tab_cur == 1) {
        com.selector("#tab_store_list").style.pointerEvents = "none";
        com.selector("#tab_store_list").style.opacity = "0";
        showempty("", lang.get("hub_store_reqing"));
        com.log("Fetching index...");
        var index;
        try {
            com.get(version.api.api.plugins).then((xhr) => {
                com.log("Fetched index: " + xhr.responseText);
                index = JSON.parse(xhr.responseText);
                index.sort((a, b) => {
                    if (a.FileName < b.FileName) return -1;
                    if (a.FileName > b.FileName) return 1;
                });
                for (var i = 0; i < index.length; i++) {
                    const element = index[i];
                    var info = element.FileName.substring(0, element.FileName.indexOf(".")).split("_");
                    if (info.length != 2) continue;
                    var text;
                    if (fs.existsSync(path.plug + "\\" + element.FileName) == true) {
                        text = lang.get("com_update");
                    } else {
                        text = lang.get("com_add");
                    }
                    var temp1 = element.UpdateAt.split("+");
                    var temp2 = temp1[0].split("T");
                    var time = temp2[0] + " " + temp2[1];
                    html = html + "<li><div class=\"card\"><div class=\"card_title\">" + info[0] + "</div><div class=\"card_body\"><div class=\"content\">" + lang.get("hub_store_author") + info[1] + "</div><div class=\"content\">" + lang.get("hub_store_time") + time + "</div><div class=\"card_btn\"><div class=\"button button_no\" data-url=\"" + element.Url + "\" data-name=\"" + element.FileName.substring(0, element.FileName.indexOf(".")) + "\" onclick=\"hub_store_download(this)\">" + text + "</div></div></div></div></li>";
                }
                com.selector("#tab_store_list").innerHTML = html;
                com.selector("#tab_store_list").style.pointerEvents = null;
                com.selector("#tab_store_list").style.opacity = null;
                showempty(html);
            }).catch(() => {
                com.err("Failed to fetch.");
                showempty("", lang.get("hub_store_reqerr"));
            });
        } catch (e) {
            com.err("Failed to fetch.");
            showempty("", lang.get("hub_store_reqerr"));
        }
    } else if (store.tab_cur == 2 || store.tab_cur == 3) {
        var islib = store.tab_cur == 2;
        if (islib == false) {
            if (installed == false) {
                hub_showinsert();
                return;
            }
        }
        com.selector("#tab_store_list").style.pointerEvents = "none";
        com.selector("#tab_store_list").style.opacity = "0";
        showempty("", lang.get("hub_store_reqing"));
        var root = (islib) ? (path.plug) : (path.plugin);
        var plugins = fs.readdirSync(root);
        plugins.sort();
        for (var i = 0; i < plugins.length; i++) {
            var info = plugins[i].split("_");
            if (info.length != 2) continue;
            if (fs.statSync(root + "\\" + plugins[i]).isDirectory() == false) continue;
            if (fs.existsSync(root + "\\" + plugins[i] + "\\package.cmd") == true && fs.existsSync(root + "\\" + plugins[i] + "\\continue_dl.fstatus") == true) continue;
            var date = fs.statSync(root + "\\" + plugins[i]).mtime;
            html = html + "<li><div class=\"card\"><div class=\"card_title\">" + info[0] + "</div><div class=\"card_body\"><div class=\"content\">" + lang.get("hub_store_author") + info[1] + "</div><div class=\"content\">" + lang.get("hub_store_time") + com.date(date) + "</div><div class=\"card_btn\">" + ((islib) ? "<div class=\"button button_no\" data-file=\"" + plugins[i] + "\" onclick=\"hub_store_push(this)\">" + lang.get("com_add") + "</div>" : "") + "<div class=\"button button_no\" data-file=\"" + root + "\\" + plugins[i] + "\" onclick=\"hub_store_explore(this)\">" + lang.get("com_explore") + "</div><div class=\"button button_no\" data-file=\"" + root + "\\" + plugins[i] + "\" onclick=\"hub_store_remove(this)\">" + lang.get("com_remove") + "</div></div></div></div></li>";
        }
        com.selector("#tab_store_list").innerHTML = html;
        com.selector("#tab_store_list").style.pointerEvents = null;
        com.selector("#tab_store_list").style.opacity = null;
        showempty(html);
    }
    for (var i = 1; i <= 3; i++) {
        com.selector("#tab_store_btn" + i).classList.add("button_no");
        if (i == id) {
            com.selector("#tab_store_btn" + i).classList.remove("button_no");
        }
    }
}

function hub_store_reload() {
    hub_store_switch(1);
}

function hub_drv_reload() {
    com.log("Scanning drivers...");
    var drvstore = process.env["SystemRoot"] + "\\System32\\DriverStore\\FileRepository";
    if (pe == true) {
        drvstore = path.drv;
    }
    var drv = fs.readdirSync(drvstore);
    com.selector("#tab_drivers_locate").innerHTML = "<li>" + lang.get("com_loading") + "</li>";
    var count = 0;
    for (var i = 0; i < drv.length; i++) {
        if (fs.statSync(drvstore + "\\" + drv[i]).isDirectory() == false) {
            continue;
        }
        com.log("Driver folder " + drv[i] + ".");
        var drvfiles = fs.readdirSync(drvstore + "\\" + drv[i]);
        var drvfile;
        var drvfilename;
        var drvdir = drvstore + "\\" + drv[i];
        var drvdirname = drv[i];
        for (var j = 0; j < drvfiles.length; j++) {
            if (fspath.extname(drvstore + "\\" + drv[i] + "\\" + drvfiles[j]) == ".inf") {
                com.log("Found driver " + drvfiles[j] + "!");
                drvfile = drvstore + "\\" + drv[i] + "\\" + drvfiles[j];
                drvfilename = drvfiles[j];
                break;
            }
        }
        if (drvfile == no) {
            continue;
        }
        if (drvfilename.search("c_") != -1) {
            continue;
        }
        count++;
        if (count == 1) {
            com.selector("#tab_drivers_locate").innerHTML = "";
        }
        var group = com.create("li");
        var label = com.create("label");
        var raw = fs.readFileSync(drvfile);
        var inf;
        var parsed;
        inf = raw.toString("utf8");
        parsed = ini.parse(inf);
        if (parsed["Version"] == no) {
            inf = raw.toString("utf16le");
            parsed = ini.parse(inf);
            com.log("UTF16LE");
        } else {
            com.log("UTF8");
        }
        var brand;
        var device;
        if (inf.search("AMD") != -1 || inf.search("Advanced Micro Devices") != -1) {
            brand = lang.get("hub_drivers_part_amd");
        } else if (inf.search("NVIDIA") != -1) {
            brand = lang.get("hub_drivers_part_nvidia");
        } else if (inf.search("Intel") != -1) {
            brand = lang.get("hub_drivers_part_intel");
        } else if (inf.search("3dfx") != -1) {
            brand = lang.get("hub_drivers_part_3dfx");
        } else if (inf.search("ATI") != -1) {
            brand = lang.get("hub_drivers_part_ati");
        } else if (inf.search("Huawei") != -1) {
            brand = lang.get("hub_drivers_part_hw");
        } else if (inf.search("Qualcomm") != -1) {
            brand = lang.get("hub_drivers_part_qualcomm");
        } else if (inf.search("Google") != -1) {
            brand = lang.get("hub_drivers_part_google");
        } else if (inf.search("Apple Inc") != -1) {
            brand = lang.get("hub_drivers_part_apple");
        } else if (inf.search("Microsoft") != -1) {
            brand = lang.get("hub_drivers_part_ms");
        } else if (inf.search("LSI") != -1) {
            brand = lang.get("hub_drivers_part_lsi");
        } else if (inf.search("HP Inc") != -1) {
            brand = lang.get("hub_drivers_part_hp");
        } else {
            brand = "";
        }
        if (parsed["Version"] == no || parsed["Version"]["Class"] == no) {
            device = "";
        } else {
            device = lang.get("hub_drivers_type_" + parsed["Version"]["Class"].toLocaleLowerCase());
        }
        if (lang.cur() == "zh-cn") {
            group.innerText = drvfilename + "   " + brand + "   " + device + lang.get("hub_drivers_device");
        } else {
            group.innerText = drvfilename + "   " + brand + "   " + device + "   " + lang.get("hub_drivers_device");
        }
        group.dataset.drv = drvdir;
        group.dataset.drvname = drvdirname;
        group.onclick = (event) => {
            var target = event.target || event.srcElement;
            com.log("Source " + target.dataset.drv + ".");
            if (pe == true) {
                pop.open(lang.get("hub_drivers_removefromfspe"), [lang.get("com_remove"), lang.get("com_cancel")], (id) => {
                    if (id.dataset.id == "0") {
                        exec.execSync("rd \"" + target.dataset.drv + "\" /s /q");
                        hub_drv_reload();
                    }
                    pop.close();
                });
                return;
            }
            pop.open(lang.get("hub_drivers_addtofspe"), [lang.get("com_add"), lang.get("com_cancel")], (id) => {
                if (id.dataset.id == "0") {
                    exec.execSync("xcopy \"" + target.dataset.drv + "\\*.*\" \"" + path.drv + "\\" + target.dataset.drvname + "\\\" /y /e /c");
                }
                pop.close();
            });
        }
        com.selector("#tab_drivers_locate").appendChild(group);
    }
    if (count == 0) {
        com.selector("#tab_drivers_locate > li").innerText = lang.get("com_empty");
    }
}

function hub_update() {
    if (version.mirror == no) {
        var list = [];
        var listid = [];
        for (var i in version.links[lang.cur()]) {
            const element = version.links[lang.cur()][i];
            list.push(element.name);
            listid.push(i);
        }
        list.push(lang.get("com_import"));
        list.push(lang.get("com_cancel"));
        pop.open(lang.get("hub_update_mirror"), list, (id) => {
            if (parseInt(id.dataset.id) == list.length - 1) {
                pop.close();
                return;
            }
            if (parseInt(id.dataset.id) == list.length - 2) {
                ipc.send("open_import")
                pop.close();
                return;
            }
            version.mirror = listid[parseInt(id.dataset.id)];
            pop.close();
            hub_update();
        });
        return;
    }
    hub_switch("update");
    no_sidebar = true;
    setTimeout(function () {
        var link;
        if (version.channel == "beta") {
            link = version.links[lang.cur()][version.mirror]["link_beta"];
        } else {
            link = version.links[lang.cur()][version.mirror]["link"];
        }
        hub_download(link, dirname, "FlysoftPE.iso", (info) => {
            hub_update_handler(info);
        }, () => {
            com.selector("#tab_update_info").innerText = lang.get("hub_update_extract");
            exec.exec("\"" + dirname + "\\data\\7z.exe\" x \"" + dirname + "\\FlysoftPE.iso" + "\" \"-o" + root + "\\FlysoftPE\" -y", () => {
                exec.execSync("del \"" + dirname + "\\FlysoftPE.iso\" /f /s /q");
                version.dl = true;
                version.latest = true;
                version.mirror = no;
                no_sidebar = false;
                fs.writeFileSync(root + "\\FlysoftPE\\version.fs", version.new);
                version.cur = version.new;
                hub_version_reload();
                hub_switch("home");
                hub_home_reload();
            });
        });
    }, 0);
}

function hub_update_hub() {
    version.stop = true;
    hub_switch("update");
    no_sidebar = true;
    var link = version.api.hub.link;
    hub_download(link, root + "\\resources", "app_update.asar", (info) => {
        hub_update_handler(info);
    }, () => {
        exec.spawn(root + "\\update.cmd", [], {
            detached: true
        });
        app.exit();
    });
}

function hub_update_handler(info) {
    var per = Math.ceil(info.process * 100) + "%";
    var speed = Math.ceil(info.speed / 1024 / 1024) + " MB/s";
    var now = Math.ceil(info.now / 1024 / 1024) + " MB";
    var all = Math.ceil(info.all / 1024 / 1024) + " MB";
    com.selector("#tab_update_progress > div").style.width = per;
    com.selector("#tab_update_info").innerText = per + "  " + speed + "  " + now + "/" + all;
}

function hub_writecheck() {
    if (no_sidebar == false) {
        if (version.dl == true) {
            ipc.send("open_install");
        } else {
            hub_update();
        }
    }
}

function hub_showinsert() {
    pop.open(lang.get("hub_notinstalled"), [lang.get("com_ok")], (id) => {
        pop.close();
    });
}

function hub_store_url() {
    return version.api.api.plugins;
}

function hub_download(url, dir, name, cbprogress, cbcomplete) {
    var aria2 = exec.spawn(dirname + "\\data\\aria2c_hub.exe", ["--dir=" + dir, "--out=" + name, "--timeout=20", "--enable-color=false", "--human-readable=false", "--allow-overwrite=true", "--split=64", url]);
    aria2.stdout.on("data", (data) => {
        var center = (str, key1, key2) => {
            var regexp = str.match(new RegExp(key1 + "(.*?)" + key2));
            return regexp ? regexp[1] : no;
        }
        var lines = data.toString().split("\n");
        for (var i = 0; i < lines.length; i++) {
            var str = lines[i];
            var info = {
                alloc: false,
                now: 0,
                all: 0,
                process: 0,
                speed: 0,
            }
            if (str.indexOf("DL") == -1) {
                return;
            }
            if (str.indexOf("FileAlloc") != -1) {
                info.alloc = true;
                return;
            };
            str = center(str, "\\[", "\\]");
            com.log("Download: " + str);
            var part = str.split(" ");
            if (part.length < 4) {
                return;
            }
            var dlpart = part[1].split("/");
            info.now = parseInt(dlpart[0].substring(0, dlpart[0].indexOf("B")));
            info.all = parseInt(dlpart[1].substring(0, dlpart[1].indexOf("B")));
            info.process = ((info.all == 0) ? 0 : (info.now / info.all));
            var sppart = part[3];
            info.speed = parseInt(sppart.substring("DL:".length, sppart.indexOf("B")));
            cbprogress(info);
        }
    });
    aria2.on("exit", (code) => {
        if (code != 0) return;
        cbcomplete();
    });
}

function hub_download_stop() {
    exec.execSync("taskkill.exe /f /im aria2c_hub.exe");
}

function hub_switch(tab) {
    if (no_sidebar == true) {
        return;
    }
    if (tab == "store") {
        hub_store_reload();
    }
    if (tab == "settings") {
        if (installed == false) {
            hub_showinsert();
            return;
        }
        hub_set_wp_reload();
        hub_set_app_reload();
        hub_set_disp_reload();
        hub_set_sound_reload();
        hub_set_env_reload();
        hub_set_insider_reload();
    }
    if (tab == "drivers") {
        if (installed == false) {
            hub_showinsert();
            return;
        }
        if (drv_loaded == false) {
            drv_loaded = true;
            setTimeout(hub_drv_reload, 200);
        }
    }
    var ele = com.selector(".sidebar_menu_li", true);
    tab_cur = tab;
    for (var i = 0; i < ele.length; i++) {
        if (ele[i].dataset.id == tab) {
            com.selector("#tab_" + ele[i].dataset.id).style.display = "block";
            ele[i].classList.add("sidebar_menu_li_selected");
        } else {
            com.selector("#tab_" + ele[i].dataset.id).style.display = "none";
            ele[i].classList.remove("sidebar_menu_li_selected");
        }
    }
}