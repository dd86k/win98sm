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
}

Conhost.prototype = {
    version: "0.1.0",
    // 'this', textarea, and form references.
    thisRef: null, obj: null, form: null,
    stdin: "", stdout: "",
    echo: true,

    read: function () {

    },

    readLine: function () {

    },

    write: function (input) {
        this.stdout += input;
        this.update();
        this.obj.scrollTop = this.obj.scrollHeight;
    },

    writel: function (input) {
        if (input != undefined)
            this.stdout += input + '\n';
        else
            this.stdout += '\n';

        this.update();
        this.obj.scrollTop = this.obj.scrollHeight;
    },

    clearIn: function () {
        this.stdin = "";
        this.update();
    },

    clearOut: function () {
        this.stdout = "";
        this.update();
    },

    /**
     * Change console color.
     * @param {string} fg - Foreground (HEX).
     * @param {string} bg - Background (HEX).
     */
    changeColorHex: function (fg, bg) {

    },

    update: function () {
        this.obj.value = this.stdout + this.stdin;
    },

    /**
     * Exit with error code.
     * @param {number} e - Errorcode.
     */
    exit: function (e) {
        this.form.close();
    }
}

/**
 * COMMAND.COM
 */

function Command() {
    var c = this.con = new Conhost();
    this.obj = c.obj;
    var tref = this;
    // Cheap hack.
    c.obj.onkeydown = function (e) {
        tref.readKey(e);
        con.update();
        return false;
    };

    c.writel();
    c.writel("Microsoft Windows(R)");
    c.writel("   (C)Copyright Microsoft Corp 1981-1998");
    c.writel();
    c.writel("Prompt version " + this.version);
    this.printPrompt();
}

Command.prototype = {
    version: "0.1.0",
    con: null,
    cd: "C:\\",
    /* PROMPT CHARACTER COMBINATIONS
    $Q    = (equal sign)
    $$    $ (dollar sign)
    $T    Current time
    $D    Current date
    $P    Current drive and path
    $V    MS-DOS version
    $N    Current drive
    $G    > (greater-than sign)
    $L    < (less-than sign)
    $B    | (pipe)
    $_    ENTER-LINEFEED
    $E    ASCII escape code (code 27)
    $H    Backspace (to delete a character that has been written to the
          prompt command line)
    */
    prompt: "$P$G",

    // Cheap hack.
    readKey: function (e) {
        e = e || window.event;
        switch (e.keyCode) {
            // Blacklist
            case 38: case 39: case 40: // Arrow keys
            case 9: // Tab
            case 20: // Caps
            case 112: case 113: case 114: case 115: // F1-F4
            case 116: case 117: case 118: case 119: // F5-F8
            case 120: case 121: case 122: case 123: // F9-F12
            case 144: // Numlock
            case 145: case 19: // Scroll and Pause
            // Shift, Ctrl, Alt, Left and Right Meta
            case 16: case 17: case 18: case 91: case 92:
                break;
            case 13: // Enter
                var c = this.con.stdin;
                if (c.length > 0)
                {
                    this.con.stdin = "";
                    this.con.writel(c);
                    this.execute(c);
                    this.printPrompt();
                }
                else
                {
                    this.printPrompt();
                }
                break;

            // Important keys
            case 37: // Left arrow key
            case 8: // Backspace
                if (this.con.stdin.length > 0)
                    this.con.stdin =
                        this.con.stdin.substring(0, this.con.stdin.length - 1);
                break;
            default:
                if (e.shiftKey)
                {
                    if (e.keyCode >= 0x41 && e.keyCode <= 0x5A)
                        this.con.stdin += String.fromCharCode(e.keyCode);
                    else 
                        this.con.stdin += e.key;
                }
                else
                {
                    if (e.keyCode == 0x20)
                        this.con.stdin += " "; // IE11 fix
                    else
                        this.con.stdin += e.key;
                }
                break;
        }
    },

    /**
     * Execute a command.
     * @param {string} c - Input.
     */
    execute: function (c) {
        if (c != undefined && c != null && c.length > 0)
        {
            var s = c.split(" ");
            switch (s[0].toLowerCase())
            {
                // Internal commands

                case "echo":
                    if (s.length > 1)
                        this.con.writel(c.substring(5));
                    else
                        this.con.writel("ECHO is " + (this.con.echo ? "on" : "off"));
                    break;

                case "chcp":
                    this.con.writel("Active code page: ???");
                    break;

                case "cls":
                    this.con.stdin = "";
                    this.con.stdout = "";
                    this.con.update();
                    break;

                case "date":
                    this.con.writel("Current date is " + new Date().toDateString());
                    break;

                case "exit":
                    this.con.exit();
                    break;

                case "help":
                    this.con.writel("Good luck.");
                    break;

                case "time":
                    this.con.writel("Current time is " + new Date().toTimeString());
                    break;

                case "spin":
                    var fref = this.con.form.obj;
                    fref.style.animation = "spin 1s";
                    setTimeout(function () {
                        fref.style.animation = null;
                    }, 1000);
                    break;

                case "rem": break;

                case "ver":
                    this.con.writel();
                    this.con.writel("Windows 98 [Version " + Project.version + "]");
                    this.con.writel("Prompt Version " + this.version +
                        ", Host: " + this.con.version);
                    this.con.writel();
                    break;

                case "vol":
                    this.con.writel();
                    this.con.writel(" Volume in C is WIN98");
                    this.con.writel(" Volume Serial Numner is 497D-039A");
                    this.con.writel();
                    break;

                // External commands
                default:
                if (Shell.run(s[0], null, true) != 0)
                    this.con.writel("Bad command or file name");
                break;
            }
        }
    },

    printPrompt: function () {
        this.con.writel();
        this.con.write("C:\\>"); // Temporary
    }
}



function getColor(hex)
{
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
        case "A": case "a": return "#00FF00"; // light green
        case "B": case "b": return "#00FFFF"; // light aqua
        case "C": case "c": return "#FF0000"; // light red
        case "D": case "d": return "#FF00FF"; // light purple
        case "E": case "e": return "#FFFF00"; // light yellow
        case "F": case "f": return "#FFFFFF"; // bright white
    }
}