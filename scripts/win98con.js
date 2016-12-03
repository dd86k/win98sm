"use strict";

/**
 * win98con.js, Console Host.
 * @author dd86k
 */

/**
 * Creates a new Console screen. Inline only. Unicolor.
 */
function Conhost() {
    var tref = this.thisRef = this;
    var o = this.obj = document.createElement("textarea");
    o.className = "conhost";
    o.readOnly = true;
    o.onkeydown = function (e) {
        tref.readKey(e);
        if (tref.echo)
            o.value = o.value + this.readBuf;
    };
}

Conhost.prototype = {
    thisRef: null,
    obj: null,
    rbuf: "",
    echo: true,

    readKey: function (e) {
        e = e || window.event;
        console.log(e);
        var c = e.keyCode;
        console.log(c);
        switch (c) {
            // Blacklist
            case 37: case 38: case 39: case 40: // Arrow keys
                break;
            // Important keys
            case 8: // Backspace
                this.rbuf = this.rbuf.substring(0, this.rbuf.length - 1);
                break;
            default:
                if (c !== undefined)
                    this.rbuf += String.fromCharCode(c);
                console.log(this.rbuf);
                break;
        }
    },

    write: function (input) {
        this.obj.value += input;
    },

    writel: function (input) {
        this.obj.value += input + '\n';
    },

    read: function () {

    }
}

/**
 * COMMAND.COM
 */

function Prompt(host) {
    this.host = host;
    this.obj = conhost.obj;

    host.writel("Still in development.");
    host.writel("Still in development.");
    host.writel("Still in development.");
}

Prompt.prototype = {
    con: null,
    obj: null,
    cd: "C:\\",
    prompt: ">",

    start: function () {
        
    },

    printPrompt: function () {
        con.write("Test");
    }
}



function getColor(hex)
{
    hex = hex.toLowerCase();

    switch (hex)
    {
        case "0": return "#000000"; // black
        case "1": return "#000080"; // blue
        case "2": return "#008000"; // green
        case "3": return "#008080"; // aqua
        case "4": return "#FF0000"; // red
        case "5": return "#800080"; // purple
        case "6": return "#808000"; // yellow
        case "7": return "#C0C0C0"; // white
        case "8": return "#808080"; // gray
        case "9": return "#0000FF"; // light blue
        case "A":
        case "a": return "#00FF00"; // light green
        case "B":
        case "b": return "#00FFFF"; // light aqua
        case "C":
        case "c": return "#FF0000"; // light red
        case "D":
        case "d": return "#FF00FF"; // light purple
        case "E":
        case "e": return "#FFFF00"; // light yellow
        case "F":
        case "f": return "#FFFFFF"; // bright white
    }
}