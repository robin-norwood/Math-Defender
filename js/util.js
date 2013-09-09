var Util = function () {

};

Util.prototype = {
    deepGrep: function (callback, objectOrArray) {
        // Works like a 'grep' that unpacks arrays and objects
        //
        // The callback function is called like: callback(item)
        // If callback returns false, delete the item from the
        // objectOrArray.

        var deleteList = [];

        var self = this;

        $.each(objectOrArray, function (idx, item) {
            if (self.isArray(item)) {
                self.deepGrep(callback, item);
            }
            else if (!callback(item)) {
                deleteList.push([idx, item]);
            }

            if (self.isObject(item) &&
                (self.isObject(item.entities) || self.isArray(item.entities))) {
                self.deepGrep(callback, item.entities);
            }

        });

        if (self.isArray(objectOrArray)) {
            deleteList.sort(function (a, b) {
                return b[0] - a[0];
            });
        }

        $.each(deleteList, function (idx, thing) {
            if (self.isObject(thing[1]) && typeof thing[1].destroy == 'function') {
                thing[1].destroy();
            }

            if (self.isArray(objectOrArray)) {
                objectOrArray.splice(thing[0], 1);
            }
            else {
                delete objectOrArray[thing[0]];
            }
        });
    },
    isArray: function (thing) {
        return thing &&
            typeof thing.length === 'number' &&
            !(thing.propertyIsEnumerable('length')) &&
            typeof thing.splice === 'function';
    },
    isObject: function (thing) { // A "real" object, not an array. Oh, JavaScript...
        return typeof thing == 'object' && (! this.isArray(thing));
    },
    getRelPos: function (e, obj) {
        // Get the relative position of the event inside the object
        return {x: e.pageX - obj.offsetLeft,
                y: e.pageY - obj.offsetTop};
    },
    vectorComps: function (mag, ang) {
        // Break a vector (magnitude and ang in radians)
        // into components
        return [mag * Math.cos(ang), mag * Math.sin(ang)];
    },
    accelerate: function(curDir, speed, accelDir, rate) {
        // Accelerate  in the given direction (in radians), and the given rate

        // Normalize directions
        curDir = curDir % (Math.PI * 2);
        accelDir = accelDir % (Math.PI * 2);

        if (!rate) {
            return {dir: curDir, speed: speed};
        }

        if (speed == 0) {
            return {dir: accelDir, speed: rate};
        }

        var newDir = undefined;
        var newSpeed = undefined;

        var diff = Math.round((curDir - accelDir) * 1000) / 1000;
        var approxPI = Math.round(Math.PI * 1000) / 1000;
        if (diff == 0) { // 'forward'
            newDir = curDir;
            newSpeed = speed + rate;
        }
        else if (diff == approxPI) { // 'backward'
            if (speed - rate > 0) {
                newDir = curDir;
                newSpeed = speed - rate;
            }
            else {
                newDir = accelDir;
                newSpeed = rate - speed;
            }
        }
        else if (diff % (approxPI/2) == 0) { // right angle
            newSpeed = Math.sqrt(Math.pow(speed, 2) + Math.pow(rate, 2));
            newDir = curDir + Math.asin(rate / newSpeed);
        }
        else { // Vector addition.
            var a = this.vectorComps(speed, curDir);
            var b = this.vectorComps(rate, accelDir);

            var rx = a[0] + b[0];
            var ry = a[1] + b[1];
            newSpeed = Math.sqrt(Math.pow(rx, 2) + Math.pow(ry, 2));
            newDir = Math.atan(ry / rx);

            if (rx < 0) {
                newDir += Math.PI;
            }
        }

        if (!newSspeed) { // If new_speed drops to 0, new_dir becomes NaN
            newDir = dir;
        }

        return {dir: newDir, speed: newSpeed};
    },
    angle: function(x0, y0, x1, y1) {
        // Return the angle in radintans between the horizontal axis and
        // a line through the given points
        var rx = x1 - x0;
        var ry = y1 - y0;

        var dir = Math.atan(ry/rx);

        if (rx < 0) {
            dir += Math.PI;
        }

        return dir;
    },
    distance: function(x0, y0, x1, y1) {
        return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
    }
};

var Utils = new Util();
