/*
 * spa.icicle.js
 * D3 zoomable icicle feature module for SPA
 */

/*jslint
  browser: true, continue: true, devel: true, indent: 2, maxerr: 50, newcap: true,
  nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, white: true
*/

/*global
  $, spa
*/

spa.icicle = (function () {
    
    'use strict';
    
    /* Module scope variables */
    
    var
    configMap = {
        width: 960,
        height: 500,
        settable_map: {
            width: true,
            height: true
        }
    },
    stateMap = {
        $3append_target: undefined,
        x: undefined,
        y: undefined,
        color: undefined,
        partition: undefined,
        svg: undefined,
        rect: undefined
    },
    jqueryMap = {},
    setJqueryMap,
    d3Map = {},
    setD3Map,
    configModule,
    initModule;
    
    /* Utility methods */
    
    /* Private DOM methods */
    
    setJqueryMap = function () {
        jqueryMap = {
        };
    };
    
    setD3Map = function () {
        d3Map = {
        };
    };
    
    /* Public DOM methods */
    
    /* Private D3 methods */
    
    function clicked(d) {
        stateMap.x.domain([d.x, d.x + d.dx]);
        stateMap.y.domain([d.y, 1]).range([d.y ? 20 : 0, configMap.height]);
            
        stateMap.rect.transition()
            .duration(750)
            .attr("x", function(d) { return stateMap.x(d.x); })
            .attr("y", function(d) { return stateMap.y(d.y); })
            .attr("width", function(d) { return stateMap.x(d.x + d.dx) - stateMap.x(d.x); })
            .attr("height", function(d) { return stateMap.y(d.y + d.dy) - stateMap.y(d.y); });
    }
        
    /* Public D3 methods */
    
    /* Event handlers */
    
    /* Public methods */
    
    /* configModule
     *
     * Purpose: Configure the module prior to initialization
     *
     * Arguments:
     *   None.
     *
     * Action:
     *   The internal configuration data structure (configMap) is
     *   updated with provided arguments. No other actions are taken.
     *
     * Returns: true
     *
     * Throws: JavaScript error object and trace on unacceptable or
     *         missing arguments
     *
     * Example: spa.tree.configModule({});
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
     * Purpose: Directs tree to offer its capability to the user
     *
     * Arguments:
     *   $3append_target - A D3 collection that should represent a
     *                    single DOM container. Example: ('#div_id')
     *
     * Action:
     *   Appends the tree layout to the provided container and fills
     *   it with HTML content. It then initializes elements, events,
     *   and handlers to provide the user with a tree-room interface
     *
     * Returns:
     *   true - on success
     *   false - on failure
     *
     * Throws: none
     *
     * Example: spa.tree.initModule($('#div_id'));
     */
    initModule = function ($3append_target) {
        
        stateMap.$3append_target = $3append_target
        
        stateMap.x = d3.scale.linear()
            .range([0, configMap.width]);
        stateMap.y = d3.scale.linear()
            .range([0, configMap.height]);
        stateMap.color = d3.scale.category20c();
        stateMap.partition = d3.layout.partition()
            .children(function(d) { return isNaN(d.value) ? d3.entries(d.value) : null; })
            .value(function(d) { return d.value; });
        stateMap.svg = $3append_target.append("svg")
            .attr("width", configMap.width)
            .attr("height", configMap.height);
        stateMap.rect = stateMap.svg.selectAll("rect");
        
        d3.json("json/readme.json", function(error, root) {
            stateMap.rect = stateMap.rect
                .data(stateMap.partition(d3.entries(root)[0]))
                .enter().append("rect")
                .attr("x", function(d) { return stateMap.x(d.x); })
                .attr("y", function(d) { return stateMap.y(d.y); })
                .attr("width", function(d) { return stateMap.x(d.dx); })
                .attr("height", function(d) { return stateMap.y(d.dy); })
                .attr("fill", function(d) { return stateMap.color((d.children ? d : d.parent).key); })
                .on("click", clicked);
        });
    };
    
    return {
        configModule: configModule,
        initModule: initModule
    };
    
}());
