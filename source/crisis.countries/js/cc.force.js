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
    presentForce,
    resizeVolumeLegend,
    resizeTrustLegend,
    resizeTopicsLegend,
    resizeFrequencyAxes;

    var
    module_Config = {
        width: 620,
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
        svgs: {},
        groups: {},
        layouts: {},
        node_values: {},
        node_elements: {},
        node_descriptions: {},
        legends: {},
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
    append_Circle,
    get_Scale,
    present_Description,
    move_Description,
    dismiss_Description,
    present_Source;

    configModule = function (input_config) {
        cc.util.setConfig(input_config, module_Config);
        return true;
    };

    initModule = function (page_name, options) {

        module_State.page_name = page_name;

        if (options !== undefined && typeof options === 'object') {
            if ('width' in options) {
                module_Config.width = options.width;
            }
            if ('height' in options) {
                module_Config.height = options.height;
            }
            module_Config.margin = (module_Config.width + module_Config.height) / 40;
        }

        scale_X = d3.scale.linear()
            .domain(module_Config.domain_x)
            .range([module_Config.margin, module_Config.width - module_Config.margin]);

        scale_Y = d3.scale.linear()
            .domain(module_Config.domain_y)
            .range([module_Config.height - module_Config.margin, module_Config.margin]);

        module_State.svgs[page_name] = d3.select('div#cc-shell-visual-' + page_name + '-graphic')
            .append('svg')
            .attr('viewBox', '0 0 ' + module_Config.width + ' ' + module_Config.height)
            .attr('overflow', 'visible');

        module_State.groups[page_name] = module_State.svgs[page_name]
            .append('g');

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

        switch (page_name) {
        case 'volume':
            append_Circle('volume', 'div#cc-shell-visual-volume-large-circle', '+1');
            append_Circle('volume', 'div#cc-shell-visual-volume-medium-circle', '0');
            append_Circle('volume', 'div#cc-shell-visual-volume-small-circle', '-1');
            d3.select(window)
                .on('resize', resizeVolumeLegend);
            break;

        case 'trust':
            d3.select(window)
                .on('resize', resizeTrustLegend);
            break;

        case 'topics':
            d3.select(window)
                .on('resize', resizeTopicsLegend);
            break;

        case 'frequency':
            d3.select(window)
                .on('resize', resizeFrequencyAxes);
            break;

        default:
        }
    };

    presentForce = function (page_name) {

        module_State.page_name = page_name;

        module_State.layouts[page_name].start();

        module_State.node_elements[page_name]
            .call(module_State.layouts[page_name].drag);

        switch (page_name) {
        case 'volume':
            resizeVolumeLegend();
            break;

        case 'trust':
            resizeTrustLegend();
            break;

        case 'topics':
            resizeTopicsLegend();
            break;

        case 'frequency':
            var axis_X = d3.svg.axis().scale(scale_X).orient('bottom');
            var axis_Y = d3.svg.axis().scale(scale_Y).orient('left');
            module_State.svgs[page_name]
                .append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0, ' + scale_X(0.0) + ')') 
                .call(axis_X);
            module_State.svgs[page_name]
                .append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(' + scale_X(-50.0) + ', 0)')
                .call(axis_Y);
            resizeFrequencyAxes();
            break;

        default:
        }
    };

    append_Circle = function (page_name, selector, volume) {
        
        var
        scale = get_Scale(),
        R = scale_R({volume: volume}),
        width = 2.0 * R * scale,
        height = 2.0 * R * scale;

        module_State.legends[page_name] = d3.select(selector)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('class', 'graphic')
            .append('circle')
            .attr('cx', scale_R({volume: volume}))
            .attr('cy', scale_R({volume: volume}))
            .attr('r', scale_R({volume: volume}))
            .attr('opacity', scale_O({engagement: '0'}))
            .attr('fill', fill_R({engagement: '0'}));
    };

    resizeVolumeLegend = function () {

        var
        volume = [-1, 0, 1],
        size = ['small', 'medium', 'large'],
        scale = get_Scale(),
        R,
        width,
        height;

        for (var i_crcl = 0; i_crcl < size.length; i_crcl += 1) {
            
            R = scale_R({volume: volume[i_crcl]});
            width = 2.05 * R * scale;
            height = 2.05 * R * scale;
        
            d3.select('div#cc-shell-visual-volume-' + size[i_crcl] + '-circle svg')
                .attr('width',  width)
                .attr('height', height);
        }
    };

    resizeTrustLegend = function () {

        var
        scale = get_Scale() + 0.05,
        height = 20 * scale;

        d3.selectAll('div#cc-shell-visual-trust-description svg')
            .attr('height', height);
    };

    resizeTopicsLegend = function () {

        var
        scale = get_Scale() + 0.05,
        width = 44 * scale,
        height = 44 * scale;

        d3.selectAll('div#cc-shell-visual-topics-description svg')
            .attr('width', width)
            .attr('height', height);
    };

    resizeFrequencyAxes = function () {

        var
        scale = get_Scale(),
        font_size = 14 / scale,
        text_anchor = 'end';

        // <text y="9" x="0" dy=".71em" style="text-anchor: middle;">0</text>

        d3.selectAll('div#cc-shell-visual-frequency-graphic g.x.axis text')
            .attr('style', 'font-size: ' + font_size + 'px; text-anchor: middle;');

        // <text x="-9" y="0" dy=".32em" style="text-anchor: end;">0</text>

        if (scale === 0.4838) {
            text_anchor = 'start';
        }
        d3.selectAll('div#cc-shell-visual-frequency-graphic g.y.axis text')
            .attr('style', 'font-size: ' + font_size + 'px; text-anchor: ' + text_anchor + ';');
    };

    get_Scale = function () {

        var
        w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        // y = w.innerHeight|| e.clientHeight|| g.clientHeight,
        scale = 1.0;

        // @media only screen and (min-width: 768px) and (max-width: 959px)
        if (768 < x && x < 959) {
            scale = 0.7935;
        }
        // @media only screen and (max-width: 767px)
        if (x < 767) {
            scale = 0.4838;
        }
        // @media only screen and (min-width: 480px) and (max-width: 767px)
        if (480 < x && x < 767) {
            scale = 0.6774;
        }
        return scale;
    };

    present_Description = function (d) {
        var page_name = module_State.page_name;
        module_State.node_descriptions[page_name]
            .select('h4')
            .attr('class', 'extrabold')
            .text(d.name);

        module_State.node_descriptions[page_name]
            .style('visibility', 'visible');
    };

    move_Description = function () {
        var page_name = module_State.page_name;
        module_State.node_descriptions[page_name]
            .style('top', (d3.event.pageY - 10) + 'px')
            .style('left', (d3.event.pageX + 10) + 'px');
    };

    dismiss_Description = function () {
        var page_name = module_State.page_name;
        module_State.node_descriptions[page_name].style('visibility', 'hidden');
    };

    present_Source = function (d) {
        var sources = cc.model.getSources();
        for (var i_src = 1; i_src < sources.length; i_src += 1) {
            if (d.name === sources[i_src].name &&
                d.json === sources[i_src].json) {
                break;
            }
        }
        window.open('http://localhost:8080/crisis.countries/#!page_name=source&source_index=' + i_src);
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

    stroke_R = function () {

        var
        color = '',
        page_name = module_State.page_name;

        switch (page_name) {
        case 'volume':
        case 'trust':
            break;

        case 'topics':
        case 'frequency':
            color = '#B10000';
            break;

        default:
        }
        return color;
    };

    stroke_Width_R = function (d) {
        if (d.type === 'crisis') {
            return 3;
        } else if (d.type === 'common') {
            return 0;
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
        presentForce: presentForce,
        resizeVolumeLegend: resizeVolumeLegend,
        resizeTrustLegend: resizeTrustLegend,
        resizeTopicsLegend: resizeTopicsLegend,
        resizeFrequencyAxes: resizeFrequencyAxes
    };

}());
