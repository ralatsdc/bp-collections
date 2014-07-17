/*
 * cc.force.js
 */

/* global cc, d3 */

cc.force = (function () {

    'use strict';

    var
    configModule,
    initModule,
    initForce,
    presentForce;

    var
    module_Config = {
        width: 600,
        height: 600,
        margin: 30,
        n_margin: 4.0,
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
            n_margin: true,
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
        svgs: {},
        layouts: {},
        node_values: {},
        node_elements: {},
        page_name: undefined
    },
    scale_X,
    scale_Y,
    scale_R,
    scale_O,
    fill_R,
    stroke_R,
    stroke_Width_R,
    charge_R,
    on_Tick;

    configModule = function (input_config) {
        cc.util.setConfig(input_config, module_Config);
        return true;
    };

    initModule = function () {

        scale_X = d3.scale.linear()
            .domain(module_Config.domain_x)
            .range([module_Config.margin, module_Config.width - module_Config.margin]);

        scale_Y = d3.scale.linear()
            .domain(module_Config.domain_y)
            .range([module_Config.height - module_Config.margin, module_Config.margin]);

        scale_O = d3.scale.linear()
            .domain(module_Config.domain_o)
            .range(module_Config.range_o);

    };

    initForce = function (page_name) {

        module_State.page_name = page_name;

        module_State.svgs[page_name] = d3.select('div#cc-shell-' + page_name + '-column-right')
            .append('svg')
            .attr('width', module_Config.width)
            .attr('height', module_Config.height);

        module_State.node_values[page_name] = cc.model.getSources();
        // module_State.node_values[page_name] = $.extend({}, cc.model.getSources());
        // module_State.node_values[page_name] = $.extend(true, {}, cc.model.getSources());

        module_State.node_values[page_name].forEach(function (o) {
            o.x = scale_X(-o.age);
            o.y = scale_Y(-o.frequency);
        });

        module_State.layouts[page_name] = d3.layout.force()
            .nodes(module_State.node_values[page_name])
            .size([module_Config.width, module_Config.height])
            .gravity(module_Config.gravity)
            .charge(charge_R)
            .friction(module_Config.friction)
            .on('tick', on_Tick);

        module_State.node_elements[page_name] = module_State.svgs[page_name].selectAll('.node')
            .data(module_State.node_values[page_name])
            .enter().append('circle')
            .attr('class', 'node')
            .attr('cx', function (d) { return d.x; })
            .attr('cy', function (d) { return d.y; })
            .attr('r', scale_R)
            .attr('opacity', scale_O)
            .attr('fill', fill_R)
            .attr('stroke', stroke_R)
            .attr('stroke-width', stroke_Width_R)
            .on('mousedown', function () { d3.event.stopPropagation(); });

    };
    
    presentForce = function (page_name) {

        module_State.page_name = page_name;

        module_State.layouts[page_name].stop();

        /*
        module_State.node_values[page_name].forEach(function (o) {
            o.x = scale_X(-o.age);
            o.y = scale_Y(-o.frequency);
        });
        */

        module_State.layouts[page_name].start();

        module_State.node_elements[page_name]
            .call(module_State.layouts[page_name].drag);

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

        var
        color = '#FFFFFF',
        page_name = module_State.page_name;

        switch (page_name) {
        case 'volume':
            if (d.engagement === 1) {
                color = '#494949';
            } else if (d.engagement === 0) {
                color = '#7D7D7D';
            } else if (d.engagement === -1) {
                color = '#CBCBCB';
            }
            break;

        case 'trust':
        case 'topics':
            if (d.service === 'feed') {
                if (d.engagement === 1) {
                    color = '#973E00';
                } else if (d.engagement === 0) {
                    color = '#CB5200';
                } else if (d.engagement === -1) {
                    color = '#FF6600';
                }
            } else if (d.service === 'flickr') {
                if (d.engagement === 1) {
                    color = '#7D0043';
                } else if (d.engagement === 0) {
                    color = '#B1005D';
                } else if (d.engagement === -1) {
                    color = '#FF0084';
                }
            } else if (d.service === 'tumblr') {
                if (d.engagement === 1) {
                    color = '#32506D';
                } else if (d.engagement === 0) {
                    color = '#71869A';
                } else if (d.engagement === -1) {
                    color = '#9BAAB8';
                }
            } else if (d.service === 'twitter') {
                if (d.engagement === 1) {
                    color = '#1AB6E5';
                } else if (d.engagement === 0) {
                    color = '#79DEFF';
                } else if (d.engagement === -1) {
                    color = '#BEEDFF';
                }
            }
            break;
            
        case 'frequency':
            break;

        default:
        }
        return color;
    };

    stroke_R = function (d) {

        var
        color = '',
        page_name = module_State.page_name;

        switch (page_name) {
        case 'volume':
        case 'trust':
            break;

        case 'topics':
            if (d.service === 'feed') {
                color = '#973E00';
            } else if (d.service === 'flickr') {
                color = '#7D0043';
            } else if (d.service === 'tumblr') {
                color = '#32506D';
            } else if (d.service === 'twitter') {
                color = '#1AB6E5';
            } else {
                color = '#FFFFFF';
            }
            break;

        case 'frequency':
            break;

        default:
        }
        return color;
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
        page_name = module_State.page_name,
        target_x,
        target_y;

        module_State.node_values[page_name].forEach(function (o) {

            switch (page_name) {
            case 'volume':
            case 'trust':
                target_x = module_Config.width / 2.0;
                break;

            case 'topics':
                if (o.type === 'crisis') {
                    target_x = module_Config.width / 2.0 - module_Config.n_margin * module_Config.margin;
                } else if (o.type === 'common') {
                    target_x = module_Config.width / 2.0 + module_Config.n_margin * module_Config.margin;
                }
                break;

            case 'frequency':
                break;

            default:
            }

            if (o.engagement === 1) {
                target_y = module_Config.height / 2.0 - module_Config.n_margin * module_Config.margin;
            } else if (o.engagement === 0) {
                target_y = module_Config.height / 2.0;
            } else if (o.engagement === -1) {
                target_y = module_Config.height / 2.0 + module_Config.n_margin * module_Config.margin;
            }

            o.x += e.alpha * module_Config.beta_x * (target_x - o.x);
            o.y += e.alpha * module_Config.beta_y * (target_y - o.y);

        });
        
        module_State.node_elements[page_name]
            .attr('cx', function (d) { return d.x; })
            .attr('cy', function (d) { return d.y; });
    };

    return {
        configModule: configModule,
        initModule: initModule,
        initForce: initForce,
        presentForce: presentForce
    };

}());
