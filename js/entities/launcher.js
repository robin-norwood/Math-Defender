/*
  launcher.js - Prototype for the launchers

   Copyright (c) 2011 Robin Norwood <robin.norwood@gmail.com>
 */
"use strict";
var Launcher = function (x, y) {
    this.x = x;
    this.y = y;

    this.angle = -Math.PI/2;
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
        if (this.active && state.gamestate.fireLauncher) {
            this.log("FIRE");
            state.gamestate.fireLauncher = false;
            state.gamestate.wizardGoHome = true;
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
            state.gamestate.wizardGoHome = false;
            state.gamestate.wizardGo = {x: this.x + 40, y: this.y + 140};
            this.log("ACTIVE");
        }

        return true;
    },
    render: function (screen) {
        screen.context.save();

        // Because sprites 'blit' relative to the upper left corner
        // *within* the rotated context, we have to fudge a bit to get
        // the gun in the right place.
        // NTS: Try to abstract this...
        screen.context.translate(this.x + 40, this.y + 60);

        // Also this.angle is relative to 'due right', but the gun
        // sprite original is in the upright position:
        screen.context.rotate(this.angle + Math.PI/2);

        var whichGun = 0;
        if (this.loaded) {
            whichGun = 1;
        }

        screen.blit(this.gunSprite, whichGun, {x: -14, y: -60});
        screen.context.restore();
        screen.blit(this.launcherSprite, 0, {x: this.x, y: this.y + 40});
    },
    fire: function (state) {
        this.loaded = false;
        state.gamestate.inactivateLauncher = true;
        state.gamestate.activateLauncher = true;

        this.angle = Utils.angle(this.x + 13, this.y + 60, state.pointerpos.x, state.pointerpos.y);
        var dist = Math.sqrt(Math.pow(state.pointerpos.x - this.x, 2) + Math.pow(state.pointerpos.y - this.y, 2));

        state.gamestate.fireMissile = new Missile(this.x, this.y, this.angle, 24, dist);
    }
};