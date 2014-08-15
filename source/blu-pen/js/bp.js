/*
 * bp.js
 */

var bp = (function () {

    'use strict';

    var
    initModule;
    
    initModule = function () {

        var jq_container = $('body')
            .append('<div id="main"></div>')
            .find('div#main');

        bp.shell.initModule(jq_container);

    };

    return {initModule: initModule};

}());
