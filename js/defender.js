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
    starConfig: {count: 15},
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

        var numbers = [];
        numbers[0] = new NumberButton(50,100,"0");

        controller.entities.numbers = numbers;

        return {width: 1600,
                height: 1200
               }; // config
    },
    loopCallback: function (controller, elapsed) {
        return true; // keep running
    }
};

// Init and run
$(document).ready(function () {
    var defender = new Defender();
    var controller = new Controller(defender); // starts looping
});
