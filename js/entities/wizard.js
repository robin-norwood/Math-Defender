/*
   defender.js - Prototype for the controller object and launch code

   Copyright (c) 2011 Robin Norwood <robin.norwood@gmail.com>
 */
"use strict";
var Wizard = function (x, y) {
    this.homeX = x;
    this.homeY = y;

    this.wizardSprite = new Sprite('people', {w: 32, h: 32}, 8, 4);

    this.goHome();
};

Wizard.prototype = {
    log: function (msg) {
        if (console) {
            console.log(msg);
        }
    },
    update: function (elapsed, state) {
        var wg = state.gamestate.wizardGo;
        state.gamestate.wizardGo = undefined;

        if (wg) {
            this.x = wg.x;
            this.y = wg.y;
        }

        var home = state.gamestate.wizardGoHome;
        state.gamestate.wizardGoHome = undefined;

        if (home) {
            this.goHome();
        }

        return true;
    },
    render: function (screen) {
        screen.blit(this.wizardSprite, 0, {x: this.x, y: this.y}, {w: 64, h: 64});
    },
    goHome: function () {
        this.x = this.homeX;
        this.y = this.homeY;
    }
};