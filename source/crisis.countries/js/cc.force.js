/*
 * cc.force.js
 */

/* global cc, d3 */

cc.force = (
function () {

    'use strict';

    var
    configModule,
    initModule,
    presentForce;

    var
    module_Config = {
        width: 620, // Needs to be consistent with column spec
        height: 620,
        margin: 31,
        n_margin: 10.0,
        default_R: 10.0,
        domain_x: [-50, 50],
        domain_y: [-50, 50],
        default_C: -125,
        default_G: 1.00,
        friction: 0.90,
        beta_x: 0.20,
        beta_y: 0.10,
        settable: {
            width: true,
            height: true,
            margin: true,
            n_margin: true,
            default_R: true,
            domain_x: true,
            domain_y: true,
            default_C: true,
            default_G: true,
            friction: true,
            beta_x: true,
            beta_y: true
        }
    },
    module_State = {
        nominal_R: undefined,
        nominal_C: {},
        nominal_G: {},
        groups: {},
        layouts: {},
        node_values: {},
        node_elements: {},
        node_descriptions: {},
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
    on_Tick,
    present_Description,
    move_Description,
    dismiss_Description,
    present_Source;

    configModule = function (input_config) {
        cc.util.setConfig(input_config, module_Config);
        return true;
    };

    initModule = function (page_name, svg_size) {

        module_State.page_name = page_name;

        if (svg_size !== undefined && typeof svg_size === 'object') {
            if ('width' in svg_size) {
                module_Config.width = svg_size.width;
            }
            if ('height' in svg_size) {
                module_Config.height = svg_size.height;
            }
            module_Config.margin = (module_Config.width + module_Config.height) / 40;
        }

        scale_X = d3.scale.linear()
            .domain(module_Config.domain_x)
            .range([module_Config.margin, module_Config.width - module_Config.margin]);

        scale_Y = d3.scale.linear()
            .domain(module_Config.domain_y)
            .range([module_Config.height - module_Config.margin, module_Config.margin]);

        module_State.groups[page_name] = d3.select('div#cc-shell-visual-' + page_name + '-graphic')
            .attr('class', 'square')
            .append('svg')
            .attr('class', 'two-thirds column')
            .append('g')
            .attr('class', 'graphic');

        module_State.nominal_R =
            Math.sqrt((module_Config.width * module_Config.height) / (10 * cc.model.getSources().length));

        var sources = $.extend(true, [], cc.model.getSources());
        switch (page_name) {
        case 'volume':
        case 'trust':
        case 'topics':
            module_State.nominal_G[page_name] = module_Config.default_G;
            module_State.nominal_C[page_name] =
                module_Config.default_C * Math.pow(module_State.nominal_R / module_Config.default_R, 2);
            break;

        case 'frequency':
            for(var i_source = sources.length - 1; i_source >= 0; i_source -= 1) {
                if(!sources[i_source].include) {
                    sources.splice(i_source, 1);
                }
            }
            module_State.nominal_G[page_name] = module_Config.default_G / 10.0;
            module_State.nominal_C[page_name] =
                module_Config.default_C * Math.pow(module_State.nominal_R / module_Config.default_R, 2) / 5.0;
            break;

        default:
        }
        module_State.node_values[page_name] = sources;

        module_State.node_values[page_name].forEach(function (o) {
            o.x = scale_X(-o.age);
            o.y = scale_Y(-o.frequency);
            o.r = scale_R(0);
            o.x_0 = scale_X(-o.age);
            o.y_0 = scale_Y(-o.frequency);
        });

        module_State.layouts[page_name] = d3.layout.force()
            .nodes(module_State.node_values[page_name])
            .size([module_Config.width, module_Config.height])
            .gravity(module_State.nominal_G[page_name])
            .charge(charge_R)
            .friction(module_Config.friction)
            .on('tick', on_Tick);

        module_State.node_descriptions[page_name] = d3.select('body')
            .append('div')
            .style('position', 'absolute')
            .style('z-index', '10')
            .style('visibility', 'hidden');

        module_State.node_descriptions[page_name]
            .append('h4');

        module_State.node_elements[page_name] = module_State.groups[page_name].selectAll('.node')
            .data(module_State.node_values[page_name])
            .enter().append('circle')
            .attr('cx', function (d) { return d.x; })
            .attr('cy', function (d) { return d.y; })
            .attr('r', scale_R)
            .attr('opacity', scale_O)
            .attr('fill', fill_R)
            .attr('stroke', stroke_R)
            .attr('stroke-width', stroke_Width_R)
            .on('mousedown', function () { d3.event.stopPropagation(); })
            .on('mouseover', present_Description)
            .on('mousemove', move_Description)
            .on('mouseout', dismiss_Description)
            .on('click', present_Source);
    };

    presentForce = function (page_name) {

        module_State.page_name = page_name;

        module_State.layouts[page_name].start();

        module_State.node_elements[page_name]
            .call(module_State.layouts[page_name].drag);

    };

    present_Description = function (d) {
        var page_name = module_State.page_name;
        module_State.node_descriptions[page_name]
            .select('h4')
            .text(d.name);
        module_State.node_descriptions[page_name]
            .style('visibility', 'visible');
    };

    move_Description = function () {
        var page_name = module_State.page_name;
        module_State.node_descriptions[page_name]
            .style('top', (event.pageY - 10) + 'px')
            .style('left', (event.pageX + 10) + 'px');
    };

    dismiss_Description = function () {
        var page_name = module_State.page_name;
        module_State.node_descriptions[page_name].style('visibility', 'hidden');
    };

    present_Source = function (d) {
        if (!(d.name in cc.model.getSourcePage())) {
            cc.model.setSourcePage(d.name);
            cc.model.setCurrentSource(d.json, d, present_Source);
        } else {
            cc.shell.delegatePage({data: {page_name: cc.model.getSourcePage()[d.name]}});
        }
    };

    scale_R = function (d) {
        if (+d.volume === -1) {
            return module_State.nominal_R / 2;
        } else if (+d.volume === 0) {
            return module_State.nominal_R;
        } else { // if (+d.volume === 1)
            return module_State.nominal_R * 2;
        }
    };

    charge_R = function (d) {
        var page_name = module_State.page_name;
        if (d.volume === -1) {
            return module_State.nominal_C[page_name] / 4;
        }
        else if (d.volume === 0) {
            return module_State.nominal_C[page_name];
        }
        else { // if (d.volume === 1)
            return module_State.nominal_C[page_name] * 4;
        }
    };

    scale_O = function (d) {

        var
        opacity = 0.75,
        page_name = module_State.page_name;

        switch (page_name) {
        case 'volume':
            break;

        case 'trust':
        case 'topics':
        case 'frequency':
            if (+d.engagement === -1) {
                return 0.60;
            } else if (+d.engagement === 0) {
                return 0.75;
            } else if (+d.engagement === 1) {
                return 0.90;
            }
            break;

        default:
        }
        return opacity;
    };

    fill_R = function (d) {

        var
        color = '#FFFFFF',
        page_name = module_State.page_name;

        switch (page_name) {
        case 'volume':
            color = '#979797';
            break;

        case 'trust':
        case 'topics':
        case 'frequency':
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
        case 'frequency':
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
    
    on_Tick = function (e) {

        var
        page_name = module_State.page_name,
        target_x,
        target_y;

        module_State.node_values[page_name].forEach(function (o) {

            switch (page_name) {
            case 'volume':
            case 'trust':
                target_y = module_Config.height / 2.0;
                break;

            case 'topics':
                if (o.type === 'crisis') {
                    target_y = module_Config.height / 2.0 - module_Config.n_margin * module_Config.margin;
                } else if (o.type === 'common') {
                    target_y = module_Config.height / 2.0 + module_Config.n_margin * module_Config.margin;
                }
                break;

            case 'frequency':
                target_y = o.y_0;
                break;

            default:
            }

            switch (page_name) {
            case 'volume':
                if (o.volume === 1) {
                    target_x = module_Config.width / 2.0 + module_Config.n_margin * module_Config.margin / 2.0;
                } else if (o.volume === 0) {
                    target_x = module_Config.width / 2.0;
                } else if (o.volume === -1) {
                    target_x = module_Config.width / 2.0 - module_Config.n_margin * module_Config.margin / 2.0;
                }
                break;

            case 'trust':
            case 'topics':
                if (o.engagement === 1) {
                    target_x = module_Config.width / 2.0 + module_Config.n_margin * module_Config.margin / 2.0;
                } else if (o.engagement === 0) {
                    target_x = module_Config.width / 2.0;
                } else if (o.engagement === -1) {
                    target_x = module_Config.width / 2.0 - module_Config.n_margin * module_Config.margin / 2.0;
                }
                break;

            case 'frequency':
                target_x = o.x_0;
                break;

            default:
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
        presentForce: presentForce
    };

}());
