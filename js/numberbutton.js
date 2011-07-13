/*
   numberbutton.js - Prototype for the numberbutton

   Copyright (c) 2011 Robin Norwood <robin.norwood@gmail.com>
 */
"use strict";
var NumberButton = function (x, y, num) {
    this.x = x;
    this.y = y;

    this.num = num;
};

NumberButton.prototype = {
    update: function (elapsed, state) {
        if (this.num in state.keysdown) {
            console.log("KEYSDOWN: " + state.keysdown);
        }
        if (this.num in state.keysup) {
            console.log("KEYSUP: " + state.keysup);
        }
        return true;
    },
    render: function (screen) {
        screen.context.save();
        screen.context.font = 'bold 100px mono';
        screen.context.textAlign = 'center';
        screen.context.fillStyle = 'white';
        screen.context.translate(this.x, this.y);
        screen.context.fillText(this.num, 0, 0);
        screen.context.restore();
    }
};