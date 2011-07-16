/*
   field.js - prototype for firing field

   Copyright (c) 2011 Robin Norwood <robin.norwood@gmail.com>
 */
"use strict";
var Field = function (x0, y0, x1, y1) {
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;

    this.pointerOver = true;
};

Field.prototype = {
    log: function (msg) {
        if (console) {
            console.log(msg);
        }
    },
    update: function (elapsed, state) {
        if (state.pointerpos.x > this.x0 &&
            state.pointerpos.x < this.x1 &&
            state.pointerpos.y > this.y0 &&
            state.pointerpos.y < this.y1) {
            this.pointerOver = true;
        }
        else {
            this.pointerOver = false;
        }

        if (this.pointerOver && state.pointerclicked) {
            state.gamestate.fireLauncher = true;
        }
        return true;
    },
    render: function (screen) {
        var body = document.body;
        if (this.pointerOver && body.style.cursor != 'crosshair') {
            body.style.cursor = 'crosshair';
        } else if (!this.pointerOver && body.style.cursor == 'crosshair') {
            body.style.cursor = 'default';
        }
        return true;
    }
};