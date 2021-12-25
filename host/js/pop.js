var _callback_btn;
var _callback_fin;
var _svg = "<svg version=\"1.1\" role=\"presentation\" viewBox=\"0 0 100 100\" style=\"width: 50px;height: 50px;\"><circle cx=\"50\" cy=\"50\" r=\"20\" stroke=\"#000000\" stroke-width=\"4\" stroke-linecap=\"round\" fill=\"none\"><animateTransform attributeName=\"transform\" type=\"rotate\" repeatCount=\"indefinite\" dur=\"1.5s\" values=\"0 50 50;180 50 50;720 50 50\" keyTimes=\"0;0.5;1\"></animateTransform><animate attributeName=\"stroke-dasharray\" repeatCount=\"indefinite\" dur=\"1.5s\" values=\"18.84955592153876 169.64600329384882;94.2477796076938 94.24777960769377;18.84955592153876 169.64600329384882\" keyTimes=\"0;0.5;1\"></animate></circle></svg>";

function runcb(element) {
    callback(element.dataset.id);
}

function open(msg, buttons, cb, ishtml = false, title = "", finish = undefined) {
    if (title == "") {
        com.selector("#pop_title").innerText = lang.get("com_tips");
    } else {
        com.selector("#pop_title").innerText = title;
    }
    com.selector("#pop_button").innerHTML = null;
    if (ishtml == true) {
        com.selector("#pop_content").innerHTML = msg;
    } else {
        com.selector("#pop_content").innerText = msg;
    }
    _callback_btn = cb;
    _callback_fin = finish;
    for (var i = 0; i < buttons.length; i++) {
        var button = document.createElement("div");
        button.dataset.id = i;
        button.innerText = buttons[i];
        button.classList.add("button");
        if (i != buttons.length - 1) {
            button.classList.add("button_no");
        }
        button.addEventListener("click", function () {
            _callback_btn(this);
        });
        com.selector("#pop_button").appendChild(button);
    }
    com.selector("#mask").style.display = "block";
    com.selector("#popwin").style.display = "block";
    setTimeout(function () {
        com.selector("#mask").style.opacity = "1";
        com.selector("#popwin").style.opacity = "1";
        setTimeout(() => {
            if (_callback_fin != undefined) {
                _callback_fin();
            }
        }, 200);
    }, 200);
}

function close() {
    com.selector("#mask").style.opacity = null;
    com.selector("#popwin").style.opacity = null;
    setTimeout(() => {
        com.selector("#mask").style.display = null;
        com.selector("#popwin").style.display = null;
    }, 200);
}

function loading_open(callback, text = lang.get("com_loading_wait"), title = lang.get("com_loading_title"), btn = [], cb = () => {}) {
    open("<div style=\"display:flex;align-items: center;\" id=\"loading_text\">" + _svg + "<span>" + text + "</span></div>", btn, cb, true, title, callback);
}

function loading_close() {
    close();
}
module.exports = {
    open: open,
    close: close,
    loading_open: loading_open,
    loading_close: loading_close
}