/*
   wizard.js - Prototype for the wizard that fires the launchers

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

        var goHome = state.gamestate.wizardGoHome;
        state.gamestate.wizardGoHome = undefined;

        if (goHome) {
            this.goHome();
        }

        if (state.gamestate.fireLauncher && this.isHome()) {
            // swallow firing events made when the wizard is at home.
            state.gamestate.fireLauncher = undefined;
        }
        return true;
    },
    render: function (screen) {
        screen.blit(this.wizardSprite, 0, {x: this.x, y: this.y}, {w: 64, h: 64});
    },
    goHome: function () {
        this.x = this.homeX;
        this.y = this.homeY;
    },
    isHome: function () {
        if (this.x == this.homeX && this.y == this.homeY) {
            return true;
        }

        return false;
    }
};