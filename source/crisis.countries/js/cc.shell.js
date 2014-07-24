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
    create_Visual,
    create_Source,
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
                .find('div#cc-shell-front-contents')
                .addClass('contents')
                .load('html/cc-shell-front-contents.html', function () {
                    module_State.jq_containers[page_name]
                        .find('#cc-shell-front-contents-nav-to-preface')
                        .click({page_name: 'preface'}, present_Page)
                        .hover(to_Red, to_Black)
                        .end()

                        .find('#cc-shell-front-contents-nav-to-introduction')
                        .click({page_name: 'introduction'}, present_Page)
                        .hover(to_Red, to_Black)
                        .end()

                        .find('#cc-shell-front-contents-nav-to-volume')
                        .click({page_name: 'volume'}, present_Page)
                        .hover(to_Red, to_Black)
                        .end()

                        .find('#cc-shell-front-contents-nav-to-trust')
                        .click({page_name: 'trust'}, present_Page)
                        .hover(to_Red, to_Black)
                        .end()

                        .find('#cc-shell-front-contents-nav-to-topics')
                        .click({page_name: 'topics'}, present_Page)
                        .hover(to_Red, to_Black)
                        .end()

                        .find('#cc-shell-front-contents-nav-to-frequency')
                        .click({page_name: 'frequency'}, present_Page)
                        .hover(to_Red, to_Black)
                        .end()

                        .find('#cc-shell-front-contents-nav-to-postscript')
                        .click({page_name: 'postscript'}, present_Page)
                        .hover(to_Red, to_Black)
                        .end()

                        .find('#cc-shell-front-contents-nav-to-colophon')
                        .click({page_name: 'colophon'}, present_Page)
                        .hover(to_Red, to_Black)
                        .end();
                })
                .end(); // div#cc-shell-front-contents

            module_State.jq_containers[page_name]
                .find('div#cc-shell-front-navigation-contents')
                .empty()
                .load('html/cc-shell-front-epigraph.html');

            break;

        case 'preface':
            create_Front(module_State.jq_containers[page_name], page_name);

            module_State.jq_containers[page_name]
                .find('div#cc-shell-front-preface')
                .load('html/cc-shell-front-preface.html');

            break;

        case 'introduction':
            create_Front(module_State.jq_containers[page_name], page_name);

            module_State.jq_containers[page_name]
                .find('div#cc-shell-front-introduction')
                .load('html/cc-shell-front-introduction.html');

            break;

        case 'volume':
            create_Body(module_State.jq_containers[page_name], page_name);

            module_State.jq_containers[page_name]
                .find('div#cc-shell-visual-volume')
                .load('html/cc-shell-visual-volume.html');

            cc.force.initForce(page_name);

            break;

        case 'trust':
            create_Body(module_State.jq_containers[page_name], page_name);

            module_State.jq_containers[page_name]
                .find('div#cc-shell-visual-trust')
                .load('html/cc-shell-visual-trust.html');

            cc.force.initForce(page_name);

            break;

        case 'topics':
            create_Body(module_State.jq_containers[page_name], page_name);

            module_State.jq_containers[page_name]
                .find('div#cc-shell-visual-topics')
                .load('html/cc-shell-visual-topics.html');

            cc.force.initForce(page_name);

            break;

        case 'frequency':
            create_Body(module_State.jq_containers[page_name], page_name);
            
            module_State.jq_containers[page_name]
                .find('div#cc-shell-visual-frequency')
                .load('html/cc-shell-visual-frequency.html');

            cc.grid.initGrid(page_name);

            break;

        case 'postscript':
            create_Back(module_State.jq_containers[page_name], page_name);

            module_State.jq_containers[page_name]
                .find('div#cc-shell-front-postscript')
                .load('html/cc-shell-front-postscript.html');

            break;

        case 'colophon':
            create_Back(module_State.jq_containers[page_name], page_name);

            module_State.jq_containers[page_name]
                .find('div#cc-shell-front-colophon')
                .load('html/cc-shell-front-colophon.html');

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
            .attr('id', 'cc-shell-front-' + page_name)
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
            .end() // div#cc-shell-front-navigation-page-name

        // footer

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-front-footer')
            .attr('id', 'cc-shell-front-footer' + page_name)

            .append('<div></div>')
            .find('div:last')
            .addClass('one-third column cc-shell-front-logo')
            .attr('id', 'cc-shell-front-logo' + page_name)
            .load('html/cc-shell-front-logo.html')
            .end()

            .end(); // div#cc-shell-front-footer-page-name

    };

    create_Body = function (jq_container, page_name) {

        switch (page_name) {
        case 'volume':
        case 'trust':
        case 'topics':
        case 'frequency':
            create_Visual(jq_container, page_name);
            break;

        default:
            create_Source(jq_container, page_name);
        }
    };

    create_Visual = function (jq_container, page_name) {

        jq_container

        // header

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-visual-header')
            .attr('id', 'cc-shell-visual-header' + page_name)

            .append('<div></div>')
            .find('div:last')
            .addClass('one-third column cc-shell-visual-share')
            .attr('id', 'cc-shell-visual-share' + page_name)
            .load('html/cc-shell-visual-share.html')
            .end()

            .end() // div#cc-shell-visual-header-page-name

        // body

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-visual-body')
            .attr('id', 'cc-shell-visual-body' + page_name)

        // body title

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-visual-title')
            .attr('id', 'cc-shell-visual-title' + page_name)
            .click({page_name: 'contents'}, present_Page)
            .hover(to_Red, to_Black)
            .load('html/cc-shell-visual-title.html')
            .end()

        // body navigation

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-visual-navigation')
            .attr('id', 'cc-shell-visual-navigation' + page_name)
            .addClass('row')
            .load('html/cc-shell-visual-navigation.html', function () {
                jq_container
                    .find('div#cc-shell-visual-nav-to-volume')
                    .addClass('cc-shell-visual-nav-to-volume')
                    .attr('id', 'cc-shell-visual-nav-to-volume' + page_name)
                    .click({page_name: 'volume'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end()

                    .find('div#cc-shell-visual-nav-to-trust')
                    .addClass('cc-shell-visual-nav-to-trust')
                    .attr('id', 'cc-shell-visual-nav-to-trust' + page_name)
                    .click({page_name: 'trust'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end()

                    .find('div#cc-shell-visual-nav-to-topics')
                    .addClass('cc-shell-visual-nav-to-topics')
                    .attr('id', 'cc-shell-visual-nav-to-topics' + page_name)
                    .click({page_name: 'topics'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end()

                    .find('div#cc-shell-visual-nav-to-frequency')
                    .addClass('cc-shell-visual-nav-to-frequency')
                    .attr('id', 'cc-shell-visual-nav-to-frequency' + page_name)
                    .click({page_name: 'frequency'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end();
            })
            .end() // div#cc-shell-visual-navigation-page-name

        // body content

            .append('<div></div>')
            .find('div:last')
            .addClass('row')

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-visual-content')
            .attr('id', 'cc-shell-visual-content' + page_name)
            .addClass('four columns alpha')
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-visual-navigation')
            .attr('id', 'cc-shell-visual-navigation' + page_name)
            .addClass('eight columns omega')
            .end()

            .end() // div.row

            .end() // div#cc-shell-visual-body-page-name

        // footer

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-visual-footer')
            .attr('id', 'cc-shell-visual-footer' + page_name)

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-visual-logo')
            .attr('id', 'cc-shell-visual-logo' + page_name)
            .load('html/cc-shell-visual-logo.html')
            .end()

            .end(); // div#cc-shell-visual-footer-page-name
    };

    create_Source = function (jq_container, page_name) {

        jq_container

        // header

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-source-header')
            .attr('id', 'cc-shell-source-header' + page_name)

            .append('<div></div>')
            .find('div:last')
            .addClass('two-thirds column cc-shell-source-title')
            .attr('id', 'cc-shell-source-title-' + page_name)
            .click({page_name: 'contents'}, present_Page)
            .hover(to_Red, to_Black)
            .load('html/cc-shell-source-title.html')
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('one-third column cc-shell-source-share')
            .attr('id', 'cc-shell-source-share' + page_name)
            .load('html/cc-shell-source-share.html')
            .end()

            .end() // div#cc-shell-source-header-page-name

        // body

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-source-body')
            .attr('id', 'cc-shell-source-body' + page_name)

        // body author

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-source-author')
            .attr('id', 'cc-shell-source-author' + page_name)
        // TODO: Navigate to external URL?
            .click({page_name: 'contents'}, present_Page)
            .hover(to_Red, to_Black)
            .load('html/cc-shell-source-author.html')
        // TODO: Set source author
            .end()

        // body content

            .append('<div></div>')
            .find('div:last')
            .addClass('row')

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-source-content')
            .attr('id', 'cc-shell-source-content' + page_name)
            .addClass('one-third column alpha')
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-source-content')
            .attr('id', 'cc-shell-source-content' + page_name)
            .addClass('one-third column')
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-source-content')
            .attr('id', 'cc-shell-source-content' + page_name)
            .addClass('one-third column omega')
            .end()

            .end() // div.row

            .end() // div#cc-shell-source-body-page-name

        // footer

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-source-footer')
            .attr('id', 'cc-shell-source-footer' + page_name)

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-source-logo')
            .attr('id', 'cc-shell-source-logo' + page_name)
            .load('html/cc-shell-source-logo.html')
            .end()

            .end(); // div#cc-shell-source-footer-page-name
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
