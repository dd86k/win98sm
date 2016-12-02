"use strict";

/**
 * win98con.js, Console Host.
 * @author dd86k
 */

/**
 * Creates a new Console screen.
 */
function Conhost() {
    //var ref = this.thisRef = this;
    var o = this.obj = document.createElement("textarea");
    o.className = "conhost";
    o.readOnly = true;
    o.onkeydown = function (e) {

    };
}

Conhost.prototype = {
    thisRef: null,
    obj: null,

    Write: function (input) {
        obj.value += input;
    },

    Read: function () {

    }
}

/**
 * COMMAND.COM
 */

function Prompt(conhost) {
    this.host = conhost;
    this.obj = conhost.obj;


}

Prompt.prototype = {
    host: null,
    obj: null,
    cd: "C:\\",
    prompt: ">",

    printPrompt: function () {
        host.Write("Test");
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