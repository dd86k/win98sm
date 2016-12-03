"use strict";

/**
 * win98dwm.js, Forms, Window Manager, and the Start Menu.
 * @author dd86k
 */

/**
 * Creates a new Form.
 * @param {string} title Title.
 * @class
 */
function Form(title) {
    var thisref = this.thisRef = activeForm = this; // Object reference
    // Make the window, and make a reference.
    var winobjref = this.obj = document.createElement("div");

    winobjref.className = "window";
    winobjref.style.visibility = "visible";
    winobjref.style.left = "0px";
    winobjref.style.top = "0px";
    winobjref.style.zIndex = ++WindowZIndex;
    winobjref.onmousedown = function () { thisref.focus(); };

    // Titlebar
    var divtitle = this.titlebarObj = document.createElement("div");
    divtitle.className = "atitlebar";
    divtitle.onmousedown = function (e) {
        WindowManager.Drag.startMoving(winobjref, desktoparea, e);
    };
    divtitle.onmouseup = function () {
        WindowManager.Drag.stopMoving();
    };

    // Titlebar icon
    var divtitleicon = document.createElement("img");
    divtitleicon.src = "images/window/icon.png";

    // Icon
    divtitleicon.className = "windowicon";

    // Text
    var divtitletext = this.titleObj = document.createElement("span");
    divtitletext.className = "titlebartext";
    divtitletext.innerText = title;

    // Minimize
    var divmin = document.createElement("img");
    divmin.className = "ctrlboxbutton";
    divmin.src = "images/window/min.png";
    /*divmin.onmousedown = function () {
        divmin.src = "images/window/minp.png";
    };
    divmin.onclick = function () {
        
    };*/

    // Maximize
    var divmax = document.createElement("img");
    divmax.className = "ctrlboxbutton";
    divmax.src = "images/window/max.png";
    /*divmax.onclick = function () {
        
    };*/

    // Close
    var divclose = this.closeButtonObj = document.createElement("img");
    divclose.className = "ctrlboxbuttonc";
    divclose.src = "images/window/close.png";
    divclose.onclick = function () {
        thisref.close();
    };
    divclose.onmousedown = function () {
        divclose.src = "images/window/closep.png";
    };

    divtitle.appendChild(divtitleicon);
    divtitle.appendChild(divtitletext);
    divtitle.appendChild(divclose);
    divtitle.appendChild(divmax);
    divtitle.appendChild(divmin);

    winobjref.appendChild(divtitle);

    // Form client area
    var divwindowarea = this.windowAreaObj = document.createElement("div");
    divwindowarea.className = "windowarea";
    winobjref.appendChild(divwindowarea);
}

Form.prototype = {
    /* References */
    thisRef: null,
    obj: null,
    titlebarObj: null,
    titleObj: null,
    closeButtonObj: null,
    windowAreaObj: null,
    taskbarButtonObj: null,

    /* Properties */
    iconExists: true,

    /* Form size */
    setSize: function (w, h) {
        this.obj.style.width = w + "px";
        this.obj.style.height = h + "px";
    },
    setWidth: function (w) {
        this.obj.style.width = w + "px";
    },
    setHeight: function (h) {
        this.obj.style.height = h + "px";
    },

    /* Focus */
    focus: function () {
        if (activeForm != null)
            activeForm.unfocus();
        activeForm = this.thisRef;
        this.titlebarObj.className = "atitlebar";
        this.obj.style.zIndex = ++WindowZIndex;
        if (this.taskbarButtonObj != null)
            this.taskbarButtonObj.className = "tb-focus";
    },
    unfocus: function () {
        this.titlebarObj.className = "ititlebar";
        activeForm = null;
        if (this.taskbarButtonObj != null)
            this.taskbarButtonObj.className = "tb";
    },

    /* Controlbox */
    removeMinAndMaxButtons: function () {
        var b = this.obj.childNodes[0].getElementsByClassName("ctrlboxbutton");
        for (var i = b.length - 1; i >= 0; --i) {
            b[i].remove();
        }
    },

    /* Form title */
    setTitle: function (text) {
        this.titleObj.innerText = text;
    },
    getTitle: function () {
        return this.titleObj.innerText;
    },

    /* Form icon */
    setIcon: function (path) {
        if (this.iconExists)
            this.obj.childNodes[0].childNodes[0].src = path;
    },
    getIcon: function () {
        if (this.iconExists)
            return this.obj.childNodes[0].childNodes[0].src;
        else return null;
    },
    hideIcon: function () {
        if (this.iconExists)
            this.obj.childNodes[0].childNodes[0].style.display = "none";
    },
    removeIcon: function () {
        if (this.iconExists) {
            this.obj.childNodes[0].childNodes[0].remove();
            this.iconExists = false;
        }
    },

    /* Form location */
    setLocation: function (x, y) {
        this.obj.style.left = x + "px";
        this.obj.style.top = y + "px";
    },

    /* Form functions */
    addNode: function (node) {
        // Main window area.
        this.windowAreaObj.appendChild(node);
    },

    close: function () {
        this.obj.remove();
        if (this.taskbarButtonObj != null)
            this.taskbarButtonObj.remove();
    }
}

function Button(text, width, height) {
    var b = this.obj = document.createElement("div");
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

    var t = document.createElement("div");
    t.className = "innerbutton";
    t.innerText = text;

    b.appendChild(t);
}

Button.prototype = {
    obj: null
}

function ProgressBar() {

}

ProgressBar.prototype = {

}

var WindowZIndex = 0, activeForm = null;

/**
 * Window Manager.
 */

var WindowManager = {
    showError: function (title, msg) {
        var f = new Form(title);
        WindowManager.makeMsgBox(f, msg, 16);
        WindowManager.addFormToDesktop(f);
    },

    showQuestion: function (title, msg) {
        var f = new Form(title);
        WindowManager.makeMsgBox(f, msg, 32);
        WindowManager.addFormToDesktop(f);
    },

    showWarning: function (title, msg) {
        var f = new Form(title);
        WindowManager.makeMsgBox(f, msg, 48);
        WindowManager.addFormToDesktop(f);
    },

    showInfo: function (title, msg) {
        var f = new Form(title);
        WindowManager.makeMsgBox(f, msg, 64);
        WindowManager.addFormToDesktop(f);
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

        var btnOk = new Button("OK").obj;
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
                desc.style = 
                    "font-size:12px;max-width:280px;float:right;margin-top:18px;";

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

                var buttons = document.createElement("div");
                buttons.style.textAlign = "right";
                buttons.style.margin = "6px 8px";

                var okbut = new Button("OK").obj;
                okbut.style.marginRight = "6px";
                okbut.onclick = function () {
                    f.close();
                    Shell.run(input.value);
                };
                var canbut = new Button("Cancel").obj;
                canbut.style.marginRight = "6px";
                canbut.onclick = function () {
                    f.close();
                };
                var brobut = new Button("Browse...").obj;

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
                f.setSize(493, 308);

                var divcmdmenu = document.createElement("img");
                divcmdmenu.src = "images/command/menu.png";
                divcmdmenu.style.marginTop = "2px";
                
                var s = new Prompt(new Conhost()).obj;

                f.addNode(divcmdmenu);
                f.addNode(s);
                break;
            case "contests":
                var c = new Conhost();

                var btnWrite = new Button("Write 'Test'").obj;
                btnWrite.onclick = function () {
                    c.write("Test");
                }

                f.addNode(btnWrite);
                f.addNode(c.obj);
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

                var tbut = new Button("Button as block").obj;
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

                var btnMakeInfo = new Button("Create info").obj;
                btnMakeInfo.style.marginRight = "4px";
                btnMakeInfo.onclick = function () {
                    WindowManager.showInfo(txt1.value, txt2.value);
                }
                var btnMakeWarning = new Button("Create warning").obj;
                btnMakeWarning.style.marginRight = "4px";
                btnMakeWarning.onclick = function () {
                    WindowManager.showWarning(txt1.value, txt2.value);
                }
                var btnMakeError = new Button("Create error").obj;
                btnMakeError.onclick = function () {
                    WindowManager.showError(txt1.value, txt2.value);
                }

                makecont.appendChild(btnMakeInfo);
                makecont.appendChild(btnMakeWarning);
                makecont.appendChild(btnMakeError);

                f.addNode(txt1);
                f.addNode(txt2);
                f.addNode(makecont);

                var tc = new Button("Close").obj;
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
                    Version " + Project.version + dnl +
                    "A web-based Windows 98 simulator. Made from scratch using \
only HTML5, CSS3, and Javascript. No libraries." + dnl +
                    "This is only a personal project, I do not plan to \
monetize it." + dnl +
                    "Copyright Microsoft (C) 1981-1998 for Windows 98" + dnl +
                    "Everything written by DD~!<br/>You can contact me via \
<a href=\"mailto:devddstuff@gmail.com\">email</a>.";
                lblAbout.style.textAlign = "center";

                var bottomlayout = document.createElement("div");
                bottomlayout.style.width = "100%";
                bottomlayout.style.textAlign = "right";

                var btnOK = new Button("Close").obj;
                btnOK.onclick = function () { f.close(); };
                btnOK.style.marginLeft = "6px";

                var btnSpin = new Button("Spin!").obj;
                btnSpin.onclick = function () {
                    f.obj.style.animation = "spin 1s";
                    setTimeout(function () {
                        f.obj.style.animation = null;
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
                f.obj.onmousedown = f.titlebarObj.onmousedown = null;
                f.obj.style.zIndex = "8000001";

                var bg = document.createElement("div");
                bg.className = "shutdownbg";

                var shimg = document.createElement("img");
                shimg.style = "float:left;margin:19px 22px;";
                shimg.src = "images/Startmenu/item02.png";

                var desc = document.createElement("p");
                desc.style = "display:inline-block;margin:22px 0 14px 0;";
                desc.innerText = "Are you sure you want to log off?";

                var bcon = document.createElement("div");
                bcon.style = "text-align: center; margin: 12px 0 14px 0;";

                var btnyes = new Button("Yes", 65).obj;
                btnyes.onclick = function (e) {
                    //location.href = "../index.html";
                }

                var fca = function (e) {
                    f.close();
                    bg.remove();
                }

                var btnno = new Button("No", 65).obj;
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
                desktop.appendChild(f.obj);
                return;
            default: break;
        }

        WindowManager.addFormToDesktop(f);
    },

    addFormToDesktop: function (form) {
        if (form.iconExists)
            WindowManager.addTaskbarButton(form);
        desktoparea.appendChild(form.obj);
        Startmenu.hide();
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
        startMoving: function (div, c, e) {
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

        stopMoving: function () {
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
        WindowManager.unfocusActiveWindow();
        if (Startmenu.visible) {
            win98menu.style.visibility = 'hidden';
            startbutton.src = 'images/Startmenu/off.png';
            Startmenu.visible = false;
        } else {
            win98menu.style.visibility = 'visible';
            startbutton.src = 'images/Startmenu/on.png';
            Startmenu.visible = true;
        }
    },

    hide: function () {
        win98menu.style.visibility = 'hidden';
        startbutton.src = 'images/Startmenu/off.png';
        Startmenu.visible = false;
    }
}

/*
 * Events
 */

startbutton.onmousedown = Startmenu.show;
desktoparea.onmousedown = Startmenu.hide;
