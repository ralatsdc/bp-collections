/*
 * cc.shell.js
 */

/*jslint
  browser: true, continue: true, devel: true, indent: 2, maxerr: 50, newcap: true,
  nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, white: true
*/

/*global
  $, cc
*/

cc.shell = (function () {
    
    'use strict';

    var
    moduleConfig = {
        settable: {
        }
    },
    moduleState = {
        $3container: undefined
    },
    initModule,
    configModule;
    
    configModule = function (input_config) {
        cc.util.setConfig(input_config, moduleConfig);
        return true;
    };

    initModule = function ($3container) {
        moduleState.$3container = $3container;
    };
    
    return {
        configModule: configModule,
        initModule: initModule
    };
    
}());
