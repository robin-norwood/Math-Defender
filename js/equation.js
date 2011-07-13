/*
   equation.js - Prototype for the controller object and launch code

   Copyright (c) 2011 Robin Norwood <robin.norwood@gmail.com>
 */
"use strict";
var Equation = function (x, y) {
    this.x = x;
    this.y = y;

    this.addends = [undefined, undefined];
    this.summand = undefined;
    this.text = "";
    this.limit = 19;

    this.generate();
    this.toSkip = Math.floor(Math.random() * 3);
};

Equation.prototype = {
    update: function (elapsed, state) {
        return true;
    },
    render: function (screen) {
        screen.context.font = 'bold 50px mono';
        screen.context.fillStyle = 'yellow';
        screen.context.textAlign = 'left';
        screen.context.translate(this.x, this.y);

        var displayParts = [ this.toSkip == 0 ? "__" : this.addends[0],
                             this.toSkip == 1 ? "__" : this.addends[1],
                             this.toSkip == 2 ? "__" : this.summand];
        screen.context.fillText(displayParts[0] + " + " + displayParts[1] + " = " + displayParts[2], 0, 0);
    },
    generate: function () {
        this.addends[0] = Math.floor(Math.random() * this.limit);
        this.addends[1] = Math.floor(Math.random() * (this.limit - this.addends[0]));
        this.summand = this.addends[0] + this.addends[1];
    }
};