/*
   explosion.js - Prototype for missiles

   Copyright (c) 2011 Robin Norwood <robin.norwood@gmail.com>
 */
"use strict";
var Explosion = function (x, y, maxRadius, color) {
    this.x = x;
    this.y = y;
    this.radius = 1;

    this.speed = 2;
    this.maxRadius = maxRadius || 150;
    this.color = color || "red";

    this.log("EXPLOSION INIT");
};

Explosion.prototype = {
    log: function (msg) {
        if (console) {
            console.log(msg);
        }
    },
    update: function (elapsed, state) {
	this.radius += this.speed;

	if (this.radius > this.maxRadius) {
	    return false;
	}

	return true;
    },
    render: function (screen) {
        screen.context.save();
        screen.context.globalCompositeOperation = 'destination-under';
	screen.context.fillStyle = this.color;
	screen.context.strokeStyle = this.color;
	screen.context.beginPath();
	screen.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
	screen.context.fill();
        screen.context.restore();
    }
};
