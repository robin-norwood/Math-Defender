/*
   defender.js - Prototype for the controller object and launch code

   Copyright (c) 2011 Robin Norwood <robin.norwood@gmail.com>
 */
"use strict";
var Star = function (box) {
    this.x = Math.floor(Math.random()*box.starsAcross)*56 + box.offsetX;
    this.y = Math.floor(Math.random()*box.starsDown)*56 + box.offsetY;

    this.angle = Math.random() * 2 * Math.PI;
    this.sprite = new Sprite('star', {w: 56, h: 56}, 0, 1);
};

Star.prototype = {
    update: function (elapsed, state) {
        return true;
    },
    render: function (screen) {
        screen.context.translate(this.x + 28, this.y + 28);
        screen.context.rotate(this.angle);
        screen.blit(this.sprite, 0, {x: -28, y: -28}, {w: 14, h: 14});
    },
    findSlot: function (stars) {
    }
};
