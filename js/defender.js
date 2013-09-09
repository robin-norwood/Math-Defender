/*
   defender.js - Prototype for the controller object and launch code

   Copyright (c) 2013 Robin Norwood <robin.norwood@gmail.com>
 */
"use strict";

var Defender = function () {
};

Defender.prototype = {
    launcherConfig: {
        slots: [ {x: 422.5, y: 1040},
                 {x: 747.5, y: 1040},
                 {x: 1047.5, y: 1040},
                 {x: 1347.5, y: 1040}
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
        controller.entities.field = new Field(300, 0, 1600, 900);

        controller.entities.missiles = [];
        controller.entities.explosions = [];
        controller.entities.meteors = [];

        this.meteorTimer = 0;
        this.meteorRate = 5000;
        this.meteorSpeed = 1;

        return {width: 1600,
                height: 1200
               }; // config
    },
    loopCallback: function (controller, elapsed) {
        if (controller.state.gamestate.fireMissile) {
            controller.entities.missiles.push(controller.state.gamestate.fireMissile);
            controller.state.gamestate.fireMissile = undefined;
        }

        if (controller.state.gamestate.explosion) {
            controller.entities.explosions.push(controller.state.gamestate.explosion);
            controller.state.gamestate.explosion = undefined;
        }

        $.each(controller.entities.explosions, function (e_idx, explosion) {
            $.each(controller.entities.meteors, function (m_idx, meteor) {
                if (Utils.distance(meteor.x, meteor.y, explosion.x, explosion.y) < explosion.radius) {
                    meteor.die = true;
                }
            });

            $.each(controller.entities.launchers, function (l_idx, launcher) {
                if (Utils.distance(launcher.x, launcher.y, explosion.x, explosion.y) < explosion.radius) {
                    launcher.die = true;
                }
            });

        });

        this.meteorTimer -= elapsed;
        if (this.meteorTimer <= 0) {
            this.fireMeteor(controller, this.meteorSpeed + Math.random() - .5);
            this.meteorTimer = this.meteorRate;

            if (this.meteorRate > 500) {
                this.meteorRate -= 60;
            }

            if (this.meteorSpeed < 6) {
                this.meteorSpeed += .2;
            }
        }

        return true; // keep running
    },
    fireMeteor: function (controller, speed) {
        var target = controller.entities.launchers[Math.floor(controller.entities.launchers.length * Math.random())];

        var x = 225 + Math.random()*1375;
        var y = 0;
        var angle = Utils.angle(x, y, target.x + 40, target.y);
        var dist = Utils.distance(x, y, target.x, target.y);

        controller.entities.meteors.push(new Meteor(x, y, angle, speed, dist));
    }
};

// Init and run
$(document).ready(function () {
    var defender = new Defender();
    var controller = new Controller(defender); // starts looping
});
