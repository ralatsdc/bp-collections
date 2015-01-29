/*
 * bp.shell.js
 */

/* global bp, cc */

bp.shell = (function () {

    'use strict';

    var
    configModule,
    initModule,
    getJqContainers,
    delegatePage,
    sendMessage;

    var
    module_Config = {
        page_names: [
            'home',
            'browse',
            'connect',
            'news'
        ],
        section_names: {
            home: [
                'number',
                'outwit',
                'zebras',
                'tame',
                'fashion',
                'eliminate',
                'buildings',
                'preserve',
                'bones',
                'less',
                'window'
            ],
            browse: [
                'browse'
            ],
            connect: [
                'connect'
            ],
            news: [
                'news'
            ]
        },
        init_page_name: 'home',
        country_file_name: '../crisis-countries/json/collection/car.json',
        twitter_tweets_per_day: 500000000,
        tumblr_posts_per_day: 80000000,
        flickr_photos_per_day: 1830000,
        mail_to: 'raymond.leclair@gmail.com',
        settable: {
            page_names: false,
            section_names: false,
            init_page_name: true,
            country_file_name: true,
            twitter_tweets_per_day: false,
            tumblr_posts_per_day: false,
            flickr_photos_per_day: false,
            mail_to: false
        }
    },
    module_State = {
        jq_containers: {},
        uri_anchor: {},
        window_height: undefined,
        header_height: undefined,
        footer_height: undefined,
        section_height: undefined
    },

    init_Header,
    init_Footer,
    init_Body,

    set_Window_Height,
    set_Header_Height,
    set_Footer_Height,
    set_Section_Height,

    set_Footer_Top,

    create_Body,
    create_Text,
    create_Image,
    create_Text_Left,
    create_Text_Right,

    present_Page,
    dismiss_Page,

    scroll_To_Section,
    scroll_Down,
    scroll_Up,
    disable_scrolling,
    enable_scrolling,

    hover_In,
    hover_Out,
    on_Hash_Change,
    on_Resize;

    configModule = function (input_config) {
        bp.util.setConfig(input_config, module_Config);
        return true;
    };

    initModule = function (jq_container) {

        module_State.jq_containers.main =
            jq_container;

        bp.model.configModule({});

        bp.tumblr.configModule({});
        bp.tumblr.initModule({});

        cc.model.configModule({});
        // TODO: Look at initializing the cc model when needed with a callback
        cc.model.initModule(module_Config.country_file_name);

        cc.force.configModule({});

        init_Header();
    };

    getJqContainers = function () {
        return module_State.jq_containers;
    };

    delegatePage = function (event) {
        present_Page(event);
    };

    sendMessage = function () {
        window.setTimeout(
            function () {
                var event = {data: {page_name: 'browse'}};
                present_Page(event);
            }, 2000);
        var win = window.open('mailto:' + module_Config.mail_to);
        win.setTimeout(
            function () {
                if (win && win.open && !win.closed) {
                    win.close();
                }
            }, 1000);
    };

    init_Header = function () {

        set_Window_Height();

        module_State.jq_containers.header_fixed =
            module_State.jq_containers.main
            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-header-fixed')
            .addClass('room')
            .css('z-index', 4);

        module_State.jq_containers.header_skeleton =
            module_State.jq_containers.header_fixed
            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-header-skeleton')
            .addClass('container row sixteen columns');

        module_State.jq_containers.header_skeleton
            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-header-logo')
            .addClass('one-third column')
            .click({page_name: 'home'}, present_Page)
            .load('img/bp-logo-two-color-text.svg', function () {
                module_State.jq_containers.header_skeleton
                    .append('<div></div>')
                    .find('div:last')
                    .attr('id', 'bp-shell-header-navigation')
                    .addClass('two-thirds column navigation')
                    .load('html/bp-shell-header-navigation.html', function () {
                        module_State.jq_containers.header_skeleton
                            .find('#bp-shell-header-nav-to-browse')
                            .click({page_name: 'browse'}, present_Page)
                            .hover(hover_In, hover_Out)
                            .end()

                            .find('#bp-shell-header-nav-to-connect')
                            .click({page_name: 'connect'}, present_Page)
                            .hover(hover_In, hover_Out)
                            .end()

                            .find('#bp-shell-header-nav-to-news')
                            .click({page_name: 'news'}, present_Page)
                            .hover(hover_In, hover_Out)
                            .end();

                        set_Header_Height();

                        init_Footer();
                    })
                    .end();
            })
            .end()
            .end();
    };

    init_Footer = function () {

        module_State.jq_containers.footer_fixed =
            module_State.jq_containers.main
            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-footer-fixed')
            .addClass('room')
            .css('z-index', 2);

        module_State.jq_containers.footer_skeleton =
            module_State.jq_containers.footer_fixed
            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-footer-skeleton')
            .addClass('container row sixteen columns');

        module_State.jq_containers.footer_skeleton
            .append('<div></div>')
            .find('div:last')
            .addClass('one-third column')
            .load('html/bp-shell-empty.html', function () {
                module_State.jq_containers.footer_skeleton
                    .append('<div></div>')
                    .find('div:last')
                    .attr('id', 'bp-shell-footer-navigation')
                    .addClass('two-thirds column navigation')
                    .load('html/bp-shell-footer-navigation.html', function () {
                        module_State.jq_containers.footer_skeleton
                            .find('#bp-shell-footer-nav-down')
                            .click(scroll_Down)
                            .hover(hover_In, hover_Out)
                            .end()

                            .find('#bp-shell-footer-nav-up')
                            .click(scroll_Up)
                            .hover(hover_In, hover_Out)
                            .end();

                        set_Footer_Height();

                        set_Footer_Top();

                        init_Body();
                    })
                    .end();
            })
            .end()
            .end();
    };

    init_Body = function () {

        var i_p, page_names;

        set_Section_Height();

        module_State.jq_containers.body =
            module_State.jq_containers.main
            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-body-scrolling')
            .addClass('container row sixteen columns')

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-body-spacer')
            .css('height', module_State.header_height + 'px')
            .end();

        page_names = module_Config.page_names;
        for (i_p = 0; i_p < page_names.length; i_p += 1) {
            create_Body(page_names[i_p]);
        }

        $(window).bind('hashchange', on_Hash_Change);
        $(window).bind('resize', on_Resize);
    };

    set_Window_Height = function () {
        var
        w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0];
        // width = w.innerWidth || e.clientWidth || g.clientWidth;
        module_State.window_height = w.innerHeight|| e.clientHeight|| g.clientHeight;
    };

    set_Header_Height = function () {
        module_State.header_height = 
            parseInt(module_State.jq_containers.header_skeleton.css('height')) +
            parseInt(module_State.jq_containers.header_skeleton.css('margin-top')) +
            parseInt(module_State.jq_containers.header_skeleton.css('margin-bottom'));
    };

    set_Footer_Height = function () {
        module_State.footer_height = 
            parseInt(module_State.jq_containers.footer_skeleton.css('height')) +
            parseInt(module_State.jq_containers.footer_skeleton.css('margin-top')) +
            parseInt(module_State.jq_containers.footer_skeleton.css('margin-bottom'));
    };

    set_Section_Height = function () {
        module_State.section_height = module_State.window_height - module_State.header_height - module_State.footer_height;
    };

    set_Footer_Top = function () {
        var top = 
            module_State.window_height -
            module_State.footer_height;
        module_State.jq_containers.footer_fixed
            .css('top', top + 'px');
    };

    create_Body = function (page_name) {

        var
        page_id = 'bp-shell-' + page_name,
        section_names = module_Config.section_names[page_name];

        module_State.jq_containers[page_name] =
            module_State.jq_containers.body
            .append('<div></div>')
            .find('div:last')
            .attr('id', page_id)
            .addClass('row bp-shell-body')
            .css('display', 'none');

        for (var i_s = 0; i_s < section_names.length; i_s += 1) {
            var
            section_name = section_names[i_s],
            section_id = 'bp-shell-' + page_name + '-' + section_name;

            module_State.jq_containers[page_name + '-' + section_name] =
                module_State.jq_containers[page_name]
                .append('<div></div>')
                .find('div:last')
                .attr('id', section_id);

            switch (section_name) {
            case 'number':
                module_State.jq_containers[page_name + '-' + section_name]
                    .addClass('centered');
                create_Text(page_name, section_name);
                break;

            case 'outwit':
            case 'browse':
                create_Text(page_name, section_name);
                break;

            case 'zebras':
            case 'fashion':
            case 'buildings':
            case 'bones':
                create_Image(page_name, section_name);
                break;

            case 'window':
                create_Image(page_name, section_name, present_Page, {page_name: 'home'});
                break;

            case 'tame':
            case 'preserve':
                create_Text_Left(page_name, section_name);
                break;

            case 'eliminate':
            case 'less':
            case 'connect':
                create_Text_Right(page_name, section_name);
                break;
                
            case 'news':
                bp.tumblr.createNews({data: {page_name: page_name, section_name: section_name}});
                break;

            default:
            }
        }
    };

    create_Text = function (page_name, section_name, callback, data) {

        var jq_container = module_State.jq_containers[page_name + '-' + section_name];

        switch (section_name) {
        case 'number':
            jq_container
                .load('html/bp-shell-' + section_name + '.html', function () {
                    jq_container
                        .addClass('bp-shell-section');
                    on_Resize();
                    var
                    interval = 100,
                    counter = 0,
                    rate =
                        (module_Config.flickr_photos_per_day +
                         module_Config.tumblr_posts_per_day +
                         module_Config.twitter_tweets_per_day) / 86400000;
                    // [photos|posts|tweets/ms] = [photos|posts|tweets/day] / [ms/day]
                    window.setInterval(function () {
                        counter += Math.round(interval * rate);
                        $('#bp-shell-counter').text(counter.toLocaleString());
                    }, interval);
                    if (callback !== undefined && typeof callback === 'function') {
                        if (data !== undefined) {
                            callback({data: data});
                        } else {
                            callback();
                        }
                    }
                });
            break;

        case 'outwit':
        case 'browse':
            jq_container
                .load('html/bp-shell-' + section_name + '.html', function () {
                    if (['browse'].indexOf(section_name) === -1) {
                        jq_container
                            .addClass('bp-shell-section');
                        on_Resize();
                    }
                    if (callback !== undefined && typeof callback === 'function') {
                        if (data !== undefined) {
                            callback({data: data});
                        } else {
                            callback();
                        }
                    }
                });
            break;

        default:
        }
    };

    create_Image = function (page_name, section_name, callback, data) {

        var jq_container = module_State.jq_containers[page_name + '-' + section_name];

        switch (section_name) {
        case 'zebras':
        case 'fashion':
        case 'buildings':
        case 'bones':
        case 'window':
            jq_container
                .css({'background': 'url(img/bp-' + section_name + '.jpg)',
                      'background-size': 'cover'})
                .append('<div></div>')
                .find('div:last')
                .addClass('one-third column')
                .load('html/bp-shell-empty.html', function () {
                    jq_container
                        .append('<div></div>')
                        .find('div:last')
                        .addClass('two-thirds column caption')
                        .load('html/bp-shell-' + section_name + '.html', function () {
                            jq_container
                                .addClass('bp-shell-section');
                            on_Resize();
                            if (callback !== undefined && typeof callback === 'function') {
                                if (data !== undefined) {
                                    callback({data: data});
                                } else {
                                    callback();
                                }
                            }
                        })
                        .end();
                })
                .end();
            break;

        default:
        }
    };

    create_Text_Left = function (page_name, section_name, callback, data) {

        var jq_container = module_State.jq_containers[page_name + '-' + section_name];

        switch (section_name) {
        case 'tame':
        case 'preserve':
            jq_container
                .append('<div></div>')
                .find('div:last')
                .attr('id', 'bp-shell-' + section_name + '-content')
                .addClass('two-thirds column')
                .load('html/bp-shell-' + section_name + '-content.html', function () {
                    jq_container
                        .append('<div></div>')
                        .find('div:last')
                        .attr('id', 'bp-shell-' + section_name + '-navigation')
                        .addClass('one-third column')
                        .load('html/bp-shell-' + section_name + '-navigation.html', function () {
                            jq_container
                                .addClass('bp-shell-section');
                            on_Resize();
                            if (callback !== undefined && typeof callback === 'function') {
                                if (data !== undefined) {
                                    callback({data: data});
                                } else {
                                    callback();
                                }
                            }
                        })
                        .end();
                })
                .end();
            break;

        default:
        }
    };

    create_Text_Right = function (page_name, section_name, callback, data) {

        var jq_container = module_State.jq_containers[page_name + '-' + section_name];

        switch (section_name) {
        case 'eliminate':
            jq_container
                .append('<div></div>')
                .find('div:last')
                .attr('id', 'bp-shell-' + section_name + '-content')
                .addClass('two-thirds column')
                .load('html/bp-shell-' + section_name + '-content.html', function () {
                    jq_container
                        .append('<div></div>')
                        .find('div:last')
                        .addClass('one-third column')

                        .append('<div></div>')
                        .find('div:last')
                        .attr('id', 'cc-shell-visual-trust-graphic')
                        .addClass('bp-shell-content')
                        .end()

                        .append('<div></div>')
                        .find('div:last')
                        .attr('id', 'bp-shell-' + section_name + '-navigation')
                        .load('html/bp-shell-' + section_name + '-navigation.html', function () {
                            jq_container
                                .addClass('bp-shell-section');
                            on_Resize();
                            cc.force.initModule('trust');
                            cc.force.presentForce('trust');
                            if (callback !== undefined && typeof callback === 'function') {
                                if (data !== undefined) {
                                    callback({data: data});
                                } else {
                                    callback();
                                }
                            }
                        })
                        .end()
                        .end();
                })
                .end();
            break;

        case 'less':
        case 'connect':
            jq_container
                .append('<div></div>')
                .find('div:last')
                .attr('id', 'bp-shell-' + section_name + '-navigation')
                .addClass('one-third column')
                .load('html/bp-shell-' + section_name + '-navigation.html', function () {
                    jq_container
                        .append('<div></div>')
                        .find('div:last')
                        .attr('id', 'bp-shell-' + section_name + '-content')
                        .addClass('two-thirds column')
                        .load('html/bp-shell-' + section_name + '-content.html')
                        .end();
                    if (['connect'].indexOf(section_name) === -1) {
                        jq_container
                            .addClass('bp-shell-section');
                        on_Resize();
                    }
                    if (callback !== undefined && typeof callback === 'function') {
                        if (data !== undefined) {
                            callback({data: data});
                        } else {
                            callback();
                        }
                    }
                })
                .end();
            break;

        default:
        }
    };

    present_Page = function (event) {

        var page_name, jq_container, uri_anchor;

        page_name = module_State.uri_anchor.page_name;
        jq_container = module_State.jq_containers[page_name];

        if (jq_container !== undefined && jq_container.css('display') !== 'none') {
            dismiss_Page(event);

        } else {
            page_name = event.data.page_name;
            jq_container = module_State.jq_containers[page_name];

            jq_container.fadeIn('slow');

            uri_anchor = $.uriAnchor.makeAnchorMap();
            uri_anchor.page_name = page_name;
            $.uriAnchor.setAnchor(uri_anchor);
            module_State.uri_anchor = uri_anchor;
        }
    };

    dismiss_Page = function (event) {

        var page_name, jq_container;

        page_name = module_State.uri_anchor.page_name;
        jq_container = module_State.jq_containers[page_name];

        jq_container.fadeOut('slow', function () {
            present_Page(event);
        });
    };

    scroll_Down = function () {

        var
        page_name = module_State.uri_anchor.page_name,
        section_names = module_Config.section_names[page_name],
        i_s = Math.ceil($('body').scrollTop() / module_State.section_height);

        if (0 < i_s && i_s < section_names.length) {
            i_s -= 1;
            scroll_To_Section(page_name, section_names[i_s]);
        }
    };

    scroll_Up = function () {

        var
        page_name = module_State.uri_anchor.page_name,
        section_names = module_Config.section_names[page_name],
        i_s = Math.floor($('body').scrollTop() / module_State.section_height);

        if (-1 < i_s && i_s < section_names.length - 1) {
            i_s += 1;
            scroll_To_Section(page_name, section_names[i_s]);
        }
    };

    scroll_To_Section = function (page_name, section_name) {

        var
        section_names = module_Config.section_names[page_name],
        i_s = section_names.indexOf(section_name),
        scroll_target = i_s * module_State.section_height;

        disable_scrolling();
        $('html, body').animate({scrollTop: scroll_target}, 1200, enable_scrolling);
    };

    disable_scrolling = function () {
        $('html, body').css('overflow', 'hidden');
    };

    enable_scrolling = function () {
        $('html, body').css('overflow', 'auto');
    };

    hover_In = function () {
        $(this).animate({'color': '#1AB6E5'}, 100);
    };

    hover_Out = function () {
        $(this).animate({'color': '#000000'}, 100);
    };

    on_Hash_Change = function () {
        var uri_anchor = $.uriAnchor.makeAnchorMap();
        if (uri_anchor.page_name !== module_State.uri_anchor.page_name) {
            present_Page({data: uri_anchor});
        }
    };

    on_Resize = function () {
        set_Window_Height();
        set_Header_Height();
        set_Footer_Height();
        set_Footer_Top();
        set_Section_Height();
        $('.bp-shell-section').css('height', module_State.section_height + 'px');
        $('.caption').css('margin-top', 0.618 * module_State.section_height + 'px');
    };

    return {
        configModule: configModule,
        initModule: initModule,
        getJqContainers: getJqContainers,
        delegatePage: delegatePage,
        sendMessage: sendMessage
    };

}());
