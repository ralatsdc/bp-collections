/*
 * spa.rt_tree.js
 * D3 tree layout feature module for SPA
 */

/*jslint
  browser: true, continue: true, devel: true, indent: 2, maxerr: 50, newcap: true,
  nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, white: true
*/

/*global
  $, spa
*/

spa.rt_tree = (function () {
    
    'use strict';
    
    /* Module scope variables */
    
    var
    configMap = {
        diameter: 960,
        settable_map: {
            diameter: true
        }
    },
    stateMap = {
        $3append_target: undefined,
        tree: undefined,
        diagonal: undefined,
        svg: undefined
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
        
        stateMap.$3append_target = $3append_target;

        stateMap.tree = d3.layout.tree()
            .size([360, configMap.diameter / 2 - 120])
            .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });
        
        stateMap.diagonal = d3.svg.diagonal.radial()
            .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });
        
        stateMap.svg = $3append_target.append("svg")
            .attr("width", configMap.diameter)
            .attr("height", configMap.diameter - 150)
            .append("g")
            .attr("transform", "translate(" + configMap.diameter / 2 + "," + configMap.diameter / 2 + ")");
        
        d3.json("json/flare.json", function(error, root) {

            var
            nodes = stateMap.tree.nodes(root),
            links = stateMap.tree.links(nodes),
            link = stateMap.svg.selectAll(".link")
                .data(links)
                .enter().append("path")
                .attr("class", "link")
                .attr("d", stateMap.diagonal),
            node = stateMap.svg.selectAll(".node")
                .data(nodes)
                .enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });
            
            node.append("circle")
                .attr("r", 4.5);
            
            node.append("text")
                .attr("dy", ".31em")
                .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
                .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
                .text(function(d) { return d.name; });
        });
        
        d3.select(self.frameElement).style("height", configMap.diameter - 150 + "px");
        
    };
    
    return {
        configModule: configModule,
        initModule: initModule
    };
    
}());
