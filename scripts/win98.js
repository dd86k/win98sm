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
		get text () {
			return this.major + "." + this.minor + "." + this.revision;
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
	 * Execute.
	 * @param {string} command - "Virtual" command/file path
	 * @param {boolean} console - In console. 
	 * @returns {Number} Error code.
	 */
	run: function (command, console) {
		if (command == null || command.length == 0) {
			if (!console)
				MessageBox.showError("Shell", "Empty command");
			return 1;
		}

		if (/^(https?:\/\/)/i.test(command)) {
			//TODO: Web Browser
			return 0;
		}

		var s = command.split(" ", 128);
		//TODO: strip file extension
		var file = s[0].toLowerCase();
		switch (file) {
		case "command": case "command.com":
			return WinProgram.command();
		case "notepad": case "notepad.exe":
			return WinProgram.notepad();
		case "iexplore": case "iexplore.exe":
			return WinProgram.iexplore();
		case "shell:run":
			return WinProgram.shellrun();
		case "shell:about":
			return WinProgram.shellabout();
		case "shell:tests":
			return WinProgram.shelltests();
		case "shell:contests":
			return WinProgram.shelltermtests();
		case "shell:logoff":
			return WinProgram.shelllogoff();
		case "mspaint": case "mspaint.exe":
			return WinProgram.mspaint();
		case "msinfo32": case "msinfo32.exe":
			return WinProgram.msinfo32();
		default:
			if (!console)
				MessageBox.showError(command,
					"The file \"" + command + "\" (or one of its "+
					"components) cannot be found. Verify the path "+
					"and the filename are correct, and all the "+
					"libraries required are available."
				);
			return 1;
		}
	}
}

/**
 * Included Windows programs
 */
var WinProgram = {
	command: function() {
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
	},
	notepad: function() {
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
	},
	iexplore: function() {
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
	},
	shellrun: function() {
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
	},
	shellabout: function() {
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
			"Made from boredom." + dnl +
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
	},
	shelltests: function() {
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
	},
	shelltermtests: function() {
		var f = new Form();
		var c = new Conhost();
		var btnWrite = new Button("Write 'Test'").node;
		btnWrite.onclick = function () { c.write("Test"); }
		f.addNode(btnWrite);
		f.addNode(c.node);
		f.show();
		return 0;
	},
	shelllogoff: function() {
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
		f.node.style.zIndex = 8000001;
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
	},
	mspaint: function() {
		var f = new Form();
		f.title = "untitled - Paint";
		f.iconPath = "images/x16/mspaint.png";

		var clickX = new Array();
		var clickY = new Array();
		var clickDrag = new Array();
		var clickColor = new Array();
		var painting = false;
		var brushColor = "black";
		var a = document.createElement("canvas");
		a.style.display = "block";
		//a.style.backgroundColor = "white";
		var ca = a.getContext("2d");

		function addClick(x, y, dragging) {
			clickX.push(x);
			clickY.push(y);
			clickDrag.push(dragging);
			clickColor.push(brushColor);
		}

		function redraw() {
			ca.clearRect(0, 0, ca.width, ca.height);
						
			for (var i = 0; i < clickX.length; i++) {		
				ca.beginPath();
				if (clickDrag[i] && i) {
					ca.moveTo(clickX[i - 1], clickY[i - 1]);
				} else {
					ca.moveTo(clickX[i] - 1, clickY[i]);
				}
				ca.lineTo(clickX[i], clickY[i]);
				ca.closePath();
				ca.strokeStyle = clickColor[i];
				ca.stroke();
			}
		}

		function fill(style) {
			ca.beginPath();
			ca.rect(0, 0, a.width, a.height);
			ca.fillStyle = style;
			ca.fill();
		}

		a.onmousedown = function (e) {
			painting = true;
			addClick(e.layerX, e.layerY);
			redraw();
		};
		a.onmousemove = function (e) {
			if (painting) {
				addClick(e.layerX, e.layerY, true);
				redraw();
			}
		};
		a.onmouseup = function (e) {
			painting = false;
		};

		var cpContainer = document.createElement("div");
		var cpMain = document.createElement("div");
		var cpSecond = document.createElement("div");
		
		cpContainer.appendChild(cpMain);
		cpContainer.appendChild(cpSecond);

		var rowc1 = document.createElement("div");
		var rowc2 = document.createElement("div");
		rowc2.style.margin = rowc1.style.margin = "0";
		rowc2.style.height = rowc1.style.height = "13px";

		// First color row
		var cBlack = document.createElement("div");
		cBlack.style.backgroundColor = "black";
		cBlack.style.height = "13px";
		cBlack.style.width = "13px";
		cBlack.style.display = "inline-block";
		cBlack.onclick = function () {
			brushColor = "black";
		};
		var cGray = document.createElement("div");
		cGray.style.backgroundColor = "#808080";
		cGray.style.height = "13px";
		cGray.style.width = "13px";
		cGray.style.display = "inline-block";
		cGray.onclick = function () {
			brushColor = "#808080";
		};
		var cDarkRed = document.createElement("div");
		cDarkRed.style.backgroundColor = "#800000";
		cDarkRed.style.height = "13px";
		cDarkRed.style.width = "13px";
		cDarkRed.style.display = "inline-block";
		cDarkRed.onclick = function () {
			brushColor = "#800000";
		};
		var cOlive = document.createElement("div");
		cOlive.style.backgroundColor = "#808000";
		cOlive.style.height = "13px";
		cOlive.style.width = "13px";
		cOlive.style.display = "inline-block";
		cOlive.onclick = function () {
			brushColor = "#808000";
		};
		var cDarkGreen = document.createElement("div");
		cDarkGreen.style.backgroundColor = "#008000";
		cDarkGreen.style.height = "13px";
		cDarkGreen.style.width = "13px";
		cDarkGreen.style.display = "inline-block";
		cDarkGreen.onclick = function () {
			brushColor = "#008000";
		};
		var cTeal = document.createElement("div");
		cTeal.style.backgroundColor = "#008080";
		cTeal.style.height = "13px";
		cTeal.style.width = "13px";
		cTeal.style.display = "inline-block";
		cTeal.onclick = function () {
			brushColor = "#008080";
		};
		var cDarkBlue = document.createElement("div");
		cDarkBlue.style.backgroundColor = "#000080";
		cDarkBlue.style.height = "13px";
		cDarkBlue.style.width = "13px";
		cDarkBlue.style.display = "inline-block";
		cDarkBlue.onclick = function () {
			brushColor = "#000080";
		};
		var cPurple = document.createElement("div");
		cPurple.style.backgroundColor = "#800080";
		cPurple.style.height = "13px";
		cPurple.style.width = "13px";
		cPurple.style.display = "inline-block";
		cPurple.onclick = function () {
			brushColor = "#800080";
		};
		var cHighball = document.createElement("div");
		cHighball.style.backgroundColor = "#808040";
		cHighball.style.height = "13px";
		cHighball.style.width = "13px";
		cHighball.style.display = "inline-block";
		cHighball.onclick = function () {
			brushColor = "#808040";
		};
		var cCyprus = document.createElement("div");
		cCyprus.style.backgroundColor = "#004040";
		cCyprus.style.height = "13px";
		cCyprus.style.width = "13px";
		cCyprus.style.display = "inline-block";
		cCyprus.onclick = function () {
			brushColor = "#004040";
		};
		var cDodgerBlue = document.createElement("div");
		cDodgerBlue.style.backgroundColor = "#0080FF";
		cDodgerBlue.style.height = "13px";
		cDodgerBlue.style.width = "13px";
		cDodgerBlue.style.display = "inline-block";
		cDodgerBlue.onclick = function () {
			brushColor = "#0080FF";
		};
		var cDarkCerulean = document.createElement("div");
		cDarkCerulean.style.backgroundColor = "#004080";
		cDarkCerulean.style.height = "13px";
		cDarkCerulean.style.width = "13px";
		cDarkCerulean.style.display = "inline-block";
		cDarkCerulean.onclick = function () {
			brushColor = "#004080";
		};
		var cHanPurple = document.createElement("div");
		cHanPurple.style.backgroundColor = "#4000FF";
		cHanPurple.style.height = "13px";
		cHanPurple.style.width = "13px";
		cHanPurple.style.display = "inline-block";
		cHanPurple.onclick = function () {
			brushColor = "#4000FF";
		};
		var cBrown = document.createElement("div");
		cBrown.style.backgroundColor = "#804000";
		cBrown.style.height = "13px";
		cBrown.style.width = "13px";
		cBrown.style.display = "inline-block";
		cBrown.onclick = function () {
			brushColor = "#804000";
		};
		
		rowc1.appendChild(cBlack);
		rowc1.appendChild(cGray);
		rowc1.appendChild(cDarkRed);
		rowc1.appendChild(cOlive);
		rowc1.appendChild(cDarkGreen);
		rowc1.appendChild(cTeal);
		rowc1.appendChild(cDarkBlue);
		rowc1.appendChild(cPurple);
		rowc1.appendChild(cHighball);
		rowc1.appendChild(cCyprus);
		rowc1.appendChild(cDodgerBlue);
		rowc1.appendChild(cDarkCerulean);
		rowc1.appendChild(cHanPurple);
		rowc1.appendChild(cBrown);
		// Second color row
		var cWhite = document.createElement("div");
		cWhite.style.backgroundColor = "white";
		cWhite.style.height = "13px";
		cWhite.style.width = "13px";
		cWhite.style.display = "inline-block";
		cWhite.onclick = function () {
			brushColor = "white";
		};
		var cLightGray = document.createElement("div");
		cLightGray.style.backgroundColor = "#C0C0C0";
		cLightGray.style.height = "13px";
		cLightGray.style.width = "13px";
		cLightGray.style.display = "inline-block";
		cLightGray.onclick = function () {
			brushColor = "#C0C0C0";
		};
		var cRed = document.createElement("div");
		cRed.style.backgroundColor = "#FF0000";
		cRed.style.height = "13px";
		cRed.style.width = "13px";
		cRed.style.display = "inline-block";
		cRed.onclick = function () {
			brushColor = "#FF0000";
		};
		var cYellow = document.createElement("div");
		cYellow.style.backgroundColor = "#FFFF00";
		cYellow.style.height = "13px";
		cYellow.style.width = "13px";
		cYellow.style.display = "inline-block";
		cYellow.onclick = function () {
			brushColor = "#FFFF00";
		};
		var cLime = document.createElement("div");
		cLime.style.backgroundColor = "#00FF00";
		cLime.style.height = "13px";
		cLime.style.width = "13px";
		cLime.style.display = "inline-block";
		cLime.onclick = function () {
			brushColor = "#00FF00";
		};
		var cCyan = document.createElement("div");
		cCyan.style.backgroundColor = "#00FFFF";
		cCyan.style.height = "13px";
		cCyan.style.width = "13px";
		cCyan.style.display = "inline-block";
		cCyan.onclick = function () {
			brushColor = "#00FFFF";
		};
		var cBlue = document.createElement("div");
		cBlue.style.backgroundColor = "#0000FF";
		cBlue.style.height = "13px";
		cBlue.style.width = "13px";
		cBlue.style.display = "inline-block";
		cBlue.onclick = function () {
			brushColor = "#0000FF";
		};
		var cPink = document.createElement("div");
		cPink.style.backgroundColor = "#FF00FF";
		cPink.style.height = "13px";
		cPink.style.width = "13px";
		cPink.style.display = "inline-block";
		cPink.onclick = function () {
			brushColor = "#FF00FF";
		};
		var cWitchHaze = document.createElement("div");
		cWitchHaze.style.backgroundColor = "#FFFF80";
		cWitchHaze.style.height = "13px";
		cWitchHaze.style.width = "13px";
		cWitchHaze.style.display = "inline-block";
		cWitchHaze.onclick = function () {
			brushColor = "#FFFF80";
		};
		var cSpringGreen = document.createElement("div");
		cSpringGreen.style.backgroundColor = "#00FF80";
		cSpringGreen.style.height = "13px";
		cSpringGreen.style.width = "13px";
		cSpringGreen.style.display = "inline-block";
		cSpringGreen.onclick = function () {
			brushColor = "#00FF80";
		};
		var cElectricBlue = document.createElement("div");
		cElectricBlue.style.backgroundColor = "#80FFFF";
		cElectricBlue.style.height = "13px";
		cElectricBlue.style.width = "13px";
		cElectricBlue.style.display = "inline-block";
		cElectricBlue.onclick = function () {
			brushColor = "#80FFFF";
		};
		var cLightSlateBlue = document.createElement("div");
		cLightSlateBlue.style.backgroundColor = "#8080FF";
		cLightSlateBlue.style.height = "13px";
		cLightSlateBlue.style.width = "13px";
		cLightSlateBlue.style.display = "inline-block";
		cLightSlateBlue.onclick = function () {
			brushColor = "#8080FF";
		};
		var cDeepPink = document.createElement("div");
		cDeepPink.style.backgroundColor = "#FF0080";
		cDeepPink.style.height = "13px";
		cDeepPink.style.width = "13px";
		cDeepPink.style.display = "inline-block";
		cDeepPink.onclick = function () {
			brushColor = "#FF0080";
		};
		var cCoral = document.createElement("div");
		cCoral.style.backgroundColor = "#FF8040";
		cCoral.style.height = "13px";
		cCoral.style.width = "13px";
		cCoral.style.display = "inline-block";
		cCoral.onclick = function () {
			brushColor = "#FF8040";
		};

		rowc2.appendChild(cWhite);
		rowc2.appendChild(cLightGray);
		rowc2.appendChild(cRed);
		rowc2.appendChild(cYellow);
		rowc2.appendChild(cLime);
		rowc2.appendChild(cCyan);
		rowc2.appendChild(cBlue);
		rowc2.appendChild(cPink);
		rowc2.appendChild(cWitchHaze);
		rowc2.appendChild(cSpringGreen);
		rowc2.appendChild(cElectricBlue);
		rowc2.appendChild(cLightSlateBlue);
		rowc2.appendChild(cDeepPink);
		rowc2.appendChild(cCoral);

		fill("white");

		f.addNode(a);
		f.addNode(rowc1);
		f.addNode(rowc2);
		f.addNode(cpContainer);
		f.show();
		return 0;
	},
	msinfo32: function() {
		var f = new Form();
		f.title = "System Info";
		var s = document.createElement("p");
		s.innerText = "OS: " + navigator.platform + "\n" +
			"Vendor: " + navigator.vendor;
		f.addNode(s);
		f.show();
		return 0;
	},
}