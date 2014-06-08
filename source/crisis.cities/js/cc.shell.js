/*
 * cc.shell.js
 */

/*jslint
  browser: true, continue: true, devel: true, indent: 2, maxerr: 50, newcap: true,
  nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, white: true
*/

/*global
  $, cc
*/

cc.shell = (function () {
    
    'use strict';

    /* Module scope variables */
    
    var
    configMap = {
        main_html: String()
            + '<div class="cc-shell-head">'
            + '  <h1>CC</h1>'
            + '  <p>D3 Zoomable Sunburst</p>'
            + '</div>'
            + '<div class="cc-shell-main">'
            + '  <!--div class="cc-shell-main-nav"></div-->'
            + '  <div class="cc-shell-main-content"></div>'
            + '</div>'
            + '<div class="cc-shell-foot">'
            + '  bp'
            + '</div>'
            + '<!--div class="cc-shell-modal"></div-->',
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
    
     // Directs the shell to offer its capability to the user
    initModule = function ($3container) {
        
        // Load HTML and set jQuery and D3 maps
        stateMap.$3container = $3container;
        $3container.html(configMap.main_html);
        setJqueryMap();
        setD3Map();

        // Configure and initialize feature modules
        cc.sunburst.configModule({});
        cc.sunburst.initModule(d3Map.$3container.select(".cc-shell-main-content"));

    };
    
    return {initModule: initModule};

}());
