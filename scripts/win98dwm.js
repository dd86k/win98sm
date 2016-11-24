"use strict";

/**
 * win98dwm.js, Forms and Window Manager.
 * @author guitarxhero
 */

/**
 * Creates a new Form.
 * @param {string} title Title.
 * @class
 */
function Form(title) {
    // Make the window, and make a reference.
    var obj = this.divObject = document.createElement("div");

    //divwindow.id = "form" + windowid;
    obj.className = "window";
    obj.style.visibility = "visible";
    obj.style.left = "100px";
    obj.style.top = "100px";
    obj.style.zIndex = WindowzIndex++;
    obj.onmousedown = function () {
        WindowManager.giveFocus(obj);
    };

    // Titlebar
    var divtitle = document.createElement("div");
    //divtitle.id = "title" + indexWindow;
    divtitle.className = "atitlebar";
    divtitle.onmousedown = function (event) {
        WindowManager.Drag.startMoving(obj, desktoparea, event);
    };
    divtitle.onmouseup = function () {
        WindowManager.Drag.stopMoving();
    };

    // Titlebar icon
    var divtitleicon = document.createElement("img");
    divtitleicon.src = "images/window/titleleft.png";

    // Icon
    divtitleicon.className = "windowicon";

    // Text
    var divtitletext = document.createElement("span");
    divtitletext.className = "titlebartext";
    divtitletext.innerText = title;
    divtitletext.style.fontWeight = "bold";

    // Minimize
    var divmin = document.createElement("img");
    divmin.className = "ctrlboxbutton";
    divmin.src = "images/window/min.png";
    /*divmin.onmousedown = function () {
        divmin.src = "images/window/minp.png";
    };
    divmin.onmouseup = function () {
        divmin.src = "images/window/minp.png";
        WindowManager.hideWindow(obj);
    };*/

    // Maximize
    var divmax = document.createElement("img");
    divmax.className = "ctrlboxbutton";
    divmax.src = "images/window/max.png";
    /*divmax.onclick = function () {
        WindowAPI.maximizeWindow(divwindow);
    };*/

    // Close
    var divclose = document.createElement("img");
    divclose.className = "ctrlboxbuttonc";
    divclose.src = "images/window/close.png";
    divclose.onclick = function () {
        WindowManager.deleteWindow(obj);
    };
    divclose.onmousedown = function () {
        divclose.src = "images/window/closep.png";
    };

    divtitle.appendChild(divtitleicon);
    divtitle.appendChild(divtitletext);
    divtitle.appendChild(divclose);
    divtitle.appendChild(divmax);
    divtitle.appendChild(divmin);

    obj.appendChild(divtitle);

    // Form client area
    var divwindowarea = document.createElement("div");
    divwindowarea.className = "windowarea";
    obj.appendChild(divwindowarea);
}

Form.prototype = {
    /* Window properties */
    divObject: null,
    iconExists: true,

    setSize: function (w, h) {
        this.divObject.style.width = w + "px";
        this.divObject.style.height = h + "px";
    },

    setWidth: function (w) {
        this.divObject.style.width = w + "px";
    },

    setHeight: function (h) {
        this.divObject.style.height = h + "px";
    },

    /* Controlbox */
    removeMinAndMaxButtons: function () {
        var b = this.divObject.childNodes[0].getElementsByClassName("ctrlboxbutton");
        b.remove();
    },

    /* Window text */
    setTitle: function (t) {
        var div = this.divObject.childNodes[0].getElementsByClassName("titlebartext");
        div[0].innerText = t;
    },
    getTitle: function (t) {
        var div = this.divObject.childNodes[0].getElementsByClassName("titlebartext");
        return div[0].innerText;
    },

    /* Window icon */
    setIcon: function (path) {
        if (this.iconExists)
            this.divObject.childNodes[0].childNodes[0].src = path;
    },
    getIcon: function () {
        if (this.iconExists)
            return this.divObject.childNodes[0].childNodes[0].src;
        else return null;
    },
    hideIcon: function () {
        if (this.iconExists)
            this.divObject.childNodes[0].childNodes[0].style.display = "none";
    },
    removeIcon: function () {
        if (this.iconExists) {
            this.divObject.childNodes[0].childNodes[0].remove();
            this.iconExists = false;
        }
    },

    /* Location */
    setLocation: function (x, y) {
        this.divObject.style.left = x + "px";
        this.divObject.style.top = y + "px";
    },

    /* Functions */
    addNode: function (node) {
        // Main window area.
        this.divObject.childNodes[1].appendChild(node);
    },

    close: function () {
        this.divObject.remove();
    }
}

var WindowzIndex = 0, activeDiv = null;

/**
 * Window Manager.
 */

var WindowManager = {
    showInfo: function (title, msg) {
        var f = new Form(title);
        f.removeIcon();
        f.removeMinAndMaxButtons();
        WindowManager.makeMsgBox(f, msg, 0);
        WindowManager.addFormToDesktop(f);
    },

    showWarning: function (title, msg) {
        var f = new Form(title);
        f.removeIcon();
        f.removeMinAndMaxButtons();
        WindowManager.makeMsgBox(f, msg, 1);
        WindowManager.addFormToDesktop(f);
    },

    showError: function (title, msg) {
        var f = new Form(title);
        f.removeIcon();
        f.removeMinAndMaxButtons();
        WindowManager.makeMsgBox(f, msg, 2);
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
        var divmsg = document.createElement("p");
        divmsg.className = "msgboxMsg";

        var divmsgtext = document.createTextNode(msg);
        divmsg.appendChild(divmsgtext);

        var divmsgicon = document.createElement("img");
        divmsgicon.className = "msgboxIcon";

        switch (type) {
            case 0:
                divmsgicon.src = "images/msgbox/infoicon.png";
                break;
            case 1:
                divmsgicon.src = "images/msgbox/warningicon.png";
                break;
            case 2:
                divmsgicon.src = "images/msgbox/erroricon.png";
                break;
        }

        var divbutton = WindowManager.makeButton("OK");
        divbutton.addEventListener("click", function () {
            WindowManager.deleteWindow(f.divObject);
        });

        var divcont = document.createElement("div");
        divcont.style.margin = "12px 0 8px 0";
        divcont.style.width = "100%";
        divcont.style.textAlign = "center";

        divcont.appendChild(divbutton);

        f.addNode(divmsgicon);
        f.addNode(divmsg);
        f.addNode(divcont);
    },

    // For compability.
    createWindow: function (title, x, y, type) {
        var f = new Form(title);

        f.setLocation(x, y);

        switch (type) {
            case "rundialog":
                f.removeMinAndMaxButtons();
                f.removeIcon();

                var body = document.createElement("div");
                body.style.display = "inline-block";
                var subbody = document.createElement("div");

                var img = document.createElement("img");
                img.src = "images/run/item.png";
                img.style.margin = "14px";

                var desc = document.createElement("p");
                desc.innerText = "Type the name of a program, folder, \
document, or Internet resource, and Windows will open it for you.";
                desc.style.fontSize = "11px";
                desc.style.maxWidth = "300px";
                desc.style.cssFloat = "right";

                var open = document.createElement("p");
                open.innerText = "Open:";
                open.style.margin = "4px 10px 12px 14px";
                open.style.display = "inline-block";

                var input = document.createElement("input");
                input.type = "text";
                input.onkeydown = function (e) {
                    if (e.which == 13) { // Enter/Return
                        Shell.run(input.value);
                        f.close();
                    }
                };
                input.rows = 1;
                input.style.marginBottom = "-7px";
                input.style.resize = "none";
                input.style.width = "290px";
                input.onload = function () { input.focus(); };
                input.autofocus = true;

                var buttons = document.createElement("div");
                buttons.style.width = "98%";
                buttons.style.textAlign = "right";
                buttons.style.margin = "8px 0 14px 0px";

                var okbut = WindowManager.makeButton("OK");
                okbut.style.marginRight = "6px";
                okbut.onclick = function () {
                    f.close();
                    Shell.run(input.value);
                };
                var canbut = WindowManager.makeButton("Cancel");
                canbut.style.marginRight = "6px";
                canbut.onclick = function () {
                    f.close();
                };
                var brobut = WindowManager.makeButton("Browse...");

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
                f.setIcon("images/notepad/titleleft.png");

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
            case "cmd":
                f.setIcon("images/cmd/titleleft.png");

                var divcmdmenu = document.createElement("img");
                divcmdmenu.src = "images/cmd/menu.png";
                divcmdmenu.style.marginTop = "2px";

                //TODO: Make a function from win98con.js to make
                //      a console window instead. (Alloc)
                var divcmd = document.createElement("div");
                divcmd.className = "terminal";

                f.addNode(divcmdmenu);
                f.addNode(divcmd);
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

                var tbut = WindowManager.makeButton("Button");
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

                var btnMakeInfo = WindowManager.makeButton("Create info");
                btnMakeInfo.onclick = function () {
                    WindowManager.showInfo(txt1.value, txt2.value);
                }
                var btnMakeWarning = WindowManager.makeButton("Create warning");
                btnMakeWarning.onclick = function () {
                    WindowManager.showWarning(txt1.value, txt2.value);
                }
                var btnMakeError = WindowManager.makeButton("Create error");
                btnMakeError.onclick = function () {
                    WindowManager.showError(txt1.value, txt2.value);
                }

                makecont.appendChild(btnMakeInfo);
                makecont.appendChild(btnMakeWarning);
                makecont.appendChild(btnMakeError);

                f.addNode(txt1);
                f.addNode(txt2);
                f.addNode(makecont);

                var tc = WindowManager.makeButton("Close");
                tc.style.cssFloat = "right";
                tc.style.marginBottom = "4px";
                tc.onclick = function () { f.close(); };

                f.addNode(tc);
                break;
            case "aboutdialog":
                f.removeMinAndMaxButtons();
                f.setWidth(400);

                var dnl = "<br/><br/>";

                var lblAbout = document.createElement("p");
                lblAbout.innerHTML =
                    Project.productName + "<br/>\
                    Version " + Project.version + dnl +
                    "A web-based Windows 98 simulator. Made from scratch using \
only HTML5, CSS3, and Javascript. No libraries." + dnl +
                    "This is only a personal project, I do not plan to \
monitize it." + dnl +
                    "Copyright Microsoft (C) 1981-1998 for Windows 98" + dnl +
                    "Everything written by DD~!<br/>You can contact me via \
<a href=\"mailto:devddstuff@gmail.com\">email</a>.";
                lblAbout.style.textAlign = "center";

                var bottomlayout = document.createElement("div");
                bottomlayout.style.width = "100%";
                bottomlayout.style.textAlign = "center";

                var btnOK = WindowManager.makeButton("Close");
                btnOK.onclick = function () { f.close(); };

                var btnSpin = WindowManager.makeButton("Spin!");
                btnSpin.onclick = function () {
                    f.divObject.style.animation = "spin 1s";
                    setTimeout(function () {
                        f.divObject.style.animation = "";
                    }, 1000);
                };

                bottomlayout.appendChild(btnSpin);
                bottomlayout.appendChild(btnOK);
                f.addNode(lblAbout);
                f.addNode(bottomlayout);
                break;
            default: break;
        }

        WindowManager.addFormToDesktop(f);
    },

    addFormToDesktop: function (form) {
        if (form.iconExists)
            WindowManager.addTaskbarButton(form);
        desktoparea.appendChild(form.divObject);
        //WindowManager.giveFocus(form.divObject);
        StartMenu.hide();
    },

    addTaskbarButton: function (form) {
        taskbarcont.appendChild(
            WindowManager.makeTaskbarButton(form)
        );
    },

    makeButton: function (text, width, height) {
        var b = document.createElement("div");
        b.className = "button";
        b.style.width =
            (width === undefined ? 72 : width < 72 ? 72 : width) + "px";
        //divbutton.style.height =
        //(height === undefined ? 22 : height < 22 ? 22 : height) + "px";
        b.onmousedown = function () {
            b.className = "buttondown";
        };
        b.onmouseup = function () {
            b.className = "button";
        };

        var t = document.createElement("div");
        t.className = "innerbutton";
        t.innerText = text;

        b.appendChild(t);

        return b;
    },

    makeTaskbarButton: function (form) {
        var b = document.createElement("div");
        b.className = "taskbarbutton";

        var bi = document.createElement("img");
        bi.src = form.getIcon();

        var bt = document.createElement("span");
        bt.innerText = form.getTitle();

        b.appendChild(bi);
        b.appendChild(bt);

        return b;
    },

    deleteWindow: function (div) {
        div.remove();
    },

    giveFocus: function (div) {
        if (activeDiv != null)
            activeDiv.childNodes[0].className = "ititlebar";
        activeDiv = div;
        div.childNodes[0].className = "atitlebar";
        div.style.zIndex = WindowzIndex++;
    },

    removeFocusLast: function () {
        if (activeDiv != null)
            activeDiv.childNodes[0].className = "ititlebar";
    },
    removeFocusAll: function () {
        var classes = document.getElementsByClassName("atitlebar");
        for (var i = 0; i < classes.length; ++i) {
            classes[i].className = "ititlebar";
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
            var diffX = posX - divLeft,
                diffY = posY - divTop;
            document.onmousemove = function (me) {
                var posX = me.clientX,
                    posY = me.clientY,
                    aX = posX - diffX,
                    aY = posY - diffY;
                /*if (aX < 0) aX = 0;
                if (aY < 0) aY = 0;
                if (aX + eWi > cWi) aX = cWi - eWi;
                if (aY + eHe > cHe) aY = cHe - eHe;*/
                // Absolute reference.
                WindowManager.Drag.move(div, aX, aY);
            };
        },

        stopMoving: function () {
            document.onmousemove = function () { };
        }
    }
};

/**
 * Start menu.
 */

var StartMenu = {
    show: function () {
        //TODO: Remove last focus instead
        WindowManager.removeFocusAll();
        if (startmenu.style.visibility == 'hidden') {
            startmenu.style.visibility = 'visible';
            startbutton.src = 'images/startmenu/on.png';
        } else {
            startmenu.style.visibility = 'hidden';
            startbutton.src = 'images/startmenu/off.png';
        }
    },

    hide: function () {
        startmenu.style.visibility = 'hidden';
        startbutton.src = 'images/startmenu/off.png';
        //WindowManager.unfocusLast();
    }
}


startbutton.onmousedown = StartMenu.show;
desktoparea.onmousedown = StartMenu.hide;
