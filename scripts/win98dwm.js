"use strict";

/**
 * win98dwm.js, Forms, Window Manager, and the Start Menu.
 * @author dd86k
 */

var WindowZIndex = 0, activeForm = null;

/*
 * Enumerations
 */

var MessageBoxIcon = {
    critical: 16,
    question: 32,
    exclamation: 48,
    info: 64
}

/**
 * Display a message window to the user.
 */

var MessageBox = {
    /**
     * Displays a message box with a title, message, and icon.
     */
    show: function (title, msg, icon) {
        var f = new Form();
        f.removeMinAndMaxButtons();
        f.removeIcon();
        f.title = title;

        var divmsgicon = document.createElement("img");
        divmsgicon.className = "msgboxIcon";

        switch (icon) {
            case MessageBoxIcon.critical:
                divmsgicon.src = "images/msgbox/critical.png";
                break;
            case MessageBoxIcon.question:
                divmsgicon.src = "images/msgbox/question.png";
                break;
            case MessageBoxIcon.exclamation:
                divmsgicon.src = "images/msgbox/exclamation.png";
                break;
            case MessageBoxIcon.info:
                divmsgicon.src = "images/msgbox/info.png";
                break;
        }

        var divmsg = document.createElement("p");
        divmsg.innerText = msg;
        if (divmsgicon.src == "") {
            divmsg.style.textAlign = "center";
            divmsg.style.margin = "10px";
            divmsg.style.maxWidth = "300px";
            divmsg.style.wordWrap = "break-word";
        }
        else {
            divmsg.className = "msgboxMsg";
            f.addNode(divmsgicon);
        }

        var btnOk = new Button("OK").node;
        btnOk.onclick = function () {
            f.close();
        };

        var divcont = document.createElement("div");
        divcont.style.margin = "12px 0 8px 0";
        divcont.style.width = "100%";
        divcont.style.textAlign = "center";

        divcont.appendChild(btnOk);

        f.addNode(divmsg);
        f.addNode(divcont);

        f.show();
        f.center();
    },

    showError: function (title, msg) {
        MessageBox.show(title, msg, MessageBoxIcon.critical);
    },

    showQuestion: function (title, msg) {
        MessageBox.show(title, msg, MessageBoxIcon.question);
    },

    showWarning: function (title, msg) {
        MessageBox.show(title, msg, MessageBoxIcon.exclamation);
    },

    showInfo: function (title, msg) {
        MessageBox.show(title, msg, MessageBoxIcon.info);
    },
}

/**
 * Window Manager.
 */

var WindowManager = {
    /**
     * Internal use.
     */
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
        icon.src = form.iconPath;

        var text = document.createElement("span");
        text.innerText = form.title;

        c.appendChild(icon);
        c.appendChild(text);

        form.taskbarButtonNode = c;
    },

    /**
     * Internal use.
     */
    unfocusActiveWindow: function () {
        if (activeForm != null) {
            activeForm.unfocus();
        }
    },

    /**
     * Internal use.
     */
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
    }
};

/**
 * Start menu. Internal use.
 */

var Startmenu = {
    visible: false, // Faster than checking with DOM

    show: function () {
        WindowManager.unfocusActiveWindow();
        win98menu.style.display = "block";
        startbutton.src = 'images/startmenu/on.png';
        Startmenu.visible = true;
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
 * @class
 */
function Form() {
    var r = this.tref = this; // Object reference
    // Make the window, and make a reference.
    var n = this.node = document.createElement("div");

    n.className = "window";
    n.style.left = "0px";
    n.style.top = "0px";
    n.style.display = "none";
    n.onmousedown = function () { r.focus(); };

    // Titlebar
    var dtitle = this.titlebarNode = document.createElement("div");
    dtitle.className = "atitlebar";
    dtitle.onmousedown = function (e) {
        WindowManager.Drag.start(n, desktoparea, e);
    };
    dtitle.onmouseup = function () {
        WindowManager.Drag.stop();
    };

    // Titlebar icon
    var dicon = document.createElement("img");
    dicon.src = "images/window/icon.png";

    // Icon
    dicon.className = "windowicon";

    // Text
    var dtext = this.titleNode = document.createElement("span");
    dtext.className = "titlebartext";
    dtext.innerText = this._title = "Form";

    // Minimize
    var dmin = document.createElement("img");
    dmin.className = "ctrlboxbutton";
    dmin.src = "images/window/min.png";
    /*dmin.onclick = function () {
        
    };
    dmin.onmousedown = function () {
        dmin.src = "images/window/minp.png";
    };*/

    // Maximize
    var dmax = document.createElement("img");
    dmax.className = "ctrlboxbutton";
    dmax.src = "images/window/max.png";
    /*dmax.onclick = function () {
        
    };
    dmax.onmousedown = function () {
        divmin.src = "images/window/maxp.png";
    };*/

    // Close
    var dclose = this.closeButtonObj = document.createElement("img");
    dclose.className = "ctrlboxbuttonc";
    dclose.src = "images/window/close.png";
    dclose.onclick = function () {
        r.close();
    };
    dclose.onmousedown = function () {
        dclose.src = "images/window/closep.png";
    };

    dtitle.appendChild(dicon);
    dtitle.appendChild(dtext);
    dtitle.appendChild(dclose);
    dtitle.appendChild(dmax);
    dtitle.appendChild(dmin);

    n.appendChild(dtitle);

    // Form client area
    var darea = this.windowAreaNode = document.createElement("div");
    darea.className = "windowarea";
    n.appendChild(darea);
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
        this.titleNode.innerText = this._text = text;
    },
    getTitle: function () {
        return this._title;
    },
    set title (t) {
        this.setTitle(t);
    },
    get title () {
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

    center: function () {
        var w = this.node.offsetWidth
        var h = this.node.offsetHeight;
        this.setLocation(
            (innerWidth / 2) - (w / 2),
            (innerHeight / 2) - (h / 2)
        );
    },

    /* Form functions */
    addNode: function (node) {
        this.windowAreaNode.appendChild(node);
    },
    add: function (control) {
        this.windowAreaNode.appendChild(control.node);
    },

    show: function () {
        if (this.iconExists)
            WindowManager.addTaskbarButton(this);
        this.node.style.display = "block";
        desktoparea.appendChild(this.node);
        this.focus();
    },
    close: function () {
        this.node.remove();
        if (this.taskbarButtonNode != null)
            this.taskbarButtonNode.remove();
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

/**
 * Constructs a new Button.
 * @class
 */
function Button(text, width, height) {
    var n = this.node = document.createElement("div");
    n.className = "button";
    n.style.minWidth = (width === undefined ? 72 : width) + "px";
    n.style.minHeight = (height === undefined ? 17 : height) + "px";
    n.onmousedown = function () {
        n.className = "buttondown";
    };
    n.onmouseup = function () {
        n.className = "button";
    };
    n.tabIndex = 0;

    var t = this.innerDiv = document.createElement("div");
    t.className = "innerbutton";
    t.innerText = text;

    n.appendChild(t);
}

Button.prototype = {
    node: null, innerDiv: null,

    set text (e) {
        this.innerDiv.innerText = e;
    },
    get text () {
        return this.innerDiv.innerText;
    },

    get width () {
        return this.style.width;
    },
    set width (w) {
        this.node.style.width = w + 'px';
    },

    get height () {
        return this.style.height;
    },
    set height (h) {
        this.node.style.height = h + 'px';
    }
}

/**
 * Constructs a ComboBox.
 * @class
 */
function ComboBox() {
    var r = this.tref = this;
    var n = this.node = document.createElement("select");
}

ComboBox.prototype = {
    tref: null, node: null,

    addItem: function (item) {
        var o = document.createElement("option");
        o.text = item;
        this.node.add(o);
    },

    insertItem: function (item, index) {
        var o = document.createElement("option");
        o.text = item;
        this.node.add(o, this.node[index]);
    },

    removeItem: function (index) {
        this.node.remove(index);
    },

    textAt: function (index) {
        return this.node.options[index].text;
    },

    get options () {
        return this.node.options;
    },

    get enabled () {
        return !this.node.disabled;
    },
    set enabled (c) {
        this.node.disabled = !c;
    },
    get disabled () {
        return this.node.disabled;
    },
    set disabled (c) {
        this.node.disabled = c;
    },

    get count () {
        return this.node.length;
    },

    get name () {
        return this.node.name;
    },
    set name (n) {
        this.node.name = n;
    },

    get multiple () {
        return this.node.multiple;
    },
    set multiple (c) {
        this.node.multiple = c;
    },

    get selectedIndex () {
        return this.node.selectedIndex;
    },
    set selectedIndex (i) {
        this.node.selectedIndex = i;
    },

    get size () {
        return this.node.size;
    },
    set size (s) {
        this.node.size = s;
    },

    get type () {
        return this.node.type;
    },

    get value () {
        return this.node.value;
    },
    set value (v) {
        this.node.value = v;
    },
}

/**
 * Constructs a ProgressBar.
 * @class
 */
function ProgressBar() {

}

ProgressBar.prototype = {
    tref: null, node: null,


}

/**
 * Menu bar system.
 */
function Menu() {
    var t = this.tref = this;

}

Menu.prototype = {
    tref: null, node: null,


}

function MenuItem() {
    var t = this.tref = this;
    
}

MenuItem.prototype = {
    tref: null, node: null,


}