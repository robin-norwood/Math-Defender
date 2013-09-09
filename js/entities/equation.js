/*
   equation.js - Prototype for the controller object and launch code

   Copyright (c) 2013 Robin Norwood <robin.norwood@gmail.com>
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
    this.resetTimer = 0;

    this.generate();
    this.toSkip = Math.floor(Math.random() * 3);
};

Equation.prototype = {
    update: function (elapsed, state) {
        var digitStr = undefined;
        if (state.gamestate.digit) {
            digitStr = state.gamestate.digit.toString();
            state.gamestate.digit = undefined;
        }

        if (digitStr && !this.solved) {
            if (this.wrong) {
                this.reset();
            }

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
                state.gamestate.loadLauncher = true;
            }

            if (this.wrong) {
                this.resetTimer = 2000;
            }
        }
        else if (this.resetTimer) {
            this.resetTimer -= elapsed;

            if (this.resetTimer <= 0) {
                this.reset();
            }
        }
        else if (state.gamestate.resetEquation) {
            state.gamestate.resetEquation = false;
            this.resetTimer = 500;
        };

        if (!this.solved && state.keyspressed.indexOf('esc') != -1) {
            this.reset();
        }
        if (state.keyspressed.indexOf('backspace') != -1) {
            this.input = "_" + this.input[0];
        }

        return true;
    },
    render: function (screen) {
        var color = "yellow";
        if (this.solved) {
            color = "green";
        }
        else if (this.wrong) {
            color = "red";
        }

        screen.context.font = 'bold 50px mono';
        screen.context.fillStyle = color;
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
    },
    reset: function () {
        if (this.solved) {
            this.generate();
        }
        this.resetTimer = 0;
        this.wrong = false;
        this.solved = false;
        this.input = "__";
    }
};