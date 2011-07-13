/*
   defender.js - Prototype for the controller object and launch code

   Copyright (c) 2011 Robin Norwood <robin.norwood@gmail.com>
 */
"use strict";
var Launcher = function (x, y) {
    this.x = x;
    this.y = y;

    this.angle = Math.PI;
    this.launcherSprite = new Sprite('launcher', {w: 80, h: 80}, 0, 1);
    this.gunSprite = new Sprite('gun', {w: 26, h: 60}, 0, 1);
};

Launcher.prototype = {
    update: function (elapsed, state) {
        return true;
    },
    render: function (screen) {
        screen.context.save();
        screen.context.translate(this.x + 40, this.y + 60);
        screen.context.rotate(this.angle);
        screen.blit(this.gunSprite, 0, {x: -13, y: 0});
        screen.context.restore();
        screen.blit(this.launcherSprite, 0, {x: this.x, y: this.y + 40});
    },
    findSlot: function (launchers) {
    }
};