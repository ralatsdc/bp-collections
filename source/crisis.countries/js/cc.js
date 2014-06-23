/*
 * cc.js
 */

var cc = (function() {

    'use strict';

    var
    initModule;
    
    initModule = function(jq_container, d3_container) {
        cc.shell.initModule(jq_container, d3_container);
    };

    return {initModule: initModule};

}());
