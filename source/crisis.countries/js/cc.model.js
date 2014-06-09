/*
 * cc.model.js
 */

/*jslint
  browser: true, continue: true, devel: true, indent: 2, maxerr: 50, newcap: true,
  nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, white: true
*/

/*global
  $, cc
*/

cc.model = (function () {
    
    'use strict';

    var
    moduleConfig = {
        settable: {
        }
    },
    moduleState = {
    },
    initModule,
    configModule;
    
    configModule = function (input_config) {
        cc.util.setConfig(input_config, moduleConfig);
        return true;
    };

    initModule = function (input_file_name) {
        d3.json(input_file_name, function(input_json) {
            data = input_json.data;
            tags = input_json.tags;
        });
    };
    
    return {
        configModule: configModule,
        initModule: initModule
    };
    
}());
