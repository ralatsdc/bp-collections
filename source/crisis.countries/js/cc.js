/*
 * cc.js
 */

var cc = (function () {

    'use strict';

    var
    initModule;
    
    initModule = function () {

        var jq_container = $('body')
            .append('<div id="main"></div>')
            .find('div#main');

        cc.shell.initModule(jq_container);

    };

    return {initModule: initModule};

}());
