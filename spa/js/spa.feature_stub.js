/*
 * spa.feature_stub.js
 * Stub feature module for SPA
 */

/*jslint
  browser: true, continue: true, devel: true, indent: 2, maxerr: 50, newcap: true,
  nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, white: true
*/

/*global
  $, spa
*/

spa.feature_stub = (function () {
    
    'use strict';

    /* Module scope variables */
    
    var
    configMap = {
        main_html: String()
        + '<div>'
        + '  Say hello to feature stub.'
        + '</div>',
        settable_map: {color_name: true},
        color_name: 'blue'
    },
    stateMap = {
        $container: null,
    },
    jqueryMap = {},
    setJqueryMap,
    configModule,
    initModule;
    
    /* Utility methods
     *
     * Example: getTrimmedString = ...
     */
    
    /* DOM methods */
    
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
        };
    };
    
    /* Event handlers
     *
     * Example: onClickButton = ...
     */
    
    /* Public methods */
    
    /* configModule
     *
     * Purpose: Adjust configuration of allowed keys
     *
     * Arguments: A map of settable keys and values
     *   color_name - color to use
     *
     * Settings:
     *   configMap.settable_map declares allowed keys
     *
     * Returns: true
     *
     * Throws: none
     */
    configModule = function (input_map) {
        spa.util.setConfigMap({
            input_map: input_map,
            settable_map: configMap.settable_map,
            config_map: configMap
        });
        return true;
    };
    
    /* initModule
     *
     * Purpose: Initialized module
     *
     * Arguments:
     *   $container - the jQuery element used by this feature
     *
     * Returns: true
     *
     * Throws: nonaccidental
     */
    initModule = function ($container) {
        
        // Load HTML and map jQuery collections
        $container.html = (configMap.main_html);
        stateMap.$container = $container;
        setJqueryMap();
        
        return true;
    };

    return {
        configModule: configModule,
        initModule: initModule
    };

}());
