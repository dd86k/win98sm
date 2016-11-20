"use strict";

/**
 * win98.js, Operating System.
 * @author guitarxhero
 */

/* TODOs:
- Start menu new design (HTML) for submenus:
<div class="smi">
  <img/><span>Test</span>
  <div class="smsm">
    <div class="smsi">
      <img/><span>Test</span>
    </div>
  </div>
</div>
- win98wsh.js (Windows Scripting Host)
- IE4 (iexplore)
*/

/**
 * Project properties.
 */
var Project = {
    productName: "Windows 98 WebSim",
    version: "0.4.0-dev"
};

function start() {
    desktopversion.innerHTML =
        Project.productName + " " + Project.version;
    updateTime();
}

onload = start;

/*
 * Time.
 */

function updateTime() {
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    
    var t = "";
    
    if (hours > 12) {
        t += "PM";
        hours = hours - 12;
    } else if (hours == 12) {
        t += "PM";
    } else {
        t += "AM";
    }
    
    time.innerHTML = hours + ":" + minutes + " " + t;
}

setInterval(updateTime, 10000);

/*
 * A program.
 */



/**
 * Utilities.
 */

var Utils = {
    /**
     * Returns a random number from 0 to max.
     * @param {number} max Maximum number, excluded.
     * @returns A random number.
     */
    r: function (max) {
        return Math.random() * max;
    }
}

/*
 * Generic prototyping.
 */

// StackOverflow solution by Johan Dettmar
Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};

/**
 * Shell.
 */

var Shell = {
    /**
     * Run a file.
     * @param {string} path The virtual path to the file.
     * @returns {boolean} True if found.
     */
    run: function(command) {
        if (command != null && command.length > 0) {
            var s = command.split(" ", 128);
            switch (s[0].toLowerCase()) {
                case "command":
                    WindowManager.createWindow('MS-DOS Prompt',Utils.r(200),Utils.r(200),'cmd');
                    return true;
                case "notepad": case "notepad.exe":
                    WindowManager.createWindow(
                        'Untitled - Notepad',Utils.r(200),Utils.r(200),'notepad');
                    return true;
                case "rundialog":
                    WindowManager.createWindow('Run',150,50,'rundialog');
                    return true;
                case "aboutdialog": case "aboutdialog.exe":
                    WindowManager.createWindow('About',150,50,'aboutdialog');
                    return true;
                default:
                    WindowManager.showError(command,
                        "The file \"" + command + "\" (or one of its components) cannot \
                        be found. Verify the path and the filename are correct, \
                        and all the libraries required are available.");
                    return false;
            }
        }
        else WindowManager.showError("Shell", "Empty command");
    }
}

/**
 * Registry.
 */

var Registry = {

}