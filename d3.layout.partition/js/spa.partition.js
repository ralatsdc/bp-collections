/*
 * spa.partition.js
 * D3 partition layout feature module for SPA
 */

/*jslint
  browser: true, continue: true, devel: true, indent: 2, maxerr: 50, newcap: true,
  nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, white: true
*/

/*global
  $, spa
*/

spa.partition = (function () {
    
    'use strict';

    /* Module scope variables */
    
    var
    configMap = {
        w: 1120,
        h: 600,
        settable_map: {
            w: true,
            h: true
        }
    },
    stateMap = {
        $3append_target: undefined,
        x: undefined,
        y: undefined,
        g: undefined,
        vis: undefined,
        partition: undefined,
        kx: undefined,
        ky: undefined
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

    function click(d) {
        if (!d.children) return;
                
        stateMap.kx = (d.y ? configMap.w - 40 : configMap.w) / (1 - d.y);
        stateMap.ky = configMap.h / d.dx;
        stateMap.x.domain([d.y, 1]).range([d.y ? 40 : 0, configMap.w]);
        stateMap.y.domain([d.x, d.x + d.dx]);
                
        var t = stateMap.g.transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .attr("transform", function(d) { return "translate(" + stateMap.x(d.y) + "," + stateMap.y(d.x) + ")"; });
                
        t.select("rect")
            .attr("width", d.dy * stateMap.kx)
            .attr("height", function(d) { return d.dx * stateMap.ky; });
                
        t.select("text")
            .attr("transform", transform)
            .style("opacity", function(d) { return d.dx * stateMap.ky > 12 ? 1 : 0; });
                
        d3.event.stopPropagation();
    }
            
    function transform(d) {
        return "translate(8," + d.dx * stateMap.ky / 2 + ")";
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
     *   Appends the partition layout to the provided container and
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

        stateMap.x = d3.scale.linear().range([0, configMap.w]);
        stateMap.y = d3.scale.linear().range([0, configMap.h])
        stateMap.vis = $3append_target.append("div")
            .attr("class", "chart")
            .style("width", configMap.w + "px")
            .style("height", configMap.h + "px")
            .append("svg:svg")
            .attr("width", configMap.w)
            .attr("height", configMap.h);
        stateMap.partition = d3.layout.partition()
            .value(function(d) { return d.size; });

        d3.json("json/flare.json", function(root) {

            stateMap.g = stateMap.vis.selectAll("g")
                .data(stateMap.partition.nodes(root))
                .enter().append("svg:g")
                .attr("transform", function(d) { return "translate(" + stateMap.x(d.y) + "," + stateMap.y(d.x) + ")"; })
                .on("click", click);
            stateMap.kx = configMap.w / root.dx;
            stateMap.ky = configMap.h / 1;
            
            stateMap.g.append("svg:rect")
                .attr("width", root.dy * stateMap.kx)
                .attr("height", function(d) { return d.dx * stateMap.ky; })
                .attr("class", function(d) { return d.children ? "parent" : "child"; });
            
            stateMap.g.append("svg:text")
                .attr("transform", transform)
                .attr("dy", ".35em")
                .style("opacity", function(d) { return d.dx * stateMap.ky > 12 ? 1 : 0; })
                .text(function(d) { return d.name; })
            
            d3.select(window)
                .on("click", function() { click(root); })
        });
    };
    
    return {
        configModule: configModule,
        initModule: initModule
    };
    
}());
