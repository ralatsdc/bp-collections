/**
 * bp.model.js
 */

/* global bp */

bp.model = (function () {
    
    'use strict';

    var
    initModule,
    configModule,
    getPosts;

    var
    module_Config = {
        base_url: 'http://api.tumblr.com/v2/blog',
        base_hostname: 'blu-pen.tumblr.com',
        api_key: '7c3XQwWIUJS9hjJ9EPzhx2qlySQ5J2sIRgXRN89Ld03AGtK1KP',
        limit: 10,
        settable: {
            base_url: false,
            base_hostname: false,
            api_key: false,
            limit: true
        }
    },
    module_State = {
        posts: null
    };

    configModule = function (input_config) {
        bp.util.setConfig(input_config, module_Config);
        return true;
    };

    initModule = function (callback, cb_data) {
        var
        url = [module_Config.base_url, module_Config.base_hostname, 'posts?callback=?'].join('/'),
        gj_data = {
            api_key: module_Config.api_key,
            limit: 10
        };
        $.getJSON(url, gj_data).then(function (json) {
            module_State.posts = json.response.posts;
            if (callback !== undefined && typeof callback === 'function') {
                if (cb_data !== undefined) {
                    callback({data: cb_data});
                } else {
                    callback();
                }
            }
        });
    };

    getPosts = function () {
        return module_State.posts;
    };

    return {
        configModule: configModule,
        initModule: initModule,
        getPosts: getPosts
    };
    
}());
