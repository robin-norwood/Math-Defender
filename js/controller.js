/*
   controller.js - Prototype for the controller object and launch code

   Copyright (c) 2011 Robin Norwood <robin.norwood@gmail.com>
 */
"use strict";

//
// shim layer with setTimeout fallback
// See http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function () {
    return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        window.mozRequestAnimationFrame    ||
        function(/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 30);
        };
})();

var Controller = function (game) {
    this.entities = {};
    this.state = {};
    this.game = game;

    var canvas = $('#game_canvas')[0];

    var config = this.game.initCallback(this);

    $(canvas).attr("width", 800); // Fixme: allow for zooming canvas
    $(canvas).attr("height", 600);

    this.screen = new Screen(canvas, config.width, config.height);

    this.bindEvents();

    var self = this; // 'this' inside animloop is not the Controller
    // Start animation loop
    function animloop() {
        var now = (new Date()).getTime();
        var elapsed = now - self.lastUpdateTime;
        self.lastUpdateTime = now;

        var cont = self.game.loopCallback(self, elapsed);

        self.update(elapsed, self.state); // update the state of all entities.

        self.render(self.screen); // draw all entities.

        if (cont) {
            requestAnimFrame(animloop); // repeat
        }
    };

    animloop();
};

Controller.prototype = {
    log: function (msg) {
        if (console) {
            console.log(msg);
        }
    },
    bindEvents: function () {
        var self = this;

        // Bind handlers
        $(this.canvas).bind('mousedown', function (e) { return self.startDrag(e); });
        $(this.canvas).bind('mouseup', function (e) { return self.stopDrag(e); });
        $(this.canvas).bind('mousemove', function (e) { return self.doDrag(e); });

        /* Thanks to http://www.sitepen.com/blog/2008/07/10/touching-and-gesturing-on-the-iphone/
         * for 'splaining this */

        $(this.canvas).bind('touchstart', function (e) { return self.startDrag(e); });
        $(this.canvas).bind('touchend', function (e) { return self.stopDrag(e); });
        $(this.canvas).bind('touchmove', function (e) { return self.doDrag(e); });

        $(this.canvas).bind('touchcancel', function (e) { return self.stopDrag(e); });

    },
    update: function (elapsed, state) {
        var updateEntity = function (entity) {
            return entity.update(elapsed, state);
        };

        Utils.deepGrep(updateEntity, this.entities);

        return;
    },
    render: function (context) {
        var screen = this.screen;
        screen.clear();

        var renderEntity = function (entity) {
            screen.context.save();
            entity.render(screen);
            screen.context.restore();

            return true;
        };

        Utils.deepGrep(renderEntity, this.entities);

        return;
    },
    startDrag: function (event) {
        var theObj = event;
        if (event.originalEvent.changedTouches) { // single touch for now.
            theObj = event.originalEvent.changedTouches[0];
        }

        this.clickPos = Utils.getRelPos(theObj, this.canvas);
        this.dragging = true;

        event.preventDefault();

        return false;
    },
    doDrag: function (event) {
        var theObj = event;
        if (event.originalEvent.changedTouches) {
            theObj = event.originalEvent.changedTouches[0];
        }

        var pos = Utils.getRelPos(theObj, this.canvas);

        event.preventDefault();
        return false;
    },
    stopDrag: function (event) {
        this.clickPos = {x: undefined, y: undefined};
        this.dragging = false;
        this.origAngle = undefined;

        event.preventDefault();
        return false;
    }
};
