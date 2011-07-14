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
    this.input = "__";
    this.limit = 19;
    this.solved = false;
    this.wrong = false;
    this.wrongTimer = 0;

    this.generate();
    this.toSkip = Math.floor(Math.random() * 3);

    this.color = "yellow";
};

Equation.prototype = {
    update: function (elapsed, state) {
        if (state.digit) {
            if (this.wrong) {
                this.wrongTimer = 0;
                this.wrong = false;
                this.input = "__";
                this.color = "yellow";
            }

            var digitStr = state.digit.toString();
            if (this.input[1] == "_") {
                this.input = "_" + digitStr;
            }
            else if (this.input[0] == "_") {
                this.input = this.input[1] + digitStr;
            }
            else {
                this.input = "_" + digitStr;
            }

            this.checkSolved();

            if (this.solved) {
                this.color = "green";
            }

            if (this.wrong) {
                this.color = "red";
                this.wrongTimer = 2000;
            }
        }
        else if (this.wrong) {
            this.wrongTimer -= elapsed;

            if (this.wrongTimer <= 0) {
                this.wrongTimer = 0;
                this.wrong = false;
                this.input = "__";
                this.color = "yellow";
            }
        }

        return true;
    },
    render: function (screen) {
        screen.context.font = 'bold 50px mono';
        screen.context.fillStyle = this.color;
        screen.context.textAlign = 'left';
        screen.context.translate(this.x, this.y);

        var displayParts = [ this.toSkip == 0 ? this.input : this.addends[0],
                             this.toSkip == 1 ? this.input : this.addends[1],
                             this.toSkip == 2 ? this.input : this.summand ];
        screen.context.fillText(displayParts[0] + " + " + displayParts[1] + " = " + displayParts[2], 0, 0);
    },
    generate: function () {
        this.addends[0] = Math.floor(Math.random() * this.limit);
        this.addends[1] = Math.floor(Math.random() * (this.limit - this.addends[0]));
        this.summand = this.addends[0] + this.addends[1];
    },
    checkSolved: function () {
        var num = undefined;

        if (this.input[0] == "_") {
            num = parseInt(this.input[1]);
        }
        else {
            num = parseInt(this.input);
        }

        if (this.toSkip == 0 && num + this.addends[1] == this.summand ||
            this.toSkip == 1 && this.addends[0] + num == this.summand ||
            this.toSkip == 2 && this.addends[0] + this.addends[1] == num) {
            this.solved = true;
        }
        else if (this.toSkip == 0 && num + this.addends[1] > this.summand ||
                 this.toSkip == 1 && this.addends[0] + num > this.summand ||
                 this.toSkip == 2 && this.addends[0] + this.addends[1] < num) {
            this.wrong = true;
        }
    }
};