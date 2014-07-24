/*
 * cc.grid.js
 */

/* global cc, d3 */

cc.grid = (function () {

    'use strict';

    var
    configModule,
    initModule,
    initGrid,
    presentGrid;

    var
    module_Config = {
        width: 600,
        height: 600,
        margin: 30,
        domain_x: [-50, 50],
        domain_y: [-50, 50],
        settable: {
            width: true,
            height: true,
            margin: true,
            domain_x: true,
            domain_y: true
        }
    },
    module_State = {
        groups: {},
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
    present_Description,
    move_Description,
    dismiss_Description;

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

    };

    initGrid = function (page_name) {

        module_State.page_name = page_name;

        module_State.groups[page_name] = d3.select('div#cc-shell-' + page_name + '-column-right')
            .append('svg')
            .attr('width', module_Config.width)
            .attr('height', module_Config.height)
            .append('g')
            .attr('class', 'graphic');

        module_State.node_values[page_name] = $.extend(true, [], cc.model.getSources());

        module_State.node_values[page_name].forEach(function (o) {
            o.x = scale_X(0);
            o.y = scale_Y(0);
            o.r = scale_R(0);
        });

        module_State.node_descriptions[page_name] = d3.select('body')
            .append('div')
            .style('position', 'absolute')
            .style('z-index', '10')
            .style('visibility', 'hidden');

        module_State.node_descriptions[page_name]
            .append('h4');

        module_State.node_elements[page_name] = module_State.groups[page_name].selectAll('circle')
            .data(module_State.node_values[page_name])
            .enter().append('circle')
            .attr('cx', function (d) { return d.x; })
            .attr('cy', function (d) { return d.y; })
            .attr('r', function (d) { return d.r; })
            .on('mouseover', present_Description)
            .on('mousemove', move_Description)
            .on('mouseout', dismiss_Description);

    };
    
    presentGrid = function (page_name) {

        module_State.page_name = page_name;

        module_State.groups[page_name]
            .selectAll('circle')
            .transition().duration(1000)
            .attr('cx', function(d) {return scale_X(-d.age);})
            .attr('cy', function(d) {return scale_Y(-d.frequency);})
            .attr('r', scale_R)
            .attr('opacity', scale_O)
            .attr('fill', fill_R)
            .attr('stroke', stroke_R)
            .attr('stroke-width', stroke_Width_R);

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

    scale_R = function (d) {
        if (+d.volume === -1) {
            return 5;
        } else if (+d.volume === 0) {
            return 5 * 2.2;
        } else if (+d.volume === 1) {
            return 5 * Math.pow(2.2, 2);
        } else {
            return 5 * Math.pow(2.2, 3);
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

    return {
        configModule: configModule,
        initModule: initModule,
        initGrid: initGrid,
        presentGrid: presentGrid
    };

}());
