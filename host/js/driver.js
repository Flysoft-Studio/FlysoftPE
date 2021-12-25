const ini = require("ini");
const fs = require("fs");
var drv_root = process.env["SystemRoot"] + "\\System32\\DriverStore\\FileRepository"
var drv_files = fs.readdirSync(drv_root);
var drv_list = [];
for (var i = 0; i < drv_files.length; i++) {
    var part = drv_files[i].split("_");
    if (part.length != 3) {
        continue;
    }
    var files = fs.readdirSync(drv_root + "\\" + drv_files[i] + "\\");
    var file;
    for (var j = 0; j < files.length; j++) {
        if (files[j].indexOf(".inf") != -1 || files[j].indexOf(".INF") != -1) {
            file = drv_root + "\\" + drv_files[i] + "\\" + files[j];
        }
    }
    if (file == undefined) {
        continue;
    }
    var content = fs.readFileSync(file);
    var info = ini.parse(content.toString());
    if (info["Version"] == undefined) {
        content = content.toString("utf16le");
        var info = ini.parse(content.toString());
    }
    if (info["Version"] != undefined) {
        if (info["Version"].Class != undefined) {
            if (info["Version"].Class.toLocaleUpperCase() == "Display".toLocaleUpperCase()) {
                if (content.indexOf("Copyright (c) NVIDIA") != -1) {
                    drv_list.push({
                        brand: "NVIDIA",
                        file: file,
                        directory: drv_root + "\\" + drv_files[i]
                    });
                } else if (content.indexOf("Copyright(C) AMD") != -1) {
                    drv_list.push({
                        brand: "AMD",
                        file: file,
                        directory: drv_root + "\\" + drv_files[i]
                    });
                } else if (content.indexOf("Copyright (c) Intel") != -1) {
                    drv_list.push({
                        brand: "Intel",
                        file: file,
                        directory: drv_root + "\\" + drv_files[i]
                    });
                } else {
                    drv_list.push({
                        brand: "Unknown",
                        file: file,
                        directory: drv_root + "\\" + drv_files[i]
                    });
                }
            }
        }
    }

}
console.log(drv_list);