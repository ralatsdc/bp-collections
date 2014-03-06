/*
 * spa.tree.js
 * D3 tree layout feature module for SPA
 */

/*jslint
  browser: true, continue: true, devel: true, indent: 2, maxerr: 50, newcap: true,
  nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, white: true
*/

/*global
  $, spa
*/

spa.tree = (function () {
    
    'use strict';

    /* Module scope variables */
    
    var
    configMap = {
        m: [20, 120, 20, 120],
        width: 1280,
        height: 800,
        settable_map: {
            m: true,
            width: true,
            height: true
        }
    },
    stateMap = {
        $3append_target: undefined,
        i: 0,
        root: undefined,
        tree: undefined,
        diagonal: undefined,
        vis: undefined
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

    function update(source) {
        var
        duration = d3.event && d3.event.altKey ? 5000 : 500;
            
        // Compute the new tree layout
        var nodes = stateMap.tree.nodes(stateMap.root).reverse();
            
        // Normalize for fixed-depth
        nodes.forEach(function(d) { d.y = d.depth * 180; });
            
        // Update the nodes
        var node = stateMap.vis.selectAll("g.node")
            .data(nodes, function(d) { return d.id || (d.id = ++stateMap.i); });
            
        // Enter any new nodes at the parent's previous position
        var nodeEnter = node.enter().append("svg:g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
            .on("click", function(d) { toggle(d); update(d); });
        nodeEnter.append("svg:circle")
            .attr("r", 1e-6)
            .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
        nodeEnter.append("svg:text")
            .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
            .text(function(d) { return d.name; })
            .style("fill-opacity", 1e-6);
            
        // Transition nodes to their new position
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
        nodeUpdate.select("circle")
            .attr("r", 4.5)
            .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
        nodeUpdate.select("text")
            .style("fill-opacity", 1);
            
        // Transition exiting nodes to the parent's new position
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
            .remove();
        nodeExit.select("circle")
            .attr("r", 1e-6);
        nodeExit.select("text")
            .style("fill-opacity", 1e-6);
            
        // Update the links
        var link = stateMap.vis.selectAll("path.link")
            .data(stateMap.tree.links(nodes), function(d) { return d.target.id; });
            
        // Enter any new links at the parent's previous position
        link.enter().insert("svg:path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {x: source.x0, y: source.y0};
                return stateMap.diagonal({source: o, target: o});
            })
            .transition()
            .duration(duration)
            .attr("d", stateMap.diagonal);
            
        // Transition links to their new position
        link.transition()
            .duration(duration)
            .attr("d", stateMap.diagonal);
            
        // Transition exiting nodes to the parent's new position
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {x: source.x, y: source.y};
                return stateMap.diagonal({source: o, target: o});
            })
            .remove();
        
        // Stash the old positions for transition
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    function toggleAll(d) {
        if (d.children) {
            d.children.forEach(toggleAll);
            toggle(d);
        }
    }
            
    function toggle(d) {

        // Toggle children
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
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

        stateMap.w = configMap.width - configMap.m[1] - configMap.m[3];
        stateMap.h = configMap.height - configMap.m[0] - configMap.m[2];

        stateMap.i = 0;
        stateMap.tree = d3.layout.tree()
            .size([stateMap.h, stateMap.w])
        stateMap.diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; })
        stateMap.vis = $3append_target.append("svg:svg")
            .attr("width", stateMap.w + configMap.m[1] + configMap.m[3])
            .attr("height", stateMap.h + configMap.m[0] + configMap.m[2])
            .append("svg:g")
            .attr("transform", "translate(" + configMap.m[3] + "," + configMap.m[0] + ")")
        
        d3.json("json/flare.json", function(json) {
            stateMap.root = json;
            stateMap.root.x0 = stateMap.h / 2;
            stateMap.root.y0 = 0;
            
            // Initialize the display to show a few nodes.
            stateMap.root.children.forEach(toggleAll);
            toggle(stateMap.root.children[1]);
            toggle(stateMap.root.children[1].children[2]);
            toggle(stateMap.root.children[9]);
            toggle(stateMap.root.children[9].children[0]);
            
            update(stateMap.root);
        });
    };
    
    return {
        configModule: configModule,
        initModule: initModule
    };
    
}());
