/*
   editor.js - Prototype for the editing mode

   Copyright (c) 2011 Robin Norwood <robin.norwood@gmail.com>
 */
"use strict";

var Keyhandler = function () {
    this.shiftMap = {
        "1": "!",
        "2": "@",
        "3": "#",
        "4": "$",
        "5": "%",
        "6": "^",
        "7": "&",
        "8": "*",
        "9": "(",
        "0": ")",
        ";": ":",
        "=": "+",
        "`": "~",
        "-": "_",
        "[": "{",
        "]": "}",
        "\\": "|",
        "'": "\"",
        ",": "<",
        ".": ">",
        "/": "?"
    };

    this.keyMap = {
        109: "-",
        192: "`",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        219: "[",
        221: "]",
        220: "\\",
        222: "'",
        32: " ",
        37: "LEFT",
        38: "UP",
        39: "RIGHT",
        40: "DOWN",
        46: "DEL",
        8: "BACKSPACE",
        9: "TAB"
    };
};

Keyhandler.prototype = {
    log: function (msg) {
        if (console) {
            console.log(msg);
        }
    },
    eventToState: function (event, state) {
        if (event.altKey || event.ctrlKey) {
            return true; // don't intercept
        }
        event.preventDefault();

        var letter = "";
        if (event.which >= 48 && event.which <= 90) {
            letter = String.fromCharCode(event.which);
        }
        else if (event.which in this.keyMap) {
            letter = this.keyMap[event.which];
        }

        if (letter) {
            if (event.shiftKey) {
                if (this.shiftMap.hasOwnProperty(letter)) {
                    letter = this.shiftMap[letter];
                }
            }
            else {
                letter = letter.toLowerCase();
            }
        }

        if (event.type == 'keydown') {
            state.keysdown.push(letter);
        }
        if (event.type == 'keyup') {
            state.keysup.push(letter);
        }

        return false;
    }
};
