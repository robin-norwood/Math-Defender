/*
   numberbutton.js - Prototype for the numberbutton

   Copyright (c) 2011 Robin Norwood <robin.norwood@gmail.com>
 */
"use strict";
var NumberButton = function (x, y, num) {
    this.origX = this.x = x;
    this.origY = this.y = y;

    this.num = num;
    this.color = "white";
};

NumberButton.prototype = {
    update: function (elapsed, state) {
        this.color = "white";
        this.x = this.origX;
        this.y = this.origY;

        var hovering = false;
        var pressed = false;
        var clicked = false;

        if (state.pointerpos.x > this.x - 50 &&
            state.pointerpos.x < this.x + 50 &&
            state.pointerpos.y > this.y - 125 &&
            state.pointerpos.y < this.y + 50) {
            hovering = true;
        }

        if (state.keysdown.indexOf(this.num) != -1) {
            pressed = true;
        }

        if (state.keyspressed.indexOf(this.num) != -1) {
            clicked = true;
        }

        if (hovering && state.pointerdown) {
            pressed = true;
        }

        if (hovering && state.pointerclicked) {
            clicked = true;
        }

        if (hovering || pressed || clicked) {
            this.color = "crimson";
        }

        if (pressed || clicked) {
            this.x += 4;
            this.y += 4;
        }

        if (clicked) {
            state.gamestate.digit = this.num;
        }

        return true;
    },
    render: function (screen) {
        screen.context.save();
        screen.context.strokeStyle = this.color;
        screen.context.fillStyle = this.color;
        screen.context.beginPath();
        screen.context.moveTo(this.x - 50, this.y - 125);
        screen.context.lineTo(this.x - 50, this.y + 50);
        screen.context.lineTo(this.x + 50, this.y + 50);
        screen.context.lineTo(this.x + 50, this.y - 125);
        screen.context.lineTo(this.x - 50, this.y - 125);
        screen.context.stroke();

        screen.context.font = 'bold 100px mono';
        screen.context.textAlign = 'center';
        screen.context.translate(this.x, this.y);
        screen.context.fillText(this.num, 0, 0);

        screen.context.restore();
    }
};