/*
   missile.js - Prototype for missiles

   Copyright (c) 2011 Robin Norwood <robin.norwood@gmail.com>
 */
"use strict";
var Missile = function (x, y, angle, speed, dist) {
    this.x = x;
    this.y = y;

    this.angle = angle;
    this.speed = speed;
    this.dist = dist;

    this.missileSprite = new Sprite('missile', {w: 40, h: 95}, 0, 1);

    this.log("MISSILE INIT");
};

Missile.prototype = {
    log: function (msg) {
        if (console) {
            console.log(msg);
        }
    },
    update: function (elapsed, state) {
        var dx = Math.cos(this.angle) * this.speed;
        var dy = Math.sin(this.angle) * this.speed;

        this.dist -= Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        this.x += dx;
        this.y += dy;

        if (this.dist > 0) {
            return true;
        }
        else {
            this.log("MISSILE BOOM");
            return false;
        }
    },
    render: function (screen) {
        screen.context.save();
        screen.context.globalCompositeOperation = 'destination-over';
        screen.context.translate(this.x + 40, this.y + 60);
        screen.context.rotate(this.angle + Math.PI/2);
        screen.blit(this.missileSprite, 0, {x: -20, y: -45});
        screen.context.restore();
    }
};