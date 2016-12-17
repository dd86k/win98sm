"use strict";

/**
 * win98dwm.js, Forms, Window Manager, and the Start Menu.
 * @author dd86k
 */

var WindowZIndex = 0, activeForm = null;

/**
 * Window Manager.
 */

var WindowManager = {
    showError: function (title, msg) {
        var f = new Form(title);
        WindowManager.makeMsgBox(f, msg, 16);
        f.show();
    },

    showQuestion: function (title, msg) {
        var f = new Form(title);
        WindowManager.makeMsgBox(f, msg, 32);
        f.show();
    },

    showWarning: function (title, msg) {
        var f = new Form(title);
        WindowManager.makeMsgBox(f, msg, 48);
        f.show();
    },

    showInfo: function (title, msg) {
        var f = new Form(title);
        WindowManager.makeMsgBox(f, msg, 64);
        f.show();
    },

    /**
     * Makes the msgbox, internal use only.
     * @param {Object} f Form, passed by reference.
     * @param {string} msg Message.
     * @param {number} type MsgBox Type.
     */
    makeMsgBox: function (f, msg, type) {
        f.removeMinAndMaxButtons();
        f.removeIcon();
        f.setLocation(200, 100);
        var divmsg = document.createElement("p");
        divmsg.className = "msgboxMsg";

        var divmsgtext = document.createTextNode(msg);
        divmsg.appendChild(divmsgtext);

        var divmsgicon = document.createElement("img");
        divmsgicon.className = "msgboxIcon";

        switch (type) {
            case 16:
                divmsgicon.src = "images/msgbox/critical.png";
                break;
            case 32:
                divmsgicon.src = "images/msgbox/question.png";
                break;
            case 48:
                divmsgicon.src = "images/msgbox/exclamation.png";
                break;
            case 64:
                divmsgicon.src = "images/msgbox/info.png";
                break;
        }

        var btnOk = new Button("OK").node;
        btnOk.tabIndex = 25;
        btnOk.addEventListener("click", function () {
            f.close();
        });

        var divcont = document.createElement("div");
        divcont.style.margin = "12px 0 8px 0";
        divcont.style.width = "100%";
        divcont.style.textAlign = "center";

        divcont.appendChild(btnOk);

        f.addNode(divmsgicon);
        f.addNode(divmsg);
        f.addNode(divcont);
    },

    addTaskbarButton: function (form) {
        var c = maintoolbar.rows[0].insertCell(-1);
        c.className = "tb-focus";
        c.onmousedown = function (e) {
            c.className = "tb-down";
        }
        c.onclick = function (e) {
            Startmenu.hide();
            form.focus();
        }

        var icon = document.createElement("img");
        icon.src = form.getIcon();

        var text = document.createElement("span");
        text.innerText = form.getTitle();

        c.appendChild(icon);
        c.appendChild(text);

        form.taskbarButtonObj = c;
    },

    unfocusActiveWindow: function () {
        if (activeForm != null) {
            activeForm.unfocus();
        }
    },

    // Mofified function from niente00, StackOverflow
    Drag: {
        move: function (node, x, y) {
            node.style.left = x + 'px';
            node.style.top = y + 'px';
        },

        start: function (node, container, e) {
            var posX = e.clientX, posY = e.clientY,
                divTop = node.style.top, divLeft = node.style.left,
                eWi = parseInt(node.style.width),
                eHe = parseInt(node.style.height),
                cWi = parseInt(container.style.width),
                cHe = parseInt(container.style.height);
            divTop = divTop.replace('px', '');
            divLeft = divLeft.replace('px', '');
            var diffX = posX - divLeft, diffY = posY - divTop;
            document.onmousemove = function (e) {
                var posX = e.clientX, posY = e.clientY,
                    aX = posX - diffX, aY = posY - diffY;
                /*if (aX < 0) aX = 0;
                if (aY < 0) aY = 0;
                if (aX + eWi > cWi) aX = cWi - eWi;
                if (aY + eHe > cHe) aY = cHe - eHe;*/
                WindowManager.Drag.move(node, aX, aY);
            };
        },

        stop: function () { document.onmousemove = null; }
    },

    Systray: {

    }
};

/**
 * Start menu.
 */

var Startmenu = {
    visible: false, // Faster than checking with DOM

    show: function () {
        if (Startmenu.visible) {
            win98menu.style.display = "none";
            startbutton.src = 'images/startmenu/off.png';
            Startmenu.visible = false;
        } else {
            win98menu.style.display = "block";;
            startbutton.src = 'images/startmenu/on.png';
            Startmenu.visible = true;
        }
    },

    hide: function () {
        win98menu.style.display = "none";
        startbutton.src = 'images/startmenu/off.png';
        Startmenu.visible = false;
    }
}

/*
 * Events
 */

startbutton.onmousedown = Startmenu.show;
desktoparea.onmousedown = function (e) {
    //WindowManager.unfocusActiveWindow();
    Startmenu.hide();
};

/**
 * Creates a new Form.
 * @param {string} title Title.
 */
function Form() {
    var tr = this.tref = this; // Object reference
    // Make the window, and make a reference.
    var node = this.node = document.createElement("div");

    node.className = "window";
    node.style.visibility = "visible";
    node.style.left = "0px";
    node.style.top = "0px";
    node.style.zIndex = ++WindowZIndex;
    node.style.display = "none";
    node.onmousedown = function () { tr.focus(); };

    // Titlebar
    var divtitle = this.titlebarNode = document.createElement("div");
    divtitle.className = "atitlebar";
    divtitle.onmousedown = function (e) {
        WindowManager.Drag.start(node, desktoparea, e);
    };
    divtitle.onmouseup = function () {
        WindowManager.Drag.stop();
    };

    // Titlebar icon
    var divtitleicon = document.createElement("img");
    divtitleicon.src = "images/window/icon.png";

    // Icon
    divtitleicon.className = "windowicon";

    // Text
    var divtitletext = this.titleNode = document.createElement("span");
    divtitletext.className = "titlebartext";
    divtitletext.innerText = this._title = "Form";

    // Minimize
    var divmin = document.createElement("img");
    divmin.className = "ctrlboxbutton";
    divmin.src = "images/window/min.png";
    /*divmin.onclick = function () {
        
    };
    divmin.onmousedown = function () {
        divmin.src = "images/window/minp.png";
    };*/

    // Maximize
    var divmax = document.createElement("img");
    divmax.className = "ctrlboxbutton";
    divmax.src = "images/window/max.png";
    /*divmax.onclick = function () {
        
    };
    divmax.onmousedown = function () {
        divmin.src = "images/window/maxp.png";
    };*/

    // Close
    var divclose = this.closeButtonObj = document.createElement("img");
    divclose.className = "ctrlboxbuttonc";
    divclose.src = "images/window/close.png";
    divclose.onclick = function () {
        tr.close();
    };
    divclose.onmousedown = function () {
        divclose.src = "images/window/closep.png";
    };

    divtitle.appendChild(divtitleicon);
    divtitle.appendChild(divtitletext);
    divtitle.appendChild(divclose);
    divtitle.appendChild(divmax);
    divtitle.appendChild(divmin);

    node.appendChild(divtitle);

    // Form client area
    var divwindowarea = this.windowAreaNode = document.createElement("div");
    divwindowarea.className = "windowarea";
    node.appendChild(divwindowarea);
}

Form.prototype = {
    /* References */
    tref: null, node: null,
    titlebarNode: null,
    titleTextNode: null,
    closeButtonNode: null,
    windowAreaNode: null,
    taskbarButtonNode: null,
    _title: null,

    /* Properties */
    iconExists: true,

    /* Form size */
    setSize: function (w, h) {
        this.node.style.width = w + "px";
        this.node.style.height = h + "px";
    },
    setWidth: function (w) {
        this.node.style.width = w + "px";
    },
    setHeight: function (h) {
        this.node.style.height = h + "px";
    },

    /* Focus */
    focus: function () {
        console.log("focus");
        if (activeForm != null)
            activeForm.unfocus();
        activeForm = this.tref;
        this.titlebarNode.className = "atitlebar";
        this.node.style.zIndex = ++WindowZIndex;
        if (this.taskbarButtonNode != null)
            this.taskbarButtonNode.className = "tb-focus";
    },
    unfocus: function () {
        console.log("unfocus");
        this.titlebarNode.className = "ititlebar";
        activeForm = null;
        if (this.taskbarButtonNode != null)
            this.taskbarButtonNode.className = "tb";
    },

    /* Controlbox */
    removeMinAndMaxButtons: function () {
        var b = this.node.childNodes[0].getElementsByClassName("ctrlboxbutton");
        for (var i = b.length - 1; i >= 0; --i) {
            b[i].remove();
        }
    },

    /* Form title */
    setTitle: function (text) {
        if (this.titleNode != undefined)
            this.titleNode.innerText = this._text = text;
        else
            this._title = text;
    },
    getTitle: function () {
        return this._title;
    },

    /* Form icon */
    setIcon: function (path) {
        if (this.iconExists)
            this.node.childNodes[0].childNodes[0].src = path;
    },
    getIcon: function () {
        if (this.iconExists)
            return this.node.childNodes[0].childNodes[0].src;
        else return null;
    },
    hideIcon: function () {
        if (this.iconExists)
            this.node.childNodes[0].childNodes[0].style.display = "none";
    },
    removeIcon: function () {
        if (this.iconExists) {
            this.node.childNodes[0].childNodes[0].remove();
            this.iconExists = false;
        }
    },

    /* Form location */
    setLocation: function (x, y) {
        this.node.style.left = x + "px";
        this.node.style.top = y + "px";
    },

    /* Form functions */
    addNode: function (node) {
        this.windowAreaNode.appendChild(node);
    },

    show: function () {
        if (this.iconExists)
            WindowManager.addTaskbarButton(this.tref);
        activeForm = this.tref;
        this.node.style.display = "block";
        desktoparea.appendChild(this.node);
    },
    close: function () {
        this.node.remove();
        if (this.taskbarButtonNode != null)
            this.taskbarButtonNode.remove();
    },

    set title (t) {
        this.setTitle(t);
    },
    get title () {
        return this._title;
    },
    set iconPath (path) {
        if (this.iconExists)
            this.node.childNodes[0].childNodes[0].src = path;
    },
    get iconPath () {
        if (this.iconExists)
            return this.node.childNodes[0].childNodes[0].src;
        else return null;
    }
}

function Button(text, width, height) {
    var b = this.node = document.createElement("div");
    b.className = "button";
    b.style.minWidth = (width === undefined ? 72 : width) + "px";
    b.style.minHeight = (height === undefined ? 17 : height) + "px";
    b.onmousedown = function () {
        b.className = "buttondown";
    };
    b.onmouseup = function () {
        b.className = "button";
    };
    b.tabIndex = 0;

    var t = this.innerDiv = document.createElement("div");
    t.className = "innerbutton";
    t.innerText = text;

    b.appendChild(t);
}

Button.prototype = {
    node: null, innerDiv: null,

    set text (e) {
        this.innerDiv.innerText = e;
    },
    get text () {
        return this.innerDiv.innerText;
    }
}

function ProgressBar() {

}

ProgressBar.prototype = {

}