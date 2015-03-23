/**
 * Provides the top-level name-space.
 */
var cc = (function () {

    'use strict';

    /* == Public variables == */

    var
    initModule;
    
    /* == Public functions == */

    /**
     * Appends the main div as a container for all other content using
     * jQuery, then initializes the shell.
     *
     * @return {undefined}
     */
    initModule = function (input_config) {

        var jq_container = $('body')
            .append('<div id="main"></div>')
            .find('div#main');

        cc.shell.configModule(input_config);
        cc.shell.initModule(jq_container);

    };

    return {initModule: initModule};

}());
