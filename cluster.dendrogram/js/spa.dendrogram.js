/*
 * spa.dendrogram.js
 * D3 cluster dendrogram feature module for SPA
 */

/*jslint
  browser: true, continue: true, devel: true, indent: 2, maxerr: 50, newcap: true,
  nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, white: true
*/

/*global
  $, spa
*/

spa.dendrogram = (function () {
    
    'use strict';
    
    /* Module scope variables */
    
    var
    configMap = {
        width: 960,
        height: 2200,
        settable_map: {
            width: true,
            height: true
        }
    },
    stateMap = {
        $3append_target: undefined,
        cluster: undefined,
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
     *   Appends the cluster dendrogram to the provided container and
     *   fills it with HTML content. It then initializes elements,
     *   events, and handlers to provide the user with a tree-room
     *   interface
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

        stateMap.cluster = d3.layout.cluster()
            .size([configMap.height, configMap.width - 160]);
        stateMap.diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });
        stateMap.svg = $3append_target.append("svg")
            .attr("width", configMap.width)
            .attr("height", configMap.height)
            .append("g")
            .attr("transform", "translate(40,0)");
        
        d3.json("json/flare.json", function(error, root) {

            var
            nodes = stateMap.cluster.nodes(root),
            links = stateMap.cluster.links(nodes),
            link = stateMap.svg.selectAll(".link")
                .data(links)
                .enter().append("path")
                .attr("class", "link")
                .attr("d", stateMap.diagonal),
            node = stateMap.svg.selectAll(".node")
                .data(nodes)
                .enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
            
            node.append("circle")
                .attr("r", 4.5);
            
            node.append("text")
                .attr("dx", function(d) { return d.children ? -8 : 8; })
                .attr("dy", 3)
                .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
                .text(function(d) { return d.name; });
        });
        
        d3.select(self.frameElement).style("height", configMap.height + "px");
        
    };
    
    return {
        configModule: configModule,
        initModule: initModule
    };
    
}());
