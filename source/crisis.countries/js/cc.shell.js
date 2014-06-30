/*
 * cc.shell.js
 */

/* global cc */

cc.shell = (function() {

    'use strict';

    var
    moduleConfig = {
        input_file_name: 'json/car.json',
        init_page_name: 'cover',
        settable: {
            input_file_name: false
        }
    },
    moduleState = {
        jq_containers: {},
        d3_containers: {},
        uri_anchor: {}
    },
    configModule,
    initModule;

    var
    present_page,
    dismiss_page,
    create_page,
    create_front,
    create_body,
    create_back,
    on_hash_change,
    to_red,
    to_black;

    configModule = function(input_config) {
        cc.util.setConfig(input_config, moduleConfig);
        return true;
    };

    initModule = function(jq_container, d3_container) {

        moduleState.jq_containers.main = jq_container;
        moduleState.d3_containers.main = d3_container;

        moduleState.jq_containers.main
            .addClass('container sixteen columns');

        cc.model.configModule({});
        cc.model.initModule(moduleConfig.input_file_name);

        var page_name = moduleConfig.init_page_name;
        present_page({data: {page_name: page_name}});
        $.uriAnchor.setAnchor({page_name: page_name}, null, true);
        moduleState.uri_anchor = $.uriAnchor.makeAnchorMap();

        $(window).bind('hashchange', on_hash_change);
    };
    
    on_hash_change = function() {
        var uri_anchor = $.uriAnchor.makeAnchorMap();
        if (uri_anchor.page_name !== moduleState.uri_anchor.page_name) {
            present_page({data: uri_anchor});
        }
    };

    present_page = function(event) {
        var page_name = event.data.page_name;
        if (moduleState.jq_containers[page_name] === undefined) {
            create_page(page_name);
        }
        dismiss_page(moduleState.uri_anchor.page_name);
        moduleState.jq_containers[page_name].fadeIn('slow');
        $.uriAnchor.setAnchor({page_name: page_name});
        moduleState.uri_anchor = $.uriAnchor.makeAnchorMap();
    };

    dismiss_page = function(page_name) {
        if (moduleState.jq_containers[page_name] !== undefined &&
            moduleState.jq_containers[page_name].css('display') !== 'none') {
            moduleState.jq_containers[page_name].css('display', 'none');
        }
    };

    to_red = function() {
        $(this).animate({'color': '#ff0000'}, 100);
    };

    to_black = function() {
        $(this).animate({'color': '#444'}, 100);
    };

    create_page = function(page_name) {

        var page_id = 'cc-shell-' + page_name;
        moduleState.jq_containers.main
            .append('<div></div>')
            .find('div:last')
            .attr('id', page_id)
            .css('display', 'none')
            .end();
        moduleState.jq_containers[page_name] = $('#' + page_id);

        switch (page_name) {
        case 'cover':

            moduleState.jq_containers[page_name]

            // header

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-cover-header')
                .addClass('centered')

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-cover-logo')
                .click({page_name: 'contents'}, present_page)
                .hover(to_red, to_black)
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
                .click({page_name: 'contents'}, present_page)
                .hover(to_red, to_black)
                .load('html/cc-shell-cover-navigation.html')
                .end()

                .end(); // div#cc-shell-cover-body

            break;

        case 'contents':
            create_front(moduleState.jq_containers[page_name], page_name);

            moduleState.jq_containers[page_name]
                .find('div#cc-shell-contents-column-left')
                .addClass('contents')
                .load('html/cc-shell-contents.html', function() {
                    moduleState.jq_containers[page_name]
                        .find('#cc-shell-contents-preface')
                        .click({page_name: 'preface'}, present_page)
                        .hover(to_red, to_black)
                        .end()

                        .find('#cc-shell-contents-introduction')
                        .click({page_name: 'introduction'}, present_page)
                        .hover(to_red, to_black)
                        .end()

                        .find('#cc-shell-contents-volume')
                        .click({page_name: 'volume'}, present_page)
                        .hover(to_red, to_black)
                        .end()

                        .find('#cc-shell-contents-trust')
                        .click({page_name: 'trust'}, present_page)
                        .hover(to_red, to_black)
                        .end()

                        .find('#cc-shell-contents-topics')
                        .click({page_name: 'topics'}, present_page)
                        .hover(to_red, to_black)
                        .end()

                        .find('#cc-shell-contents-frequency')
                        .click({page_name: 'frequency'}, present_page)
                        .hover(to_red, to_black)
                        .end()

                        .find('#cc-shell-contents-postscript')
                        .click({page_name: 'postscript'}, present_page)
                        .hover(to_red, to_black)
                        .end()

                        .find('#cc-shell-contents-colophon')
                        .click({page_name: 'colophon'}, present_page)
                        .hover(to_red, to_black)
                        .end();
                })
                .end(); // div#cc-shell-contents-column-left

            moduleState.jq_containers[page_name]
                .find('div#cc-shell-contents-column-right')
                .empty()
                .load('html/cc-shell-epigraph.html');

            break;

        case 'preface':
            create_front(moduleState.jq_containers[page_name], page_name);

            moduleState.jq_containers[page_name]
                .find('div#cc-shell-preface-column-left')
                .load('html/cc-shell-preface.html');

            break;

        case 'introduction':
            create_front(moduleState.jq_containers[page_name], page_name);

            moduleState.jq_containers[page_name]
                .find('div#cc-shell-introduction-column-left')
                .load('html/cc-shell-introduction.html');

            break;

        case 'volume':
            create_body(moduleState.jq_containers[page_name], page_name);

            moduleState.jq_containers[page_name]
                .find('div#cc-shell-volume-title')
                .load('html/cc-shell-volume-description.html');

            moduleState.jq_containers[page_name]
                .find('div#cc-shell-volume-column-left')
                .load('html/cc-shell-volume-legend.html');

            break;

        case 'trust':
            create_body(moduleState.jq_containers[page_name], page_name);

            moduleState.jq_containers[page_name]
                .find('div#cc-shell-trust-title')
                .load('html/cc-shell-trust-description.html');

            moduleState.jq_containers[page_name]
                .find('div#cc-shell-trust-column-left')
                .load('html/cc-shell-trust-legend.html');

            break;

        case 'topics':
            create_body(moduleState.jq_containers[page_name], page_name);

            moduleState.jq_containers[page_name]
                .find('div#cc-shell-topics-title')
                .load('html/cc-shell-topics-description.html');

            break;

        case 'frequency':
            create_body(moduleState.jq_containers[page_name], page_name);
            
            moduleState.jq_containers[page_name]
                .find('div#cc-shell-frequency-title')
                .load('html/cc-shell-frequency-description.html');

            break;

        case 'postscript':
            create_back(moduleState.jq_containers[page_name], page_name);

            moduleState.jq_containers[page_name]
                .find('div#cc-shell-postscript-column-left')
                .load('html/cc-shell-postscript.html');

            break;

        case 'colophon':
            create_back(moduleState.jq_containers[page_name], page_name);

            moduleState.jq_containers[page_name]
                .find('div#cc-shell-colophon-column-left')
                .load('html/cc-shell-colophon.html');

            break;

        default:
        }
    };

    create_front = function(jq_container, page_name) {

        jq_container

        // header

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-front-matter-header')
            .attr('id', 'cc-shell-' + page_name + '-header')

            .append('<div></div>')
            .find('div:last')
            .addClass('column cc-shell-front-matter-logo')
            .attr('id', 'cc-shell-' + page_name + '-logo')
            .click({page_name: 'contents'}, present_page)
            .hover(to_red, to_black)
            .load('html/cc-shell-front-matter-logo.html')
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-front-matter-title')
            .attr('id', 'cc-shell-' + page_name + '-title')
            .click({page_name: 'contents'}, present_page)
            .load('html/cc-shell-front-matter-title.html')
            .end()

            .end() // div#cc-shell-page-name-header

        // body

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-front-matter-body')
            .attr('id', 'cc-shell-' + page_name + '-body')

            .append('<div></div>')
            .find('div:last')
            .addClass('row')

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-front-matter-column-left')
            .attr('id', 'cc-shell-' + page_name + '-column-left')
            .addClass('eight columns alpha')
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-front-matter-column-right')
            .attr('id', 'cc-shell-' + page_name + '-column-right')
            .addClass('four columns omega')
            .end()

            .end() // div.row

            .end(); // div#cc-shell-page-name-body

        // column right navigation

        moduleState.jq_containers[page_name]
            .find('div#cc-shell-' + page_name + '-column-right')
            .addClass('contents')
            .load('html/cc-shell-front-matter-navigation.html', function() {
                moduleState.jq_containers[page_name]
                    .find('#cc-shell-front-matter-navigation-preface')
                    .addClass('cc-shell-front-matter-navigation-preface')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-preface')
                    .click({page_name: 'preface'}, present_page)
                    .hover(to_red, to_black)
                    .end()

                    .find('#cc-shell-front-matter-navigation-introduction')
                    .addClass('cc-shell-front-matter-navigation-introduction')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-introduction')
                    .click({page_name: 'introduction'}, present_page)
                    .hover(to_red, to_black)
                    .end()

                    .find('#cc-shell-front-matter-navigation-volume')
                    .addClass('cc-shell-front-matter-navigation-volume')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-volume')
                    .click({page_name: 'volume'}, present_page)
                    .hover(to_red, to_black)
                    .end()

                    .find('#cc-shell-front-matter-navigation-trust')
                    .addClass('cc-shell-front-matter-navigation-trust')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-trust')
                    .click({page_name: 'trust'}, present_page)
                    .hover(to_red, to_black)
                    .end()

                    .find('#cc-shell-front-matter-navigation-topics')
                    .addClass('cc-shell-front-matter-navigation-topics')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-topics')
                    .click({page_name: 'topics'}, present_page)
                    .hover(to_red, to_black)
                    .end()

                    .find('#cc-shell-front-matter-navigation-frequency')
                    .addClass('cc-shell-front-matter-navigation-frequency')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-frequency')
                    .click({page_name: 'frequency'}, present_page)
                    .hover(to_red, to_black)
                    .end()

                    .find('#cc-shell-front-matter-navigation-postscript')
                    .addClass('cc-shell-front-matter-navigation-postscript')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-postscript')
                    .click({page_name: 'postscript'}, present_page)
                    .hover(to_red, to_black)
                    .end()

                    .find('#cc-shell-front-matter-navigation-colophon')
                    .addClass('cc-shell-front-matter-navigation-colophon')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-colophon')
                    .click({page_name: 'colophon'}, present_page)
                    .hover(to_red, to_black)
                    .end();
            })
            .end(); // div#cc-shell-page-name-column-right
    };

    create_body = function(jq_container, page_name) {

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
            .click({page_name: 'contents'}, present_page)
            .hover(to_red, to_black)
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
            .load('html/cc-shell-body-navigation.html', function() {
                jq_container
                    .find('div#cc-shell-body-navigation-volume')
                    .addClass('cc-shell-body-navigation-volume')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-volume')
                    .click({page_name: 'volume'}, present_page)
                    .hover(to_red, to_black)
                    .end()

                    .find('div#cc-shell-body-navigation-trust')
                    .addClass('cc-shell-body-navigation-trust')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-trust')
                    .click({page_name: 'trust'}, present_page)
                    .hover(to_red, to_black)
                    .end()

                    .find('div#cc-shell-body-navigation-topics')
                    .addClass('cc-shell-body-navigation-topics')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-topics')
                    .click({page_name: 'topics'}, present_page)
                    .hover(to_red, to_black)
                    .end()

                    .find('div#cc-shell-body-navigation-frequency')
                    .addClass('cc-shell-body-navigation-frequency')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-frequency')
                    .click({page_name: 'frequency'}, present_page)
                    .hover(to_red, to_black)
                    .end();
            })
            .end() // div#cc-shell-page-name-navigation

        // body content

            .append('<div></div>')
            .find('div:last')
            .addClass('row')

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-body-column-left')
            .attr('id', 'cc-shell-' + page_name + '-column-left')
            .addClass('four columns alpha')
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-body-column-right')
            .attr('id', 'cc-shell-' + page_name + '-column-right')
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

    create_back = function(jq_container, page_name) {
        create_front(jq_container, page_name);
    };

    return {
        configModule: configModule,
        initModule: initModule
    };

}());