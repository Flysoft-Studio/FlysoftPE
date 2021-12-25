const LATEST_STABLE = "5.1";
const LATEST_BETA = "5.1";
const LATEST_HUB = "6.2";
const LATEST_HUBLINK = "https://hiflysoft-my.sharepoint.com/:u:/g/personal/flysoft_hiflysoft_onmicrosoft_com/EeKlcpwp4w5PrBZQe4oXKL0BNi0MEx0o-zGwBQBB8RmmIg?download=1";
const EGG_LINK = "https://hiflysoft-my.sharepoint.com/:v:/g/personal/flysoft_hiflysoft_onmicrosoft_com/EfLhgA-Y3I1HniQvO7hw3_wBkVVxwowtfyuLN0JRjdkt5A?download=1";
const API_PLUG = "http://flyindex.gzs.vin/api/list/1";
const API_STA = "http://flystatistics.gzs.vin/api/?op=add&key=flysoftkey&item=flysoftpe";
const LATEST_LINKS = {
    "zh-cn": {
        "wbp": {
            "name": "阿里云盘 (推荐)",
            "link": "http://aliyun.imiliy.cn/%E8%BD%AF%E4%BB%B6/FlysoftPE.iso",
            "link_beta": "http://aliyun.imiliy.cn/%E8%BD%AF%E4%BB%B6/FlysoftPE.iso"
        },
        "gz1": {
            "name": "鸽子FB1 (世纪互联, 推荐)",
            "link": "https://www.crabapi.cn/api/v5/flysoftpe/dl.php?source=onedrive&channel=stable",
            "link_beta": "https://www.crabapi.cn/api/v5/flysoftpe/dl.php?source=onedrive&channel=beta",
        },
        "gz2": {
            "name": "鸽子FB2 (Cloudflare)",
            "link": "https://api.gzs.vin/api/flysoftpe/getDL/FlysoftPE.iso",
            "link_beta": "https://api.gzs.vin/api/flysoftpe/getDL/FlysoftPE.iso",
        },
        "liteqwq": {
            "name": "LiteQwQ (B站UID:389874232, 未更新)",
            "link": "https://liteqwq.top/FlysoftPE/FlysoftPE.iso",
            "link_beta": "https://liteqwq.top/FlysoftPE/FlysoftPE.iso",
        },
        "moecloud": {
            "name": "萌云 (世纪互联, 推荐, 未更新)",
            "link": "https://moecloud.cn/api/v3/source/8Q6TZSeX8Q9TpF3dgNa0x0f0-fkd65KbOhdsGtc9M40=:0/587396/FlysoftPE_5.0Stable.iso",
            "link_beta": "https://moecloud.cn/api/v3/source/8Q6TZSeX8Q9TpF3dgNa0x0f0-fkd65KbOhdsGtc9M40=:0/587396/FlysoftPE_5.0Stable.iso",
        },
        "andi": {
            "name": "安迪云盘 (未更新)",
            "link": "https://pan.adycloud.com/api/v3/file/source/6380/FlysoftPE_5.0Stable.iso?sign=INgeED3wD_eOCeiJYoV6Gr9A2er7oSS9aoK3PEhVF44%3D%3A0",
            "link_beta": "https://pan.adycloud.com/api/v3/file/source/6380/FlysoftPE_5.0Stable.iso?sign=INgeED3wD_eOCeiJYoV6Gr9A2er7oSS9aoK3PEhVF44%3D%3A0"
        },
        "quack": {
            "name": "香港节点 (未更新)",
            "link": "https://quackcloud.xyz/下载/PEISO/FlysoftPE/FlysoftPE.iso",
            "link_beta": "https://quackcloud.xyz/下载/PEISO/FlysoftPE/FlysoftPE.iso"
        },
        "up": {
            "name": "官方 (又拍云, 不可用)",
            "link": "https://www.crabapi.cn/api/v5/flysoftpe/dl.php?source=upyun&channel=stable",
            "link_beta": "https://www.crabapi.cn/api/v5/flysoftpe/dl.php?source=upyun&channel=beta",
        },
        "flysoft": {
            "name": "官方源 (OneDrive)",
            "link": "https://hiflysoft-my.sharepoint.com/:u:/g/personal/flysoft_hiflysoft_onmicrosoft_com/EYdkYCootDlKlvG-HyGqmM4BruhDK5OlXSs2x2_SCmhQQQ?download=1",
            "link_beta": "https://hiflysoft-my.sharepoint.com/:u:/g/personal/flysoft_hiflysoft_onmicrosoft_com/EYdkYCootDlKlvG-HyGqmM4BruhDK5OlXSs2x2_SCmhQQQ?download=1",
        },
    },
    "en-us": {
        "flysoft": {
            "name": "Official Source (OneDrive)",
            "link": "https://hiflysoft-my.sharepoint.com/:u:/g/personal/flysoft_hiflysoft_onmicrosoft_com/EYdkYCootDlKlvG-HyGqmM4BruhDK5OlXSs2x2_SCmhQQQ?download=1",
            "link_beta": "https://hiflysoft-my.sharepoint.com/:u:/g/personal/flysoft_hiflysoft_onmicrosoft_com/EYdkYCootDlKlvG-HyGqmM4BruhDK5OlXSs2x2_SCmhQQQ?download=1",
        },
    },
};