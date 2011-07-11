var Util = function () {

};

Util.prototype = {
    deepGrep: function (callback, objectOrArray) {
        // Works like a 'grep' that unpacks arrays.
        //
        // The callback function is called like: callback(item)
        // If callback returns false, delete the item from the
        // objectOrArray.

        var deleteList = [];

        var isArray = function (thing) {
            return thing &&
                typeof thing.length === 'number' &&
                !(thing.propertyIsEnumerable('length')) &&
                typeof thing.splice === 'function';
        };

        var self = this;
        $.each(objectOrArray, function (idx, item) {
            if (isArray(item)) {
                self.deepGrep(callback, item);
            }
            else if (!callback(item)) {
                deleteList.push(idx);
            }
        });

        $.each(deleteList, function (idx, item) {
            if (typeof item.destroy == 'function') {
                item.destroy();
            }
            delete objectOrArray[idx];
        });
    }
};

var Utils = new Util();
