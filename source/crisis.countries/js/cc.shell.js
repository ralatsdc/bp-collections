/*
 * cc.shell.js
 */

/* global cc */

cc.shell = (function () {

    'use strict';

    var
    configModule,
    initModule,
    getJqContainers;

    var
    module_Config = {
        input_file_name: 'json/japan.json',
        init_page_name: 'cover',
        settable: {
            input_file_name: false
        }
    },
    module_State = {
        jq_containers: {},
        uri_anchor: {}
    },
    present_Page,
    dismiss_Page,
    create_Page,
    create_Front,
    create_Body,
    create_Body_Visual,
    create_Body_Source,
    create_Back,
    on_Hash_Change,
    to_Red,
    to_Black;

    configModule = function (input_config) {
        cc.util.setConfig(input_config, module_Config);
        return true;
    };

    initModule = function (jq_container) {

        cc.model.configModule({});
        cc.force.configModule({});
        cc.grid.configModule({});

        cc.model.initModule(module_Config.input_file_name);
        cc.force.initModule();
        cc.grid.initModule();

        module_State.jq_containers.main = jq_container;

        module_State.jq_containers.main
            .addClass('container sixteen columns');

        var page_name = module_Config.init_page_name;

        present_Page({data: {page_name: page_name}});

        $.uriAnchor.setAnchor({page_name: page_name}, null, true);
        module_State.uri_anchor = $.uriAnchor.makeAnchorMap();

        $(window).bind('hashchange', on_Hash_Change);
    };
    
    getJqContainers = function () {
        return module_State.jq_containers;
    };

    on_Hash_Change = function () {
        var uri_anchor = $.uriAnchor.makeAnchorMap();
        if (uri_anchor.page_name !== module_State.uri_anchor.page_name) {
            present_Page({data: uri_anchor});
        }
    };

    to_Red = function () {
        $(this).animate({'color': '#ff0000'}, 100);
    };

    to_Black = function () {
        $(this).animate({'color': '#444'}, 100);
    };

    present_Page = function (event) {

        var page_name = event.data.page_name;

        if (module_State.jq_containers[page_name] === undefined) {
            create_Page(page_name);
        }

        switch (page_name) {
        case 'volume':
        case 'trust':
        case 'topics':
            cc.force.presentForce(page_name);
            break;

        case 'frequency':
            cc.grid.presentGrid(page_name);
            break;

        default:
        }

        if (page_name !== module_State.uri_anchor.page_name) {
            dismiss_Page(module_State.uri_anchor.page_name);
        }

        $.uriAnchor.setAnchor({page_name: page_name});
        module_State.uri_anchor = $.uriAnchor.makeAnchorMap();

        module_State.jq_containers[page_name].fadeIn('slow');
    };

    dismiss_Page = function (page_name) {
        if (module_State.jq_containers[page_name] !== undefined &&
            module_State.jq_containers[page_name].css('display') !== 'none') {
            module_State.jq_containers[page_name].css('display', 'none');
        }
    };

    create_Page = function (page_name) {

        var page_id = 'cc-shell-' + page_name;
        module_State.jq_containers.main
            .append('<div></div>')
            .find('div:last')
            .attr('id', page_id)
            .css('display', 'none')
            .end();
        module_State.jq_containers[page_name] = $('#' + page_id);

        switch (page_name) {
        case 'cover':

            module_State.jq_containers[page_name]

            // header

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-cover-header')
                .addClass('centered')

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-cover-logo')
                .click({page_name: 'contents'}, present_Page)
                .hover(to_Red, to_Black)
                .load('html/cc-shell-cover-logo.html')
                .end()

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-cover-author')
                .load('html/cc-shell-cover-author.html')
                .end()

                .end() // div#cc-shell-cover-header

            // body

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-cover-body')
                .addClass('centered')

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-cover-title')
                .load('html/cc-shell-cover-title.html')
                .end()

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-cover-image')
                .text('image')
                .end()

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-cover-navigation')
                .click({page_name: 'contents'}, present_Page)
                .hover(to_Red, to_Black)
                .load('html/cc-shell-cover-navigation.html')
                .end()

                .end(); // div#cc-shell-cover-body

            break;

        case 'contents':
            create_Front(module_State.jq_containers[page_name], page_name);

            module_State.jq_containers[page_name]
                .find('div#cc-shell-front-content-contents')
                .addClass('contents')
                .load('html/cc-shell-front-content-contents.html', function () {
                    module_State.jq_containers[page_name]
                        .find('#cc-shell-front-content-contents-nav-to-preface')
                        .click({page_name: 'preface'}, present_Page)
                        .hover(to_Red, to_Black)
                        .end()

                        .find('#cc-shell-front-content-contents-nav-to-introduction')
                        .click({page_name: 'introduction'}, present_Page)
                        .hover(to_Red, to_Black)
                        .end()

                        .find('#cc-shell-front-content-contents-nav-to-volume')
                        .click({page_name: 'volume'}, present_Page)
                        .hover(to_Red, to_Black)
                        .end()

                        .find('#cc-shell-front-content-contents-nav-to-trust')
                        .click({page_name: 'trust'}, present_Page)
                        .hover(to_Red, to_Black)
                        .end()

                        .find('#cc-shell-front-content-contents-nav-to-topics')
                        .click({page_name: 'topics'}, present_Page)
                        .hover(to_Red, to_Black)
                        .end()

                        .find('#cc-shell-front-content-contents-nav-to-frequency')
                        .click({page_name: 'frequency'}, present_Page)
                        .hover(to_Red, to_Black)
                        .end()

                        .find('#cc-shell-front-content-contents-nav-to-postscript')
                        .click({page_name: 'postscript'}, present_Page)
                        .hover(to_Red, to_Black)
                        .end()

                        .find('#cc-shell-front-content-contents-nav-to-colophon')
                        .click({page_name: 'colophon'}, present_Page)
                        .hover(to_Red, to_Black)
                        .end();
                })
                .end(); // div#cc-shell-front-content-contents

            module_State.jq_containers[page_name]
                .find('div#cc-shell-front-navigation-contents')
                .empty()
                .load('html/cc-shell-front-navigation-epigraph.html');

            break;

        case 'preface':
            create_Front(module_State.jq_containers[page_name], page_name);

            module_State.jq_containers[page_name]
                .find('div#cc-shell-front-content-preface')
                .load('html/cc-shell-front-content-preface.html');

            break;

        case 'introduction':
            create_Front(module_State.jq_containers[page_name], page_name);

            module_State.jq_containers[page_name]
                .find('div#cc-shell-front-content-introduction')
                .load('html/cc-shell-front-content-introduction.html');

            break;

        case 'volume':
            create_Body(module_State.jq_containers[page_name], page_name);

            module_State.jq_containers[page_name]
                .find('div#cc-shell-volume-title')
                .load('html/cc-shell-volume-description.html');

            module_State.jq_containers[page_name]
                .find('div#cc-shell-volume-content')
                .load('html/cc-shell-volume-legend.html');

            cc.force.initForce(page_name);

            break;

        case 'trust':
            create_Body(module_State.jq_containers[page_name], page_name);

            module_State.jq_containers[page_name]
                .find('div#cc-shell-trust-title')
                .load('html/cc-shell-trust-description.html');

            module_State.jq_containers[page_name]
                .find('div#cc-shell-trust-content')
                .load('html/cc-shell-trust-legend.html');

            cc.force.initForce(page_name);

            break;

        case 'topics':
            create_Body(module_State.jq_containers[page_name], page_name);

            module_State.jq_containers[page_name]
                .find('div#cc-shell-topics-title')
                .load('html/cc-shell-topics-description.html');

            cc.force.initForce(page_name);

            break;

        case 'frequency':
            create_Body(module_State.jq_containers[page_name], page_name);
            
            module_State.jq_containers[page_name]
                .find('div#cc-shell-frequency-title')
                .load('html/cc-shell-frequency-description.html');

            cc.grid.initGrid(page_name);

            break;

        case 'postscript':
            create_Back(module_State.jq_containers[page_name], page_name);

            module_State.jq_containers[page_name]
                .find('div#cc-shell-postscript-content')
                .load('html/cc-shell-postscript.html');

            break;

        case 'colophon':
            create_Back(module_State.jq_containers[page_name], page_name);

            module_State.jq_containers[page_name]
                .find('div#cc-shell-colophon-content')
                .load('html/cc-shell-colophon.html');

            break;

        default:
        }
    };

    create_Front = function (jq_container, page_name) {

        jq_container

        // header

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-front-header')
            .attr('id', 'cc-shell-front-header-' + page_name)

            .append('<div></div>')
            .find('div:last')
            .addClass('two-thirds column cc-shell-front-title')
            .attr('id', 'cc-shell-front-title-' + page_name)
            .click({page_name: 'contents'}, present_Page)
            .hover(to_Red, to_Black)
            .load('html/cc-shell-front-title.html')
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('one-third column cc-shell-front-share')
            .attr('id', 'cc-shell-front-share-' + page_name)
            .load('html/cc-shell-front-share.html')
            .end()

            .end() // div#cc-shell-page-name-header

        // body

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-front-body')
            .attr('id', 'cc-shell-front-body-' + page_name)

            .append('<div></div>')
            .find('div:last')
            .addClass('row')

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-front-content')
            .attr('id', 'cc-shell-front-content-' + page_name)
            .addClass('eight columns alpha')
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-front-navigation')
            .attr('id', 'cc-shell-front-navigation-' + page_name)
            .addClass('four columns omega')
            .end()

            .end() // div.row

            .end(); // div#cc-shell-front-body-page-name

        // column right navigation

        module_State.jq_containers[page_name]
            .find('div#cc-shell-front-navigation-' + page_name)
            .addClass('contents')
            .load('html/cc-shell-front-navigation.html', function () {
                module_State.jq_containers[page_name]
                    .find('#cc-shell-front-nav-to-preface')
                    .addClass('cc-shell-front-nav-to-preface')
                    .attr('id', 'cc-shell-front-nav-to-preface' + page_name)
                    .click({page_name: 'preface'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end()

                    .find('#cc-shell-front-nav-to-introduction')
                    .addClass('cc-shell-front-nav-to-introduction')
                    .attr('id', 'cc-shell-front-nav-to-introduction' + page_name)
                    .click({page_name: 'introduction'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end()

                    .find('#cc-shell-front-nav-to-volume')
                    .addClass('cc-shell-front-nav-to-volume')
                    .attr('id', 'cc-shell-front-nav-to-volume' + page_name)
                    .click({page_name: 'volume'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end()

                    .find('#cc-shell-front-nav-to-trust')
                    .addClass('cc-shell-front-nav-to-trust')
                    .attr('id', 'cc-shell-front-nav-to-trust' + page_name)
                    .click({page_name: 'trust'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end()

                    .find('#cc-shell-front-nav-to-topics')
                    .addClass('cc-shell-front-nav-to-topics')
                    .attr('id', 'cc-shell-front-nav-to-topics' + page_name)
                    .click({page_name: 'topics'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end()

                    .find('#cc-shell-front-nav-to-frequency')
                    .addClass('cc-shell-front-nav-to-frequency')
                    .attr('id', 'cc-shell-front-nav-to-frequency' + page_name)
                    .click({page_name: 'frequency'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end()

                    .find('#cc-shell-front-nav-to-postscript')
                    .addClass('cc-shell-front-nav-to-postscript')
                    .attr('id', 'cc-shell-front-nav-to-postscript' + page_name)
                    .click({page_name: 'postscript'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end()

                    .find('#cc-shell-front-nav-to-colophon')
                    .addClass('cc-shell-front-nav-to-colophon')
                    .attr('id', 'cc-shell-front-nav-to-colophon' + page_name)
                    .click({page_name: 'colophon'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end();
            })
            .end(); // div#cc-shell-front-navigation-page-name
    };

    create_Body = function (jq_container, page_name) {

        switch (page_name) {
        case 'volume':
        case 'trust':
        case 'topics':
        case 'frequency':
            create_Body_Visual(jq_container, page_name);
            break;

        default:
            create_Body_Source(jq_container, page_name);
        }
    };

    create_Body_Visual = function (jq_container, page_name) {

        jq_container

        // header

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-body-header')
            .attr('id', 'cc-shell-' + page_name + '-header')

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-body-logo')
            .attr('id', 'cc-shell-' + page_name + '-logo')
            .click({page_name: 'contents'}, present_Page)
            .hover(to_Red, to_Black)
            .load('html/cc-shell-body-logo.html')
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-body-author')
            .attr('id', 'cc-shell-' + page_name + '-author')
            .load('html/cc-shell-body-author.html')
            .end()

            .end() // div#cc-shell-page-name-header

        // body

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-body-body')
            .attr('id', 'cc-shell-' + page_name + '-body')

        // body title

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-body-title')
            .attr('id', 'cc-shell-' + page_name + '-title')
            .load('html/cc-shell-body-title.html')
            .end()

        // body navigation

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-body-navigation')
            .attr('id', 'cc-shell-' + page_name + '-navigation')
            .addClass('row')
            .load('html/cc-shell-body-navigation.html', function () {
                jq_container
                    .find('div#cc-shell-body-navigation-volume')
                    .addClass('cc-shell-body-navigation-volume')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-volume')
                    .click({page_name: 'volume'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end()

                    .find('div#cc-shell-body-navigation-trust')
                    .addClass('cc-shell-body-navigation-trust')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-trust')
                    .click({page_name: 'trust'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end()

                    .find('div#cc-shell-body-navigation-topics')
                    .addClass('cc-shell-body-navigation-topics')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-topics')
                    .click({page_name: 'topics'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end()

                    .find('div#cc-shell-body-navigation-frequency')
                    .addClass('cc-shell-body-navigation-frequency')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-frequency')
                    .click({page_name: 'frequency'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end();
            })
            .end() // div#cc-shell-page-name-navigation

        // body content

            .append('<div></div>')
            .find('div:last')
            .addClass('row')

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-body-content')
            .attr('id', 'cc-shell-' + page_name + '-content')
            .addClass('four columns alpha')
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-body-navigation')
            .attr('id', 'cc-shell-' + page_name + '-navigation')
            .addClass('eight columns omega')
            .end()

            .end() // div.row

            .end() // div#cc-shell-page-name-body

        // footer

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-body-footer')
            .attr('id', 'cc-shell-' + page_name + '-footer')

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-body-social')
            .attr('id', 'cc-shell-' + page_name + '-social')
            .load('html/cc-shell-body-social.html')
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-body-publisher')
            .attr('id', 'cc-shell-' + page_name + '-publisher')
            .load('html/cc-shell-body-publisher.html')
            .end()

            .end(); // div#cc-shell-page-name-footer
    };

    create_Body_Source = function (jq_container, page_name) {
    };

    create_Back = function (jq_container, page_name) {
        create_Front(jq_container, page_name);
    };

    return {
        configModule: configModule,
        initModule: initModule,
        getJqContainers: getJqContainers
    };

}());
