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

    }
}

/**
 * COMMAND.COM
 */

function Command() {
    var con = this.con = new Conhost();
    this.obj = this.con.obj;
    var tref = this;
    // Cheap hack.
    this.obj.onkeydown = function (e) {
        tref.readKey(e);
        if (con.echo)
            con.update();
    };

    con.writel();
    con.writel("Microsoft Windows(R)");
    con.writel("   (C)Copyright Microsoft Corp 1981-1998");
    con.writel();
    con.writel("Still in development. Prompt version " + this.version);
    this.printPrompt();
}

Command.prototype = {
    version: "0.0.0",
    con: null,
    obj: null,
    cd: "C:\\",
    /* PROMPT CHARACTER COMBINATIONS
    $Q    = (equal sign)
    $$    $ (dollar sign)
    $T    Current time
    $D    Current date
    $P    Current drive and path
    $V    MS-DOS
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
                break;
            case 13: // Enter
                var c = this.con.stdin;
                this.con.stdin = "";
                this.con.writel(c);
                this.execute(c);
                this.printPrompt();
                break;

            // Important keys
            case 37: // Left arrow key
            case 8: // Backspace
                if (this.con.stdin.length > 0)
                    this.con.stdin =
                        this.con.stdin.substring(0, this.con.stdin.length - 1);
                break;
            default:
                if (!(e.ctrlKey || e.metaKey || e.shiftKey || e.altKey))
                    this.con.stdin += e.key;
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

                case "exit":
                    this.con.form.close();
                    break;

                case "ver":
                    this.con.writel();
                    this.con.writel("Windows 98 [" + Project.version + "]");
                    this.con.writel("Prompt Version " + this.version +
                        ", Host: " + this.con.version);
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

    start: function () {
        
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