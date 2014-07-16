/*
 * cc.force.js
 */

/* global cc, d3 */

cc.force = (function () {

    'use strict';

    var
    configModule,
    initModule;

    var
    module_Config = {
        width: 600,
        height: 600,
        margin: 30,
        domain_x: [-50, 50],
        domain_y: [-50, 50],
        domain_o: [-1, 1],
        range_o: [0.25, 0.75],
        gravity: 0.60,
        friction: 0.90,
        beta_x: 0.24,
        beta_y: 0.12,
        settable: {
            width: true,
            height: true,
            margin: true,
            domain_x: true,
            domain_y: true,
            domain_o: true,
            range_o: true,
            gravity: true,
            friction: true,
            beta_x: true,
            beta_y: true
        }
    },
    module_State = {
        svg: null,
        node_values: null,
        node_elements: null,
        force_layout: null
    },
    scale_X,
    scale_Y,
    scale_R,
    scale_O,
    fill_R,
    stroke_R,
    stroke_Width_R,
    charge_R,
    on_Tick,
    present_Volume;

    configModule = function (input_config) {
        cc.util.setConfig(input_config, module_Config);
        return true;
    };

    initModule = function () {

        module_State.svg = d3.select('div#cc-shell-volume-column-right')
            .append('svg')
            .attr('width', module_Config.width)
            .attr('height', module_Config.height);

        scale_X = d3.scale.linear()
            .domain(module_Config.domain_x)
            .range([module_Config.margin, module_Config.width - module_Config.margin]);

        scale_Y = d3.scale.linear()
            .domain(module_Config.domain_y)
            .range([module_Config.height - module_Config.margin, module_Config.margin]);

        scale_O = d3.scale.linear()
            .domain(module_Config.domain_o)
            .range(module_Config.range_o);

        module_State.node_values = cc.model.getSources();

        module_State.node_values.forEach(function (o) {
            o.x = scale_X(-o.age);
            o.y = scale_Y(-o.frequency);
        });

        module_State.force_layout = d3.layout.force()
            .nodes(module_State.node_values)
            .size([module_Config.width, module_Config.height])
            .gravity(module_Config.gravity)
            .charge(charge_R)
            .friction(module_Config.friction)
            .on('tick', on_Tick)
            .start();

        module_State.node_elements = module_State.svg.selectAll('.node')
            .data(module_State.node_values)
            .enter().append('circle')
            .attr('class', 'node')
            .attr('cx', function (d) { return d.x; })
            .attr('cy', function (d) { return d.y; })
            .attr('r', scale_R)
            .attr('opacity', scale_O)
            .attr('fill', fill_R)
            .attr('stroke', stroke_R)
            .attr('stroke-width', stroke_Width_R)
            .on('mousedown', function () { d3.event.stopPropagation(); })
            .call(module_State.force_layout.drag);
    };
    
    scale_R = function (d) {
        if (+d.volume === -1) {
            return 5;
        } else if (+d.volume === 0) {
            return 5 * 2.2;
        } else if (+d.volume === 1) {
            return 5 * 2.2 * 2.2;
        } else {
            return 5 * 2.2 * 2.2 * 2.2;
        }
    };

    fill_R = function (d) {
        if (d.service === 'feed') {
            if (d.engagement === 1) {
                return '#ff6200';
            } else if (d.engagement === 0) {
                return '#ff8133';
            } else if (d.engagement === -1) {
                return '#ffa166';
            } else {
                return '#ffffff';
            }
        } else if (d.service === 'flickr') {
            if (d.engagement === 1) {
                return '#ff0084';
            } else if (d.engagement === 0) {
                return '#ff55ad';
            } else if (d.engagement === -1) {
                return '#ff88c6';
            } else {
                return '#ffffff';
            }
        } else if (d.service === 'tumblr') {
            if (d.engagement === 1) {
                return '#172533';
            } else if (d.engagement === 0) {
                return '#2c4762';
            } else if (d.engagement === -1) {
                return '#416991';
            } else {
                return '#ffffff';
            }
        } else if (d.service === 'twitter') {
            if (d.engagement === 1) {
                return '#4099ff';
            } else if (d.engagement === 0) {
                return '#73b4ff';
            } else if (d.engagement === -1) {
                return '#a6cfff';
            } else {
                return '#ffffff';
            }
        } else {
            return '#ffffff';
        }
    };

    stroke_R = function (d) {
        if (d.service === 'feed') {
            return '#ff6200';
        } else if (d.service === 'flickr') {
            return '#ff0084';
        } else if (d.service === 'tumblr') {
            return '#172533';
        } else if (d.service === 'twitter') {
            return '#4099ff';
        } else {
            return '#ffffff';
        }
    };

    stroke_Width_R = function (d) {
        if (d.type === 'crisis') {
            return 3;
        } else if (d.type === 'common') {
            return 1;
        } else {
            return 0;
        }
    };

    charge_R = function (d) {
        var default_charge = -30;
        if (d.volume === 1) {
            return 16 * default_charge;
        }
        else if (d.volume === 0) {
            return 4 * default_charge;
        }
        else { // if (d.volume === -1)
            return default_charge;
        }
    };

    on_Tick = function (e) {
        
        var
        target_x,
        target_y;

        module_State.node_values.forEach(function (o) {

            if (o.type === 'crisis') {
                target_x = 2.0 * module_Config.margin;
            } else if (o.type === 'common') {
                target_x = module_Config.width - 2.0 * module_Config.margin;
            }

            if (o.engagement === 1) {
                target_y = 2.0 * module_Config.margin;
            } else if (o.engagement === 0) {
                target_y = module_Config.height / 2.0;
            } else if (o.engagement === -1) {
                target_y = module_Config.height - 2.0 * module_Config.margin;
            }

            o.x += e.alpha * module_Config.beta_x * (target_x - o.x);
            o.y += e.alpha * module_Config.beta_y * (target_y - o.y);

        });
        
        module_State.node_elements
            .attr('cx', function (d) { return d.x; })
            .attr('cy', function (d) { return d.y; });
    };

    present_Volume = function () {

    };

    return {
        configModule: configModule,
        initModule: initModule
    };

}());
