/*
 * cc.contents.js
 */

/*jslint
  browser: true, continue: true, devel: true, indent: 2, maxerr: 50, newcap: true,
  nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, white: true
*/

/*global
  $, cc
*/

cc.contents = (function () {
    
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
    
    initModule = function () {
    };
    
    return {
        configModule: configModule,
        initModule: initModule
    };
    
}());
