/*
 * cc.model.js
 */

 /* global cc, d3 */

cc.model = (function () {
    
    'use strict';

    var
    initModule,
    configModule,
    getCountry,
    getSources,
    getTags,
    setSample,
    getSample;

    var
    module_Config = {
        settable: {
        }
    },
    module_State = {
        country: null,
        sources: null,
        tags: null,
        sample: null
    };

    configModule = function (input_config) {
        cc.util.setConfig(input_config, module_Config);
        return true;
    };

    initModule = function (input_file_name) {
        d3.json(input_file_name, function (input_json) {
            module_State.country = input_json.country;
            module_State.sources = input_json.sources;
            module_State.tags = input_json.tags;
        });
    };
    
    getCountry = function () {
        return module_State.country;
    };

    getSources = function () {
        return module_State.sources;
    };

    getTags = function () {
        return module_State.sources;
    };

    setSample = function (input_file_name) {
        d3.json(input_file_name, function (input_json) {
            module_State.sample = input_json;
        });
    };

    getSample = function () {
        return module_State.sample;
    };

    return {
        configModule: configModule,
        initModule: initModule,
        getCountry: getCountry,
        getSources: getSources,
        getTags: getTags
    };
    
}());
