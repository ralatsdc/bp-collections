/*
 * spa.sunburst.js
 * D3 zoomable sunburst feature module for SPA
 */

/*jslint
  browser: true, continue: true, devel: true, indent: 2, maxerr: 50, newcap: true,
  nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, white: true
*/

/*global
  $, spa
*/

spa.sunburst = (function () {
    
    'use strict';
    
    /* Module scope variables */
    
    var
    configMap = {
        width: 960,
        height: 700,
        settable_map: {
            width: true,
            height: true
        }
    },
    stateMap = {
        $3append_target: undefined,
        radius: true,
        x: true,
        y: true,
        color: true,
        svg: true,
        partition: true,
        arc: true,
        path: true
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
    
    // Interpolate the scales!
    function arcTween(d) {
        var xd = d3.interpolate(stateMap.x.domain(), [d.x, d.x + d.dx]),
        yd = d3.interpolate(stateMap.y.domain(), [d.y, 1]),
        yr = d3.interpolate(stateMap.y.range(), [d.y ? 20 : 0, stateMap.radius]);
        return function(d, i) {
            return i
                ? function(t) { return stateMap.arc(d); }
            : function(t) { stateMap.x.domain(xd(t)); stateMap.y.domain(yd(t)).range(yr(t)); return stateMap.arc(d); };
        };
    }

    function click(d) {
        stateMap.path.transition()
            .duration(750)
            .attrTween("d", arcTween(d));
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
     * Example: spa.sunburst.configModule({});
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
     * Purpose: Directs sunburst to offer its capability to the user
     *
     * Arguments:
     *   $3append_target - A D3 collection that should represent a
     *                    single DOM container. Example: ('#div_id')
     *
     * Action:
     *   Appends the sunburst layout to the provided container and fills
     *   it with HTML content. It then initializes elements, events,
     *   and handlers to provide the user with a sunburst-room interface
     *
     * Returns:
     *   true - on success
     *   false - on failure
     *
     * Throws: none
     *
     * Example: spa.sunburst.initModule($('#div_id'));
     */
    initModule = function ($3append_target) {
        
        stateMap.$3append_target = $3append_target
        
        stateMap.radius = Math.min(configMap.width, configMap.height) / 2;
        
        stateMap.x = d3.scale.linear()
            .range([0, 2 * Math.PI]);
        
        stateMap.y = d3.scale.sqrt()
            .range([0, stateMap.radius]);
        
        stateMap.color = d3.scale.category20c();
        
        stateMap.svg = $3append_target.append("svg")
            .attr("width", configMap.width)
            .attr("height", configMap.height)
            .append("g")
            .attr("transform", "translate(" + configMap.width / 2 + "," + (configMap.height / 2 + 10) + ")");
        
        stateMap.partition = d3.layout.partition()
            .value(function(d) { return d.size; });
        
        stateMap.arc = d3.svg.arc()
            .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, stateMap.x(d.x))); })
            .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, stateMap.x(d.x + d.dx))); })
            .innerRadius(function(d) { return Math.max(0, stateMap.y(d.y)); })
            .outerRadius(function(d) { return Math.max(0, stateMap.y(d.y + d.dy)); });
        
        d3.json("json/flare.json", function(error, root) {
            stateMap.path = stateMap.svg.selectAll("path")
                .data(stateMap.partition.nodes(root))
                .enter().append("path")
                .attr("d", stateMap.arc)
                .style("fill", function(d) { return stateMap.color((d.children ? d : d.parent).name); })
                .on("click", click);
        });
        
        d3.select(self.frameElement).style("height", configMap.height + "px");
    };
    
    return {
        configModule: configModule,
        initModule: initModule
    };
    
}());
