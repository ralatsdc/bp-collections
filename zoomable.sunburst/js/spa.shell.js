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
            + '  <p>D3 Zoomable Sunburst</p>'
            + '</div>'
            + '<div class="spa-shell-main">'
            + '  <!--div class="spa-shell-main-nav"></div-->'
            + '  <div class="spa-shell-main-content"></div>'
            + '</div>'
            + '<div class="spa-shell-foot">'
            + '  bp'
            + '</div>'
            + '<!--div class="spa-shell-modal"></div-->',
        settable_map: {
        }
    },
    stateMap = {
        $3container: undefined
    },
    jqueryMap = {},
    setJqueryMap,
    d3Map = {},
    setD3Map,
    initModule;
    
    /* Utility methods */
    
    /* DOM methods */
    
    setJqueryMap = function () {
        jqueryMap = {
        };
    };

    setD3Map = function () {
        d3Map = {
            $3container: stateMap.$3container
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
     *   $3container - A D3 collection that should represent a
     *                single DOM container. Example: $('#app_div_id')
     *
     * Action:
     *   Populates $3container with the shell of the UI and then
     *   configures and initialized feature modules. The Shell is also
     *   responsible for browser-wide issues such as URI anchor and
     *   cookie management.
     *
     * Returns: none
     */
    initModule = function ($3container) {
        
        // Load HTML and set jQuery and D3 maps
        stateMap.$3container = $3container;
        $3container.html(configMap.main_html);
        setJqueryMap();
        setD3Map();

        // Configure and initialize feature modules
        spa.sunburst.configModule({});
        spa.sunburst.initModule(d3Map.$3container.select(".spa-shell-main-content"));

    };
    
    return {initModule: initModule};

}());
