com.init(() => {
    com.warn("你被 RickRoll 了！ You are rickrolled!");
    try {
        com.get("https://api.flysoft.tk/update/flysoftpe.json").then((data) => {
            var api = JSON.parse(data.responseText);
            com.selector("video").src = api.api.egg;
            com.selector("video").play();
        });
    } catch (e) {
        com.err("RickRoll failed. Say goodbye!");
        setTimeout(() => {
            remote.getCurrentWindow().destroy();
        }, 2000);
    }
});