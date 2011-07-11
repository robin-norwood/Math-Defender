/*
   screen.js - Base class for screen.

   Copyright (c) 2011 Robin Norwood <robin.norwood@gmail.com>
 */

"use strict";
var Screen = function (canvas, width, height) {
    this._canvas = canvas;
    this.context = canvas.getContext("2d");

    this.setSize(width, height);
};

Screen.prototype = {
    blit: function (sprite, frameNum, loc, size) {
        // Blit a sprite onto the current context.
        //
        // sprite: Sprite object
        // frameNum: Which frame of the sprite to use
        // loc: Target location of Sprite image on the canvas
        // size: Final size of the image (optional, defaults to sprite size)
        if (!size) {
            size = {w: sprite.w, h:sprite.h};
        }
        this.context.drawImage(sprite.src_img,
                               sprite.frames[frameNum].x,
                               sprite.frames[frameNum].y,
                               sprite.w,
                               sprite.h,
                               loc.x,
                               loc.y,
                               size.w,
                               size.h
                              );
    },
    clear: function () {
        this.context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    },
    setSize: function (width, height) {
        var x_factor = this._canvas.width / width;
        var y_factor = this._canvas.height / height;

        this.context.scale(x_factor, y_factor);
    }
};
