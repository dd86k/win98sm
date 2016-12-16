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

    // For compability. Depricated.
    createWindow: function (title, x, y, type) {
        var f = new Form(title);

        f.setLocation(x, y);

        switch (type) {
            case "rundialog":
                f.removeMinAndMaxButtons();
                f.removeIcon();
                f.setSize(347, 163);
                f.setLocation(5, innerHeight - 201);

                var body = document.createElement("div");
                body.style.display = "inline-block";
                var subbody = document.createElement("div");

                var img = document.createElement("img");
                img.src = "images/run/item.png";
                img.style.margin = "20px 14px";
                img.style.display = "inline-block";

                var desc = document.createElement("p");
                desc.innerText = "Type the name of a program, folder, \
document, or Internet resource, and Windows will open it for you.";
                desc.style.fontSize = "12px";
                desc.style.maxWidth = "280px";
                desc.style.cssFloat = "right";
                desc.style.marginTop = "18px";

                var open = document.createElement("p");
                open.innerText = "Open:";
                open.style.margin = "4px 10px 12px 14px";
                open.style.display = "inline-block";

                var input = document.createElement("input");
                input.type = "text";
                input.style.display = "inline-block";
                input.onkeydown = function (e) {
                    if (e.which == 13) { // Enter/Return
                        Shell.run(input.value);
                        f.close();
                        return false;
                    }
                };
                input.style.marginBottom = "-7px";
                input.style.width = "277px";
                setTimeout(function () {
                    input.focus();
                }, 100);

                var buttons = document.createElement("div");
                buttons.style.textAlign = "right";
                buttons.style.margin = "6px 8px";

                var okbut = new Button("OK").node;
                okbut.style.marginRight = "6px";
                okbut.onclick = function () {
                    f.close();
                    Shell.run(input.value);
                };
                var canbut = new Button("Cancel").node;
                canbut.style.marginRight = "6px";
                canbut.onclick = function () {
                    f.close();
                };
                var brobut = new Button("Browse...").node;

                body.appendChild(img);
                body.appendChild(desc);
                subbody.appendChild(open);
                subbody.appendChild(input);
                buttons.appendChild(okbut);
                buttons.appendChild(canbut);
                buttons.appendChild(brobut);

                f.addNode(body);
                f.addNode(subbody);
                f.addNode(buttons);
                break;
            case "notepad":
                f.setIcon("images/notepad/icon.png");

                var divmenu = document.createElement("div");
                divmenu.className = "menubar";

                var divtmp = document.createElement("img");
                divtmp.src = "images/notepad/menu.png";

                var divinput = document.createElement("textarea");
                divinput.className = "notepadinput";
                divinput.style.width = "200px";
                divinput.style.height = "125px";

                divmenu.appendChild(divtmp);
                f.addNode(divmenu);
                f.addNode(divinput);
                break;
            case "iexplore":
                f.setIcon("images/iexplore/icon.png");

                var mbc = document.createElement("div");

                var mb = document.createElement("img");
                mb.src = "images/iexplore/b.png";

                var addspan = document.createElement("span");
                addspan.innerText = "Address";

                var addtxt = document.createElement("input");
                addtxt.type = "text";

                mbc.appendChild(mb);
                mbc.appendChild(addspan);
                mbc.appendChild(addtxt);

                var netframe = document.createElement("iframe");

                addtxt.onkeydown = function (e) {
                    if (e.which == 13) {
                        netframe.src = addtxt.value;
                        f.setTitle(
                            addtxt.value + " - Microsoft Internet Explorer"
                        );
                        return false;
                    }
                }

                f.addNode(mbc);
                f.addNode(netframe);
                break;
            case "command":
                f.setIcon("images/command/icon.png");

                var divcmdmenu = document.createElement("img");
                divcmdmenu.src = "images/command/menu.png";
                divcmdmenu.style.marginTop = "2px";
                
                var com = new Command();
                com.con.form = f;
                var s = com.node;

                f.addNode(divcmdmenu);
                f.addNode(s);
                break;
            case "contests":
                var c = new Conhost();

                var btnWrite = new Button("Write 'Test'").node;
                btnWrite.onclick = function () {
                    c.write("Test");
                }

                f.addNode(btnWrite);
                f.addNode(c.node);
                break;
            case "tests":
                var ff = document.createElement("form");

                var r0 = document.createElement("input");
                r0.type = "radio";
                r0.name = "rtest";
                var rt0 = document.createElement("label");
                rt0.innerText = "Radio 0";
                var r1 = document.createElement("input");
                r1.type = "radio";
                r1.name = "rtest";
                var rt1 = document.createElement("label");
                rt1.innerText = "Radio 1";

                var cb0 = document.createElement("input");
                cb0.type = "checkbox";
                var cbt0 = document.createElement("label");
                cbt0.innerText = "Checkbox 0";

                var cb1 = document.createElement("input");
                cb1.type = "checkbox";
                var cbt1 = document.createElement("label");
                cbt1.innerText = "Checkbox 1";

                ff.appendChild(r0);
                ff.appendChild(rt0);
                ff.appendChild(r1);
                ff.appendChild(rt1);
                ff.appendChild(cb0);
                ff.appendChild(cbt0);
                ff.appendChild(cb1);
                ff.appendChild(cbt1);
                f.addNode(ff);

                var tbut = new Button("Button as block").node;
                tbut.style.marginBottom = "6px";
                tbut.style.display = "block";

                f.addNode(tbut);

                var txt1 = document.createElement("textarea");
                txt1.defaultValue = "Title";
                txt1.placeholder = "Title";
                txt1.rows = 1;
                var txt2 = document.createElement("textarea");
                txt2.defaultValue = "Message";
                txt2.placeholder = "Message";
                txt2.rows = 1;

                var makecont = document.createElement("div");

                var btnMakeInfo = new Button("Create info").node;
                btnMakeInfo.style.marginRight = "4px";
                btnMakeInfo.onclick = function () {
                    WindowManager.showInfo(txt1.value, txt2.value);
                }
                var btnMakeWarning = new Button("Create warning").node;
                btnMakeWarning.style.marginRight = "4px";
                btnMakeWarning.onclick = function () {
                    WindowManager.showWarning(txt1.value, txt2.value);
                }
                var btnMakeError = new Button("Create error").node;
                btnMakeError.onclick = function () {
                    WindowManager.showError(txt1.value, txt2.value);
                }

                makecont.appendChild(btnMakeInfo);
                makecont.appendChild(btnMakeWarning);
                makecont.appendChild(btnMakeError);

                f.addNode(txt1);
                f.addNode(txt2);
                f.addNode(makecont);

                var tc = new Button("Close").node;
                tc.style.cssFloat = "right";
                tc.style.marginTop = "4px";
                tc.onclick = function () { f.close(); };

                f.addNode(tc);
                break;
            case "aboutdialog":
                f.removeMinAndMaxButtons();
                f.setWidth(400);

                var dnl = "<br/><br/>";

                var lblAbout = document.createElement("p");
                lblAbout.innerHTML =
                    Project.name + "<br/>\
                    Version " + Project.Version.text + dnl +
                    "A web-based Windows 98 simulator. Made from scratch using \
only HTML5, CSS3, and Javascript (ECMAScript 5.1). No libraries." + dnl +
                    "This is only a personal project, I do not plan to \
monetize it." + dnl +
                    "Copyright Microsoft (C) 1981-1998 for Windows 98" + dnl +
                    "Everything written by DD~!<br/>You can contact me via \
<a href=\"mailto:devddstuff@gmail.com\">email</a>.";
                lblAbout.style.textAlign = "center";

                var bottomlayout = document.createElement("div");
                bottomlayout.style.width = "100%";
                bottomlayout.style.textAlign = "right";

                var btnOK = new Button("Close").node;
                btnOK.onclick = function () { f.close(); };
                btnOK.style.marginLeft = "6px";

                var btnSpin = new Button("Spin!").node;
                btnSpin.onclick = function () {
                    f.node.style.animation = "spin 1s";
                    setTimeout(function () {
                        f.node.style.animation = null;
                    }, 1000);
                };

                bottomlayout.appendChild(btnSpin);
                bottomlayout.appendChild(btnOK);
                f.addNode(lblAbout);
                f.addNode(bottomlayout);
                break;
            case "logoff":
                f.removeMinAndMaxButtons();
                f.removeIcon();
                f.setSize(288, 123);
                f.setLocation(
                    (innerWidth / 2) - (288 / 2),
                    (innerHeight / 2) - (123)
                );
                f.node.onmousedown = f.titlebarObj.onmousedown = null;
                f.node.style.zIndex = "8000001";

                var bg = document.createElement("div");
                bg.className = "shutdownbg";

                var shimg = document.createElement("img");
                shimg.src = "images/startmenu/item02.png";
                shimg.style.cssFloat = "left";
                shimg.style.margin = "19px 22px";

                var desc = document.createElement("p");
                desc.style.display = "inline-block";
                desc.style.margin  = "22px 0 14px 0";
                desc.innerText = "Are you sure you want to log off?";

                var bcon = document.createElement("div");
                bcon.style.textAlign = "center";
                bcon.style.margin = "12px 0 14px 0";

                var btnyes = new Button("Yes", 65).node;
                btnyes.onclick = function (e) {
                    //location.href = "../index.html";
                }

                var fca = function (e) {
                    f.close();
                    bg.remove();
                }

                var btnno = new Button("No", 65).node;
                btnno.onclick = fca;
                btnno.style.marginLeft = "10px";

                f.closeButtonObj.onclick = fca;

                bcon.appendChild(btnyes);
                bcon.appendChild(btnno);

                f.addNode(shimg);
                f.addNode(desc);
                f.addNode(bcon);

                Startmenu.hide();
                desktop.appendChild(bg);
                desktop.appendChild(f.node);
                return;
            default: break;
        }

        f.show();
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
        move: function (divid, x, y) {
            divid.style.left = x + 'px';
            divid.style.top = y + 'px';
        },

        /**
         * Event start moving a window.
         * @param {Node} div Window div.
         * @param {Node} c Parent container.
         * @param {Event} e Event parameter.
         */
        start: function (div, c, e) {
            var posX = e.clientX, posY = e.clientY,
                divTop = div.style.top, divLeft = div.style.left,
                eWi = parseInt(div.style.width),
                eHe = parseInt(div.style.height),
                cWi = parseInt(c.style.width),
                cHe = parseInt(c.style.height);
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
                WindowManager.Drag.move(div, aX, aY);
            };
        },

        stop: function () {
            document.onmousemove = null;
        }
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
    WindowManager.unfocusActiveWindow();
    Startmenu.hide();
};

/**
 * Creates a new Form.
 * @param {string} title Title.
 */
function Form(title) {
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
    if (title != undefined)
        divtitletext.innerText = this._title = title;
    else
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
        if (activeForm != null)
            activeForm.unfocus();
        activeForm = this.tref;
        this.titlebarNode.className = "atitlebar";
        this.node.style.zIndex = ++WindowZIndex;
        if (this.taskbarButtonNode != null)
            this.taskbarButtonNode.className = "tb-focus";
    },
    unfocus: function () {
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
    set iconPath (p) {
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