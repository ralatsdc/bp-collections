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
        uri_anchor: {}
    },
    init_Page,
    present_Page,
    dismiss_Page,
    create_Body,
    create_Text,
    create_Image,
    create_Text_Left,
    create_Text_Right,
    page_Down,
    page_Up,
    on_Hash_Change,
    hover_In,
    hover_Out;

    configModule = function (input_config) {
        bp.util.setConfig(input_config, module_Config);
        return true;
    };

    initModule = function (jq_container) {

        module_State.jq_containers.main =
            jq_container
            .addClass('container sixteen columns');

        cc.model.configModule({});
        cc.force.configModule({});

        cc.model.initModule(module_Config.country_file_name);

        var uri_anchor = $.uriAnchor.makeAnchorMap();

        $(window).bind('hashchange', on_Hash_Change);

        var page_name;
        if ('page_name' in uri_anchor) {
            page_name = uri_anchor.page_name;
        } else {
            page_name = module_Config.init_page_name;
        }
        init_Page();
        // present_Page({data: {page_name: page_name}});

        for (var i_pg = 0; i_pg < module_Config.nav_page_names.length; i_pg += 1) {
            create_Body(module_Config.nav_page_names[i_pg]);
        }

    };

    getJqContainers = function () {
        return module_State.jq_containers;
    };

    delegatePage = function (event) {
        present_Page(event);
    };

    init_Page = function () {

        // header

        module_State.jq_containers.header =
            module_State.jq_containers.main
            .append('<div></div>')
            .find('div:last')
            .addClass('row')
            .attr('id', 'bp-shell-header')

            .append('<div></div>')
            .find('div:last')
            .addClass('one-third column')
            .attr('id', 'bp-shell-header-logo')
            .click(function () {
                window.open('http://www.blu-pen.com');
            })
            .load('img/bp-logo-two-color-text.svg')
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('two-thirds column')
            .attr('id', 'bp-shell-header-navigation')
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
            })
            .end();

        // body

        module_State.jq_containers.body =
            module_State.jq_containers.main
            .append('<div></div>')
            .find('div:last')
            .addClass('bp-shell-page')
            .attr('id', 'bp-shell-body');

        // footer

        module_State.jq_containers.footer =
            module_State.jq_containers.main
            .append('<div></div>')
            .find('div:last')
            .addClass('row')
            .attr('id', 'bp-shell-footer')

            .append('<div></div>')
            .find('div:last')
            .addClass('one-third column')
            .load('html/bp-shell-empty.html')
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('two-thirds column')
            .attr('id', 'bp-shell-footer-navigation')
            .load('html/bp-shell-footer-navigation.html', function () {
                module_State.jq_containers.footer
                    .find('#bp-shell-footer-nav-down')
                    .click(page_Down)
                    .hover(hover_In, hover_Out)
                    .end()

                    .find('#bp-shell-footer-nav-up')
                    .click(page_Up)
                    .hover(hover_In, hover_Out)
                    .end();
            })
            .end();
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
        module_State.jq_containers[page_name].slideDown('slow');

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

    create_Body = function (page_name) {

        var page_id = 'bp-shell-' + page_name;

        module_State.jq_containers[page_name] =
            module_State.jq_containers.body
            .append('<div></div>')
            .find('div:last')
            .addClass('row')
            .attr('id', page_id);
            // .css('display', 'none');

        switch (page_name) {
        case 'number':
        case 'outwit':
        case 'browse':
        case 'news':
            create_Text(module_State.jq_containers[page_name], page_name);
            break;

        case 'bones':
        case 'frames':
        case 'vases':
        case 'window':
            create_Image(module_State.jq_containers[page_name], page_name);
            break;

        case 'less':
        case 'eliminate':
            create_Text_Left(module_State.jq_containers[page_name], page_name);
            break;

        case 'tame':
        case 'connect':
            create_Text_Right(module_State.jq_containers[page_name], page_name);
            break;

        default:
        }
    };

    create_Text = function (jq_container, page_name) {

        switch (page_name) {
        case 'number':
        case 'outwit':
        case 'browse':
        case 'news':
            jq_container
                .load('html/bp-shell-' + page_name + '.html');
            break;

        default:
        }

    };

    create_Image = function (jq_container, page_name) {

        switch (page_name) {
        case 'bones':
        case 'frames':
        case 'vases':
        case 'window':
            jq_container
                .css('background', 'url(img/bp-' + page_name + '.jpg)')

                .append('<div></div>')
                .find('div:last')
                .addClass('one-third column')
                .load('html/bp-shell-empty.html')
                .end()

                .append('<div></div>')
                .find('div:last')
                .addClass('two-thirds column')
                .load('html/bp-shell-' + page_name + '.html');

            break;

        default:
        }

    };

    create_Text_Left = function (jq_container, page_name) {

        switch (page_name) {
        case 'less':
        case 'eliminate':
            jq_container
                .append('<div></div>')
                .find('div:last')
                .addClass('two-thirds column')
                .attr('id', 'bp-shell-' + page_name + '-content')
                .load('html/bp-shell-' + page_name + '-content.html')
                .end()

                .append('<div></div>')
                .find('div:last')
                .addClass('one-third column')
                .attr('id', 'bp-shell-' + page_name + '-navigation')
                .load('html/bp-shell-' + page_name + '-navigation.html')
                .end();
            break;

        default:
        }

    };

    create_Text_Right = function (jq_container, page_name) {

        switch (page_name) {
        case 'tame':
        case 'connect':
            jq_container
                .append('<div></div>')
                .find('div:last')
                .addClass('one-third column')
                .attr('id', 'bp-shell-' + page_name + '-navigation')
                .load('html/bp-shell-' + page_name + '-navigation.html')
                .end()

                .append('<div></div>')
                .find('div:last')
                .addClass('two-thirds column')
                .attr('id', 'bp-shell-' + page_name + '-content')
                .load('html/bp-shell-' + page_name + '-content.html')
                .end();
            break;

        default:
        }

    };

    page_Down = function () {
        var i_pg = module_Config.nav_page_names.indexOf(module_State.uri_anchor.page_name) + 1;
        if (i_pg === module_Config.nav_page_names.length) {
            i_pg = 0;
        }
        present_Page({data: {page_name: module_Config.nav_page_names[i_pg]}});
    };

    page_Up = function () {
        var i_pg = module_Config.nav_page_names.indexOf(module_State.uri_anchor.page_name) - 1;
        if (i_pg === -1) {
            i_pg = module_Config.nav_page_names.length - 1;
        }
        present_Page({data: {page_name: module_Config.nav_page_names[i_pg]}});
    };

    on_Hash_Change = function () {
        var uri_anchor = $.uriAnchor.makeAnchorMap();
        if (uri_anchor.page_name !== module_State.uri_anchor.page_name) {
            present_Page({data: uri_anchor});
        }
    };

    hover_In = function () {
        $(this).animate({'color': '#1AB6E5'}, 100);
    };

    hover_Out = function () {
        $(this).animate({'color': '#000000'}, 100);
    };

    return {
        configModule: configModule,
        initModule: initModule,
        getJqContainers: getJqContainers,
        delegatePage: delegatePage
    };

}());
