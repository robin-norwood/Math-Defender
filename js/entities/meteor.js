/*
   meteor.js - Prototype for meteors

   Copyright (c) 2013 Robin Norwood <robin.norwood@gmail.com>
 */
"use strict";
var Meteor = function (x, y, angle, speed, dist) {
    this.x = x;
    this.y = y;

    this.angle = angle;
    this.speed = speed;
    this.dist = dist;

    this.frames = 3;

    this.sprites = {
        0: new Sprite('meteor1', {w: 23, h: 24}, 0, this.frames),
        115: new Sprite('meteor2', {w: 31, h: 27}, 0, this.frames),
        230: new Sprite('meteor3', {w: 46, h: 31}, 0, this.frames),
        350: new Sprite('meteor4', {w: 55, h: 33}, 0, this.frames),
        465: new Sprite('meteor5', {w: 81, h: 36}, 0, this.frames),
        580: new Sprite('meteor6', {w: 90, h: 39}, 0, this.frames),
        695: new Sprite('meteor7', {w: 133, h: 39}, 0, this.frames),
        810: new Sprite('meteor8', {w: 151, h: 43}, 0, this.frames),
        925: new Sprite('meteor9', {w: 313, h: 52}, 0, this.frames)
    };

    this.meteorSprite = this.sprites[0];

    this.rot_threshold = 400;
    this.rot_current = 0;
    this.rot_phase = 0;

    this.die = false;

    this.log("METEOR INIT");
};

Meteor.prototype = {
    log: function (msg) {
        if (console) {
            console.log(msg);
        }
    },
    update: function (elapsed, state) {
        var alive = true;

        var dx = Math.cos(this.angle) * this.speed;
        var dy = Math.sin(this.angle) * this.speed;

        this.dist -= Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        this.x += dx;
        this.y += dy;

        if (this.dist <= 0) {
            this.log("METEOR BOOM");
            state.gamestate.explosion = new Explosion(this.x, this.y, 100, "yellow");

            alive = false;
        }

        if (elapsed) {
            this.rot_current += (elapsed * this.speed);
        }

        if (this.rot_current > this.rot_threshold) {
            this.rot_phase++;
            if (this.rot_phase >= this.frames) {
                this.rot_phase = 0;
            }
        }

        var self = this;

        $.each(self.sprites, function (height, sprite) {
            if (self.y > height) {
                self.meteorSprite = sprite;
            }
        });

        if (this.die) {
            alive = false;
        }

        return alive;
    },
    render: function (screen) {
        screen.context.save();
        screen.context.globalCompositeOperation = 'destination-over';
        screen.context.translate(this.x + 11, this.y + 12);
        screen.context.rotate(this.angle + Math.PI);
        screen.blit(this.meteorSprite, this.rot_phase, {x: -23, y: -24});
        screen.context.restore();
    }
};
