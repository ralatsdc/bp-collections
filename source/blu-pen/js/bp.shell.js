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
    delegatePage;

    var
    module_Config = {
        country_file_name: '../crisis-countries/json/collection/car.json',
        init_page_name: 'number',
        nav_page_names: ['number',
                         'outwit',
                         'bones',
                         'less',
                         'frames',
                         'tame',
                         'vases',
                         'eliminate',
                         'window'],
        settable: {
            country_file_name: false,
            init_page_name: false,
            nav_page_names: false
        }
    },
    module_State = {
        jq_containers: {},
        uri_anchor: {},
        window_height: undefined,
        header_height: undefined,
        footer_height: undefined,
        body_height: undefined
    },
    init_Header,
    init_Footer,
    init_Body,
    set_Window_Height,
    set_Header_Height,
    set_Footer_Height,
    set_Body_Height,
    set_Footer_Top,
    create_Body,
    create_Text,
    create_Image,
    create_Text_Left,
    create_Text_Right,
    scroll_Page,
    scroll_Down,
    scroll_Up,
    disable_scrolling,
    enable_scrolling,
    present_Page,
    dismiss_Page,
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

        cc.model.configModule({});
        cc.force.configModule({});

        cc.model.initModule(module_Config.country_file_name);

        init_Header();
    };

    getJqContainers = function () {
        return module_State.jq_containers;
    };

    delegatePage = function (event) {
        present_Page(event);
    };

    init_Header = function () {

        set_Window_Height();

        module_State.jq_containers.header =
            module_State.jq_containers.main
            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-header-fixed')
            .addClass('room')
            .css('z-index', 4)

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-header-skeleton')
            .addClass('container row sixteen columns');

        module_State.jq_containers.header
            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-header-logo')
            .addClass('one-third column')
            .click(function () {
                window.open('http://www.blu-pen.com');
            })
            .load('img/bp-logo-two-color-text.svg', function () {
                module_State.jq_containers.header
                    .append('<div></div>')
                    .find('div:last')
                    .attr('id', 'bp-shell-header-navigation')
                    .addClass('two-thirds column')
                    .load('html/bp-shell-header-navigation.html', function () {
                        module_State.jq_containers.header
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
                            .end()

                            .find('#bp-shell-header-nav-to-share')
                            .click({page_name: 'share'}, present_Page)
                            .hover(hover_In, hover_Out)
                            .end();

                        set_Header_Height();

                        init_Footer();
                    })
                    .end();
            })
            .end();
    };

    init_Footer = function () {

        module_State.jq_containers.footer =
            module_State.jq_containers.main
            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-footer-fixed')
            .addClass('room')
            .css('z-index', 2)
        
            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-footer-skeleton')
            .addClass('container row sixteen columns');

        module_State.jq_containers.footer
            .append('<div></div>')
            .find('div:last')
            .addClass('one-third column')
            .load('html/bp-shell-empty.html', function () {
                module_State.jq_containers.footer
                    .append('<div></div>')
                    .find('div:last')
                    .attr('id', 'bp-shell-footer-navigation')
                    .addClass('two-thirds column')
                    .load('html/bp-shell-footer-navigation.html', function () {
                        module_State.jq_containers.footer
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
            .end();
    };

    init_Body = function () {

        set_Body_Height();

        module_State.jq_containers.body =
            module_State.jq_containers.main
            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-body-skeleton')
            .addClass('container row sixteen columns')

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-body-spacer')
            .css('height', module_State.header_height + 'px')
            .end();

        for (var i_pg = 0; i_pg < module_Config.nav_page_names.length; i_pg += 1) {
            create_Body(module_Config.nav_page_names[i_pg]);
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
            parseInt(module_State.jq_containers.header.css('height')) +
            parseInt(module_State.jq_containers.header.css('margin-top')) +
            parseInt(module_State.jq_containers.header.css('margin-bottom'));
    };

    set_Footer_Height = function () {
        module_State.footer_height = 
            parseInt(module_State.jq_containers.footer.css('height')) +
            parseInt(module_State.jq_containers.footer.css('margin-top')) +
            parseInt(module_State.jq_containers.footer.css('margin-bottom'));
    };

    set_Body_Height = function () {
        module_State.body_height = module_State.window_height - module_State.header_height - module_State.footer_height;
    };

    set_Footer_Top = function () {
        var top = 
            module_State.window_height -
            module_State.footer_height;
        module_State.jq_containers.footer
            .css('top', top + 'px');
    };

    create_Body = function (page_name) {

        var page_id = 'bp-shell-' + page_name;

        module_State.jq_containers[page_name] =
            module_State.jq_containers.body
            .append('<div></div>')
            .find('div:last')
            .attr('id', page_id)
            .addClass('row bp-shell-body');

        switch (page_name) {
        case 'number':
        case 'outwit':
        case 'browse':
        case 'news':
            create_Text(page_name);
            break;

        case 'bones':
        case 'frames':
        case 'vases':
        case 'window':
            create_Image(page_name);
            break;

        case 'less':
        case 'eliminate':
            create_Text_Left(page_name);
            break;

        case 'tame':
        case 'connect':
            create_Text_Right(page_name);
            break;

        default:
        }
    };

    create_Text = function (page_name) {

        var jq_container = module_State.jq_containers[page_name];

        switch (page_name) {
        case 'number':
        case 'outwit':
        case 'browse':
        case 'news':
            jq_container
                .load('html/bp-shell-' + page_name + '.html', function () {
                    module_State.jq_containers[page_name]
                        .css('height', module_State.body_height + 'px');
                });
            break;

        default:
        }
    };

    create_Image = function (page_name) {

        var jq_container = module_State.jq_containers[page_name];

        switch (page_name) {
        case 'bones':
        case 'frames':
        case 'vases':
        case 'window':
            jq_container
                .css({'background': 'url(img/bp-' + page_name + '.jpg)',
                      'background-size': 'cover'})
                .append('<div></div>')
                .find('div:last')
                .addClass('one-third column')
                .load('html/bp-shell-empty.html', function () {
                    jq_container
                        .append('<div></div>')
                        .find('div:last')
                        .addClass('two-thirds column')
                        .load('html/bp-shell-' + page_name + '.html', function () {
                            module_State.jq_containers[page_name]
                                .css('height', module_State.body_height + 'px');
                        })
                        .end();
                })
                .end();
            break;

        default:
        }
    };

    create_Text_Left = function (page_name) {

        var jq_container = module_State.jq_containers[page_name];

        switch (page_name) {
        case 'less':
        case 'eliminate':
            jq_container
                .append('<div></div>')
                .find('div:last')
                .attr('id', 'bp-shell-' + page_name + '-content')
                .addClass('two-thirds column')
                .load('html/bp-shell-' + page_name + '-content.html', function () {
                    jq_container
                        .append('<div></div>')
                        .find('div:last')
                        .attr('id', 'bp-shell-' + page_name + '-navigation')
                        .addClass('one-third column')
                        .load('html/bp-shell-' + page_name + '-navigation.html', function () {
                            module_State.jq_containers[page_name]
                                .css('height', module_State.body_height + 'px');
                        })
                        .end();
                })
                .end();
            break;

        default:
        }
    };

    create_Text_Right = function (page_name) {

        var jq_container = module_State.jq_containers[page_name];

        switch (page_name) {
        case 'tame':
        case 'connect':
            jq_container
                .append('<div></div>')
                .find('div:last')
                .attr('id', 'bp-shell-' + page_name + '-navigation')
                .addClass('one-third column')
                .load('html/bp-shell-' + page_name + '-navigation.html', function () {
                    jq_container
                        .append('<div></div>')
                        .find('div:last')
                        .attr('id', 'bp-shell-' + page_name + '-content')
                        .addClass('two-thirds column')
                        .load('html/bp-shell-' + page_name + '-content.html')
                        .end();
                    module_State.jq_containers[page_name]
                        .css('height', module_State.body_height + 'px');
                })
                .end();
            break;

        default:
        }
    };

    scroll_Page = function (scroll_delta) {

        var i_pg, scroll_target;

        disable_scrolling();

        i_pg = module_Config.nav_page_names.indexOf(module_State.uri_anchor.page_name);

        $('#bp-shell-header-nav-to-browse').text(Math.round($('body').scrollTop() / module_State.body_height));
        $('#bp-shell-header-nav-to-connect').text(i_pg);

        i_pg = Math.round($('body').scrollTop() / module_State.body_height);

        if (scroll_delta > 0) {
            i_pg += 1;
            if (i_pg === module_Config.nav_page_names.length) {
                i_pg -= 1;
            }
        } else {
            i_pg -= 1;
            if (i_pg === -1) {
                i_pg += 1;
            }
        }

        scroll_target = i_pg * module_State.body_height;

        $('html, body').animate({scrollTop: scroll_target}, 1200);

        enable_scrolling();

        var uri_anchor = $.uriAnchor.makeAnchorMap();
        uri_anchor.page_name = module_Config.nav_page_names[i_pg];
        $.uriAnchor.setAnchor(uri_anchor);
        module_State.uri_anchor = uri_anchor;

    };

    scroll_Down = function () {
        scroll_Page(+1);
    };

    scroll_Up = function () {
        scroll_Page(-1);
    };

    disable_scrolling = function () {
        $('html, body').css('overflow', 'hidden');
    };

    enable_scrolling = function () {
        window.setTimeout(function () {
            module_State.scroll_top = undefined;
            module_State.scroll_delta = undefined;
            $('html, body').css('overflow', 'auto');
        }, 1200);
    };

    present_Page = function (event) {

        var page_name = event.data.page_name;

        if (module_State.jq_containers[page_name] === undefined) {
            create_Body(page_name);
        }

        if (page_name === 'something') {
            bp.force.presentForce(page_name);
        }

        if (page_name !== module_State.uri_anchor.page_name) {
            dismiss_Page(module_State.uri_anchor.page_name);
        }
        module_State.jq_containers[page_name].fadeIn('slow');

        var uri_anchor = $.uriAnchor.makeAnchorMap();
        uri_anchor.page_name = page_name;
        $.uriAnchor.setAnchor(uri_anchor);
        module_State.uri_anchor = uri_anchor;
    };

    dismiss_Page = function (page_name) {
        if (module_State.jq_containers[page_name] !== undefined &&
            module_State.jq_containers[page_name].css('display') !== 'none') {
            module_State.jq_containers[page_name].slideUp('slow');
        }
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
        for (var i_pg = 0; i_pg < module_Config.nav_page_names.length; i_pg += 1) {
            module_State.jq_containers[module_Config.nav_page_names[i_pg]]
                .css('height', module_State.body_height + 'px');
        }
    };

    return {
        configModule: configModule,
        initModule: initModule,
        getJqContainers: getJqContainers,
        delegatePage: delegatePage
    };

}());
