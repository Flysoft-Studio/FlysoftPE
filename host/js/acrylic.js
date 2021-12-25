var scx = screen.availWidth;
var scy = screen.availHeight;

com.init(() => {
    var raw = fs.readFileSync(process.env["AppData"] + "\\Microsoft\\Windows\\Themes\\TranscodedWallpaper");
    com.selector("#bg").style.backgroundImage = "url(data:image/jpg;base64," + raw.toString("base64") + ")";
    ipc.on("get_pos", win_update);
    win_update();
});

function win_update() {
    com.selector("#bg").style.width = scx + "px";
    com.selector("#bg").style.height = scy + "px";
    var size = remote.getCurrentWindow().getPosition();
    com.selector("#bg").style.left = -size[0] + "px";
    com.selector("#bg").style.top = -size[1] + "px";
}