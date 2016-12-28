"use strict";

/**
 * win98.js, Operating System.
 * @author dd86k
 */

/* TODOs:
- win98wsh.js (Windows Scripting Host)
  - Move stuff from win98con (Command.prototype.execute)
*/

/**
 * Project properties.
 */
var Project = {
    name: "Windows 98 WebSim",
    Version: {
        major: 0, minor: 7, revision: 0,
        branch: "git", commit: 5,
        get text () {
            var t = Project.Version.major + "." +
                Project.Version.minor + "." +
                Project.Version.revision;

            if (Project.Version.branch == "git" ||
                Project.Version.branch == "rc")
                t += "-" + Project.Version.branch + "-" + Project.Version.commit;

            return t;
        },
    },
    get fullName () {
        return Project.name + " " + Project.Version.text;
    }
};

function boot() {
    // win98.js
    Object.freeze(Project);
    // win98dwm.js
    Object.freeze(MessageBoxIcon);
    websimversion.innerText = Project.fullName;
    updateTime24h();
}

onload = boot;

/*
 * Time.
 */

function updateTime12h() {
    var t = new Date();
    var h = t.getHours();
    var m = t.getMinutes();

    if (m < 10) {
        m = "0" + m;
    }

    var t = null;

    if (h > 12) {
        t = "PM";
        h = h - 12;
    } else if (h == 12) {
        t = "PM";
    } else {
        t = "AM";
    }

    ostime.innerHTML = h + ":" + m + " " + t;
}

function updateTime24h() {
    var t = new Date();
    var m = t.getMinutes();

    if (m < 10) {
        m = "0" + m;
    }

    ostime.innerHTML = t.getHours() + ":" + m;
}

setInterval(updateTime24h, 5000);

/**
 * Utilities.
 */

var Utils = {
    r: function (max) { return Math.random() * max; }
}

/*
 * Global prototyping.
 */

// StackOverflow solution by Johan Dettmar
Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = 0, len = this.length; i < len; i++)
        if (this[i] && this[i].parentElement)
            this[i].parentElement.removeChild(this[i]);
};

/**
 * Shell.
 */

var Shell = {
    /**
     * Run a file. (Fake)
     * @param {string} path - The virtual path to the file.
     * @param {string} args - Command arguments.
     * @param {boolean} console - In console. 
     * @returns {Number} Error code.
     */
    run: function (file, args, console) {
        if (file != null && file.length > 0) {
            if (/^(http:\/\/)/i.test(file)) {
                open(file);
            } else {
                var s = file.split(" ", 128);
                switch (s[0].toLowerCase()) {
                    case "command": case "command.com": {
                        var f = new Form();
                        f.setIcon("images/command/icon.png");
                        f.title = "MS-DOS Prompt";

                        var divcmdmenu = document.createElement("img");
                        divcmdmenu.src = "images/command/menu.png";
                        divcmdmenu.style.marginTop = "2px";
                        
                        var com = new Command();
                        com.con.form = f;
                        var s = com.node;

                        f.node.onclick = function (e) {
                            com.con.node.focus();
                        };

                        f.addNode(divcmdmenu);
                        f.addNode(s);
                        f.show();
                        return 0;
                    }
                    case "notepad": case "notepad.exe": {
                        var f = new Form();
                        f.iconPath = "images/notepad/icon.png";
                        f.title = "Untitled - Notepad";

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
                        f.show();
                        return 0;
                    }
                    case "iexplore": case "iexplore.exe": {
                        var f = new Form();
                        f.title = "about:blank - Microsoft Internet Explorer";
                        f.setIcon("images/iexplore/icon.png");

                        var mbc = document.createElement("div");

                        var mb = document.createElement("img");
                        //mb.src = "images/iexplore/b.png";

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
                        f.show();
                        return 0;
                    }
                    case "shell:run": {
                        var f = new Form();
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
                        f.show();
                        return 0;
                    }
                    case "shell:about": {
                        var f = new Form();
                        f.title = "About win98sm";
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
                            "Written by dd86k •️ \
<a href=\"mailto:devddstuff@gmail.com\">Email</a>.";
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
                        f.show();
                        return 0;
                    }
                    case "shell:tests": {
                        var f = new Form();
                        f.title = "Form Tests";

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
                        txt1.placeholder = "Title";
                        txt1.defaultValue = "Title";
                        txt1.rows = 1;
                        var txt2 = document.createElement("textarea");
                        txt2.placeholder = "Message";
                        txt2.defaultValue = "Message";
                        txt2.rows = 1;

                        var makecont = document.createElement("div");

                        var cb = new ComboBox();
                        cb.addItem("None");
                        cb.addItem("Critical");
                        cb.addItem("Question");
                        cb.addItem("Error");
                        cb.addItem("Info");

                        var btnMakeMsgBox = new Button("Create MsgBox").node;
                        btnMakeMsgBox.onclick = function () {
                            switch (cb.selectedIndex) {
                            case 0:
                                MessageBox.show(txt1.value, txt2.value, 0);
                                break;
                            case 1:
                                MessageBox.showError(txt1.value, txt2.value);
                                break;
                            case 2:
                                MessageBox.showQuestion(txt1.value, txt2.value);
                                break;
                            case 3:
                                MessageBox.showWarning(txt1.value, txt2.value);
                                break;
                            case 4:
                                MessageBox.showInfo(txt1.value, txt2.value);
                                break;
                            default:
                                MessageBox.showInfo("Hi", "Select a type");
                                break;
                            }
                        }

                        makecont.appendChild(cb.node);
                        makecont.appendChild(btnMakeMsgBox);

                        f.addNode(txt1);
                        f.addNode(txt2);
                        f.addNode(makecont);

                        var tc = new Button("Close").node;
                        tc.style.cssFloat = "right";
                        tc.style.marginTop = "4px";
                        tc.onclick = function () { f.close(); };

                        f.addNode(tc);
                        f.show();
                        return 0;
                    }
                    case "shell:contests": {
                        var f = new Form();
                        var c = new Conhost();

                        var btnWrite = new Button("Write 'Test'").node;
                        btnWrite.onclick = function () {
                            c.write("Test");
                        }

                        f.addNode(btnWrite);
                        f.addNode(c.node);
                        f.show();
                        return 0;
                    }
                    case "shell:logoff": {
                        var f = new Form();
                        f.title = "Log Off Windows";
                        f.removeMinAndMaxButtons();
                        f.removeIcon();
                        f.setSize(288, 123);
                        f.setLocation(
                            (innerWidth / 2) - (288 / 2),
                            (innerHeight / 2) - (123)
                        );
                        f.node.onmousedown = f.titlebarNode.onmousedown = null;
                        f.node.style.zIndex = "8000001";
                        f.node.style.display = "block";

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
                        return 0;
                    }
                    default:
                        if (!console)
                            MessageBox.showError(file,
                                "The file \"" + file + "\" (or one of its components) \
cannot be found. Verify the path and the filename are correct, \
and all the libraries required are available.");
                        return 1;
                }
            }
        } else {
            if (!console)
                MessageBox.showError("Shell", "Empty command");
            return 2;
        }

        Startmenu.hide();
    }
}

/**
 * Registry.
 */

var Registry = {

}