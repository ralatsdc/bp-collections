/*
 * bp.js
 */

var bp = (function () {

    'use strict';

    var
    initModule;
    
    initModule = function (input_config) {

        var jq_container = $('body')
            .append('<div id="main"></div>')
            .find('div#main');

        bp.shell.configModule(input_config);
        bp.shell.initModule(jq_container);

    };

    return {initModule: initModule};

}());
