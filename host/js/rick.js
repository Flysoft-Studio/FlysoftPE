com.init(() => {
    com.warn("你被 RickRoll 了！ You are rickrolled!");
    try {
        com.selector("video").src = EGG_LINK;
        com.selector("video").play();
    } catch (e) {
        com.err("RickRoll failed. Say goodbye!");
        setTimeout(() => {
            remote.getCurrentWindow().destroy();
        }, 2000);
    }
});