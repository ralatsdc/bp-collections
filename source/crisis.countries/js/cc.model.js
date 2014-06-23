/*
 * cc.model.js
 */

 /* global cc, d3 */

cc.model = (function() {
    
    'use strict';

    var
    moduleConfig = {
        settable: {
        }
    },
    moduleState = {
        sources: undefined,
        tags: undefined
    },
    initModule,
    configModule;
    
    configModule = function(input_config) {
        cc.util.setConfig(input_config, moduleConfig);
        return true;
    };

    initModule = function(input_file_name) {
        d3.json(input_file_name, function(input_json) {
            /*
              include: true,
              name: "1619798@N22",
              service: "flickr",
              age: -22,
              engagement: 0,
              volume: 0,
              frequency: -22,
              score: 2290,
              type: "common"
            */
            moduleState.sources = input_json.sources;
            /*
              count: 12,
              tag: "beach",
              type: "common"
            */
            moduleState.tags = input_json.tags;
        });
    };
    
    return {
        configModule: configModule,
        initModule: initModule
    };
    
}());
