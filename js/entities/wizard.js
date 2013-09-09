/*
   wizard.js - Prototype for the wizard that fires the launchers

   Copyright (c) 2011 Robin Norwood <robin.norwood@gmail.com>
 */
"use strict";
var Wizard = function (x, y) {
    this.homeX = x;
    this.homeY = y;
    this.speed = 18;
    this.wizardSprite = new Sprite('people', {w: 32, h: 32}, 8, 4);

    this.x = this.homeX;
    this.y = this.homeY;
};

Wizard.prototype = {
    log: function (msg) {
        if (console) {
            console.log(msg);
        }
    },
    update: function (elapsed, state) {
        var wg = state.gamestate.wizardGo;
	var going = false;

        if (wg) {
	    this.log("Moving to " + wg);

            var dist = Math.sqrt(Math.pow(this.x - wg.x, 2) + Math.pow(this.y - wg.y, 2));

	    if (dist < this.speed) {
		this.x = wg.x;
		this.y = wg.y;
		state.gamestate.wizardGo = undefined;
	    }
	    else {
		var angle = Utils.angle(this.x, this.y, wg.x, wg.y);

		this.x += Math.cos(angle) * this.speed; 
		this.y += Math.sin(angle) * this.speed;

		going = true;
	    }
        }

        var goHome = state.gamestate.wizardGoHome;
        state.gamestate.wizardGoHome = undefined;

        if (goHome) {
            state.gamestate.wizardGo = {x: this.homeX, y: this.homeY};
        }

        if (going || (state.gamestate.fireLauncher && this.isHome())) {
            // swallow firing events made when the wizard is at home.
            state.gamestate.fireLauncher = undefined;
        }
        return true;
    },
    render: function (screen) {
        screen.blit(this.wizardSprite, 0, {x: this.x, y: this.y}, {w: 64, h: 64});
    },
    isHome: function () {
        if (this.x == this.homeX && this.y == this.homeY) {
            return true;
        }

        return false;
    }
};
