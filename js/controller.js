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
    this.state = { "keysdown": [],
                   "keyspressed": [],
                   "pointerpos": {x: -1, y: -1},
                   "pointerdown": false,
                   "pointerclicked": false,
                   "gamestate": {}
                 };

    this.game = game;
    this.keyhandler = new Keyhandler();

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

        self.state = { "keysdown": self.state.keysdown,
                       "keyspressed": [],
                       "pointerpos": self.state.pointerpos,
                       "pointerdown": self.state.pointerdown,
                       "pointerclicked": false,
                       "gamestate": self.state.gamestate
                     };

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
        $(this.screen._canvas).bind('mousedown', function (e) { return self.mouseDown(e); });
        $(this.screen._canvas).bind('mousemove', function (e) { return self.mouseMove(e); });
        $(this.screen._canvas).bind('mouseup', function (e) { return self.mouseUp(e); });
        $(this.screen._canvas).bind('mouseout', function (e) { return self.mouseOut(e); });

        /* Thanks to http://www.sitepen.com/blog/2008/07/10/touching-and-gesturing-on-the-iphone/
         * for 'splaining this */

        $(this.screen._canvas).bind('touchstart', function (e) { return self.touchStart(e); });
        $(this.screen._canvas).bind('touchmove', function (e) { return self.touchMove(e); });
        $(this.screen._canvas).bind('touchend', function (e) { return self.touchEnd(e); });

        $(this.screen._canvas).bind('touchcancel', function (e) { return self.touchCancel(e); });

        $(window).bind('keydown', function (e) { return self.key(e); });
        $(window).bind('keyup', function (e) { return self.key(e); });
    },
    update: function (elapsed, state) {
        var updateEntity = function (entity) {
            return entity.update(elapsed, state);
        };

        Utils.deepGrep(updateEntity, this.entities);

        return;
    },
    render: function () {
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
    key: function (event) {
        return this.keyhandler.eventToState(event, this.state);
    },
    mouseDown: function (event) {
        this.state.pointerdown = true;

        event.preventDefault();
        return false;
    },
    mouseMove: function (event) {
        this.state.pointerpos = this.screen.getPos(event);

        event.preventDefault();
        return false;
    },
    mouseUp: function (event) {
        if (this.state.pointerdown) {
            this.state.pointerclicked = true;
            this.state.pointerdown = false;
        }

        event.preventDefault();
        return false;
    },
    mouseOut: function (event) {
        this.state.pointerdown = false;

        event.preventDefault();
        return false;
    },
    touchStart: function (event) {
        var theTouch = event.originalEvent.changedTouches[0];

        this.state.pointerpos = this.screen.getPos(theTouch);
        this.state.pointerdown = true;

        event.preventDefault();
        return false;
    },
    touchMove: function (event) {
        var theTouch = event.originalEvent.changedTouches[0];

        this.state.pointerpos = this.screen.getPos(theTouch);

        event.preventDefault();
        return false;
    },
    touchEnd: function (event) {
        this.state.pointerdown = false;
        this.state.pointerclicked = true;

        event.preventDefault();
        return false;
    },
    touchCancel: function (event) {
        this.state.pointerdown = false;

        event.preventDefault();
        return false;
    }
};
