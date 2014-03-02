/*
 * spa.shell.js
 * Shell module for SPA
 */

/*jslint
  browser: true, continue: true, devel: true, indent: 2, maxerr: 50, newcap: true,
  nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, white: true
*/

/*global
  $, spa
*/

spa.shell = (function () {
    
    'use strict';

    /* Module scope variables */
    
    var
    configMap = {
        main_html: String()
            + '<div class="spa-shell-head">'
            + '  <h1>SPA</h1>'
            + '  <p>D3 Tree Layout</p>'
            + '</div>'
            + '<div class="spa-shell-main">'
            + '  <!--div class="spa-shell-main-nav"></div-->'
            + '  <div class="spa-shell-main-content"></div>'
            + '</div>'
            + '<div class="spa-shell-foot">'
            + '  bp'
            + '</div>'
            + '<div class="spa-shell-modal"></div>'
    },
    stateMap = {
        $container: undefined
    },
    jqueryMap = {},
    setJqueryMap,
    initModule;
    
    /* Utility methods */
    
    /* DOM methods */
    
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container
        };
    };
    
    /* Event handlers */
    
    /* Callbacks */

    /* Public methods */
    
    /* initModule
     *
     * Purpose: Directs the shell to offer its capability to the user
     *
     * Arguments:
     *   $container - A JQuery collection that should represent a
     *                single DOM container. Example: $('#app_div_id')
     *
     * Action:
     *   Populates $container with the shell of the UI and then
     *   configures and initialized feature modules. The Shell is also
     *   responsible for browser-wide issues such as URI anchor and
     *   cookie management.
     *
     * Returns: none
     */
    initModule = function ($container) {
        
        // Load HTML and map jQuery collections
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();
        
        // Configure and initialize feature modules
        spa.tree.configModule({});
        spa.tree.initModule(jqueryMap.$container.select(".spa-shell-main-content"));

    };
    
    return {initModule: initModule};

}());
