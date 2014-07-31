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
    getSourceObject;

    var
    module_Config = {
        settable: {
        }
    },
    module_State = {
        country: null,
        sources: null,
        tags: null,
        source_object: null,
        source_index: undefined,
        source_page: undefined
    },
    set_Source_Object;

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
                } else if ('source_index' in options) {
                    set_Source_Object(options);
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

    set_Source_Object = function (o) {
        var d = module_State.sources[o.source_index];
        d3.json(d.json, function (s) {
            module_State.source_object = {data: d, sample: s};
            module_State.source_index = o.source_index;
            module_State.source_page = 'source-' + o.source_index;
            cc.shell.delegatePage({data: {page_name: module_State.source_page}});
        });
    };

    getSourceObject = function () {
        return module_State.source_object;
    };

    return {
        configModule: configModule,
        initModule: initModule,
        getCountry: getCountry,
        getSources: getSources,
        getTags: getTags,
        getSourceObject: getSourceObject
    };
    
}());
