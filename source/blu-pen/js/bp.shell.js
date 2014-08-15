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
        country_file_name: 'json/collection/car.json',
        init_page_name: 'cover',
        settable: {
            country_file_name: false,
            init_page_name: false
        }
    },
    module_State = {
        jq_containers: {},
        uri_anchor: {}
    },
    present_Page,
    dismiss_Page,
    init_Page,
    create_Body,
    create_Text,
    create_Image,
    create_Text_Left,
    create_Text_Right,
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

        init_Page();

        cc.model.configModule({});
        cc.force.configModule({});

        var uri_anchor = $.uriAnchor.makeAnchorMap();

        var page_name;
        if ('page_name' in uri_anchor) {
            page_name = uri_anchor.page_name;
        } else {
            page_name = module_Config.init_page_name;
        }

        bp.model.initModule(module_Config.country_file_name,
                            {page_name: page_name});

        $(window).bind('hashchange', on_Hash_Change);
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
            .attr('id', 'bp-shell-header')

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-header-logo')
            .click(function () {
                window.open('http://www.blu-pen.com');
            })
            .load('img/blu-pen-logo-two-color-text.svg')
            .end();

        // body

        module_State.jq_containers.body =
            module_State.jq_containers.main
            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-body');

        // footer

        module_State.jq_containers.footer =
            module_State.jq_containers.main
            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-footer');
    };

    present_Page = function (event) {

        var page_name = event.data.page_name;

        if (module_State.jq_containers[page_name] === undefined) {
            create_Body(page_name);
        }

        if (page_name !== 'something') {
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
            module_State.jq_containers[page_name].css('display', 'none');
        }
    };

    create_Body = function (page_name) {

        var page_id = 'bp-shell-' + page_name;

        module_State.jq_containers[page_name] =
            module_State.jq_containers.body
            .append('<div></div>')
            .find('div:last')
            .attr('id', page_id)
            .css('display', 'none');

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
    };

    create_Image = function (jq_container, page_name) {
    };

    create_Text_Left = function (jq_container, page_name) {
    };

    create_Text_Right = function (jq_container, page_name) {
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
