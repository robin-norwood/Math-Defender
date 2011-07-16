/*
   defender.js - Prototype for the controller object and launch code

   Copyright (c) 2011 Robin Norwood <robin.norwood@gmail.com>
 */
"use strict";
var Launcher = function (x, y) {
    this.x = x;
    this.y = y;

    this.angle = 0;
    this.launcherSprite = new Sprite('launcher', {w: 80, h: 80}, 0, 1);
    this.gunSprite = new Sprite('gun', {w: 28, h: 60}, 0, 2);

    this.active = false; // The active launcher is the next to fire
    this.ready = false; // The ready launcher is the next to load
    this.loaded = false; // A loaded launcher is a candidate to become active
};

Launcher.prototype = {
    log: function (msg) {
        if (console) {
            console.log(msg);
        }
    },
    update: function (elapsed, state) {
        if (this.active && state.keyspressed.indexOf(" ") != -1) { // ... mouse click in proper area
            this.log("FIRE");
            this.fire(state);
        }

        if (this.active && state.gamestate.inactivateLauncher) {
            state.gamestate.inactivateLauncher = false;
            this.active = false;
        }

        if (state.gamestate.prepareLauncher && !(this.ready || this.loaded) ) {
            state.gamestate.prepareLauncher = false;
            state.gamestate.resetEquation = true;
            this.ready = true;
            this.log("READY");
        }

        if (state.gamestate.loadLauncher && this.ready) {
            state.gamestate.loadLauncher = false;
            this.ready = false;
            this.loaded = true;
            state.gamestate.prepareLauncher = true;
            this.log("LOADED");
        }

        if (state.gamestate.activateLauncher && this.loaded) {
            state.gamestate.activateLauncher = false;
            this.active = true;
            this.log("ACTIVE");
        }

        return true;
    },
    render: function (screen) {
        screen.context.save();
        screen.context.translate(this.x + 40, this.y + 60);
        screen.context.rotate(this.angle);

        var whichGun = 0;
        if (this.loaded) {
            whichGun = 1;
        }

        screen.blit(this.gunSprite, whichGun, {x: -13, y: -60});
        screen.context.restore();
        screen.blit(this.launcherSprite, 0, {x: this.x, y: this.y + 40});
    },
    fire: function (state) {
        this.loaded = false;
        state.gamestate.inactivateLauncher = true;
        state.gamestate.activateLauncher = true;
        this.log("BLAM!");
    }
};