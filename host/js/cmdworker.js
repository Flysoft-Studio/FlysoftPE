var exec = require("child_process");
onmessage = (event) => {
    try {
        exec.execSync(event.data);
    } catch (e) {}
    postMessage("taskfinish");
}