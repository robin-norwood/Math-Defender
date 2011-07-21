/*
   defender.js - Prototype for the controller object and launch code

   Copyright (c) 2011 Robin Norwood <robin.norwood@gmail.com>
 */
"use strict";

var Defender = function () {
};

Defender.prototype = {
    launcherConfig: {
        slots: [ {x: 422.5, y: 980},
                 {x: 747.5, y: 980},
                 {x: 1047.5, y: 980},
                 {x: 1347.5, y: 980}
               ]
    },
    starConfig: {count: 30},
    initCallback: function (controller) {
        var stars = [];
        for (var i=0;i<this.starConfig.count;i++) {
            stars.push(new Star({offsetX: 300,
                                 offsetY: 56,
                                 starsAcross: 22,
                                 starsDown: 14
                                }));
        }

        controller.entities.stars = stars;

        var launchers = [];
        $.each(this.launcherConfig.slots, function (idx, slot) {
            launchers[idx] = new Launcher(slot.x, slot.y);
        });

        controller.entities.launchers = launchers;
        controller.state.gamestate.activateLauncher = true;
        controller.state.gamestate.prepareLauncher = true;

        var numbers = [];
        var numberX = 75;
        var numberY = 150;

        for (i=0; i<10; i++) {
            numbers[i] = new NumberButton(numberX,numberY, i.toString());
            numberY += 200;
            if (i == 4) {
                numberY = 150;
                numberX += 125;
            }
        }

        controller.entities.numbers = numbers;

        controller.entities.equation = new Equation(25, 1100);

        controller.entities.wizard = new Wizard(10, 1120);
        controller.entities.field = new Field(300, 0, 1600, 960);

        controller.entities.missiles = [];
        return {width: 1600,
                height: 1200
               }; // config
    },
    loopCallback: function (controller, elapsed) {
        if (controller.state.gamestate.fireMissile) {
            controller.entities.missiles.push(controller.state.gamestate.fireMissile);
            controller.state.gamestate.fireMissile = undefined;
        }

        return true; // keep running
    }
};

// Init and run
$(document).ready(function () {
    var defender = new Defender();
    var controller = new Controller(defender); // starts looping
});
