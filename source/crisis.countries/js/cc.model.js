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
    setCurrentSource,
    getCurrentSource,
    setSourcePage,
    getSourcePage;

    var
    module_Config = {
        settable: {
        }
    },
    module_State = {
        country: null,
        sources: null,
        tags: null,
        current_source: null,
        source_number: 0,
        source_page: {}
    };

    configModule = function (input_config) {
        cc.util.setConfig(input_config, module_Config);
        return true;
    };

    initModule = function (country_file_name) {
        d3.json(country_file_name, function (country_json) {
            module_State.country = country_json.country;
            module_State.sources = country_json.sources;
            module_State.tags = country_json.tags;
        });
    };
    
    getCountry = function () {
        return module_State.country;
    };

    getSources = function () {
        return module_State.sources;
    };

    getTags = function () {
        return module_State.tags;
    };

    setCurrentSource = function (sample_file_name, data_json, callback) {
        d3.json(sample_file_name, function (sample_json) {
            module_State.current_source = {data: data_json, sample: sample_json};
            if (typeof data_json === 'object' && typeof callback === 'function') {
                callback(data_json);
            }
        });
    };

    getCurrentSource = function () {
        return module_State.current_source;
    };

    setSourcePage = function (name) {
        module_State.source_number += 1;
        module_State.source_page[name] = 'source-' + module_State.source_number;
    };

    getSourcePage = function () {
        return module_State.source_page;
    };

    return {
        configModule: configModule,
        initModule: initModule,
        getCountry: getCountry,
        getSources: getSources,
        getTags: getTags,
        setCurrentSource: setCurrentSource,
        getCurrentSource: getCurrentSource,
        setSourcePage: setSourcePage,
        getSourcePage: getSourcePage
    };
    
}());
