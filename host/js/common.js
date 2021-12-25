process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true;
const args = ipc.sendSync("get_args");
const path_var = process.env["SystemDrive"] + "\\FlysoftPE\\var"
var _config = {};
var _config_file;

function log(msg) {
    console.log("[INFO] " + msg);
}

function err(msg) {
    console.log("[ERR] " + msg);
}

function warn(msg) {
    console.log("[WARN] " + msg);
}

function selector(key, all = false) {
    return (all == false) ? (document.querySelector(key)) : (document.querySelectorAll(key));
}

function create(tag) {
    var key = document.createElement(tag);
    return key;
}

function init(func) {
    window.addEventListener("load", function () {
        func();
    });
}

function exit() {
    conf_save();
    ipc.send("close");
}

function conf_read(key, back) {
    return (_config[key] == undefined) ? (back) : (_config[key]);
}

function conf_write(key, value) {
    _config[key] = value;
}

function conf_save() {
    fs.writeFileSync(_config_file, JSON.stringify(_config));
}

function conf_reload() {
    _config_file = app.getPath("userData") + "\\Config";
    if (fs.existsSync(_config_file) == true) {
        _config = JSON.parse(fs.readFileSync(_config_file));
    } else {
        _config = {};
        try {
            fs.writeFileSync(_config_file, JSON.stringify(_config));
        } catch (e) {}
    }
}

function getvar(variable) {
    if (fs.existsSync(path_var + "\\" + variable + ".bin")) {
        return fs.readFileSync(path_var + "\\" + variable + ".bin").toString().replace(/[\r\n]/g, "");
    } else {
        return undefined;
    }
}

function ts() {
    return new Date().getTime();
}

function get(url, header, method = "GET", body) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        if (header != undefined) {
            for (var i = 0; i < header.length; i++) {
                xhr.setRequestHeader(header[i].name, header[i].value);
            }
        }
        xhr.send(body);
        xhr.onload = () => {
            resolve(xhr);
        }
        xhr.onerror = () => {
            reject(xhr);
        }
    });
}

function date(date) {
    var zero = (str) => {
        return ("00" + str).substring(("00" + str).length - 2);
    }
    return date.getUTCFullYear() + "-" + zero(date.getUTCMonth()) + "-" + zero(date.getUTCDate()) + " " + zero(date.getUTCHours()) + ":" + zero(date.getUTCMinutes()) + ":" + zero(date.getUTCSeconds());
}
init(function () {
    conf_reload();
});
module.exports = {
    getvar: getvar,
    ts: ts,
    log: log,
    err: err,
    warn: warn,
    selector: selector,
    create: create,
    init: init,
    exit: exit,
    conf_reload: conf_reload,
    conf_save: conf_save,
    conf_write: conf_write,
    conf_read: conf_read,
    get: get,
    date: date,
    args: args,
};