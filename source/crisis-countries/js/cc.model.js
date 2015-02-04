/**
 * Loads source description and sample data.
 */
/* global cc, d3 */
cc.model = (function () {
    
    'use strict';

    /* == Public variables == */

    var
    initModule,
    configModule,
    getCountry,
    getSources,
    getTags,
    getSourceObject;

    /* == Private variables == */

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

    /* == Public functions == */

    /**
     * Sets the configuration key value pairs for this module.
     *
     * @param {Object} input_config configuration key value pairs to
     *     set, if permitted
     *
     * @return {boolean|undefined} true if successful, undefined
     *     otherwise
     */
    configModule = function (input_config) {
        cc.util.setConfig(input_config, module_Config);
        return true;
    };

    /**
     * Loads the collection JSON document and sets the result as module
     * state. Optionally delegates page presentation or sets the source
     * object.
     * 
     * @param {string} collection_file the name of the file
     *     containing the collection JSON document
     * @param {Object} options contains a page name or source index
     *
     * @return {undefined}
     */
    initModule = function (collection_file, options) {
        d3.json(collection_file, function (collection_json) {

            module_State.country = collection_json.country;
            module_State.sources = collection_json.sources;
            module_State.tags = collection_json.tags;

            if (options !== undefined && typeof options === 'object') {
                if ('page_name' in options) {
                    cc.shell.delegatePage({data: options});
                } else if ('source_index' in options) {
                    set_Source_Object(options);
                }
            }
        });
    };
    
    /**
     * Returns the country name.
     *
     * @return {Object}
     */
    getCountry = function () {
        return module_State.country;
    };

    /**
     * Returns data for each source.
     *
     * @return {Object}
     */
    getSources = function () {
        return module_State.sources;
    };

    /**
     * Returns selected tags.
     *
     * @return {Object}
     */
    getTags = function () {
        return module_State.tags;
    };

    /**
     * Returns source sample data.
     *
     * @return {Object}
     */
    getSourceObject = function () {
        return module_State.source_object;
    };

    /* == Private functions == */

    /**
     * Loads the source sample JSON document and sets the result as
     * module state. Delegates source page presentation
     *
     * @param {Object} o a source data object
     *
     * @return {undefined}
     */
    set_Source_Object = function (o) {
        var d = module_State.sources[o.source_index];
        d3.json(d.json, function (s) {
            module_State.source_object = {data: d, sample: s};
            module_State.source_index = o.source_index;
            module_State.source_page = 'source-' + o.source_index;
            cc.shell.delegatePage({data: {page_name: module_State.source_page}});
        });
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
