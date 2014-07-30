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

    initModule = function (country_file_name, options) {
        d3.json(country_file_name, function (country_json) {

            module_State.country = country_json.country;
            module_State.sources = country_json.sources;
            module_State.tags = country_json.tags;

            if (options !== undefined && typeof options === 'object') {
                if ('page_name' in options) {
                    cc.shell.delegatePage({data: options});
                }
            }
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

    setCurrentSource = function (d, callback) {
        d3.json(d.json, function (s) {
            module_State.current_source = {data: d, sample: s};
            if (typeof d === 'object' && typeof callback === 'function') {
                callback(d);
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
