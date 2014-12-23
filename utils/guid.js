/* jshint node:true *//* global define, escape, unescape */
'use strict';

var Guid = {};

var s4 = function () {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
};

var isTrue = function(input) {
    if(input !== undefined && input != null && (input === true || input.toLowerCase() == "true")){
        return true;
    }
    return false;
};


Guid.guid = function(useDashes) {
    
    var dash = '';
    
    if(isTrue(useDashes)){
        dash = '-';
    }
    
    return s4() + s4() + dash + s4() + dash + s4() + dash +
           s4() + dash + s4() + s4() + s4();
};


try {
    exports.generate = Guid.guid;
}
catch(err) {
    
}