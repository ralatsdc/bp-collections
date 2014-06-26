/*
 * cc.shell.js
 */

/* global cc */

cc.shell = (function() {

    'use strict';

    var
    moduleConfig = {
        input_file_name: 'json/car.json',
        settable: {
            input_file_name: false
        }
    },
    moduleState = {
        jq_containers: {},
        d3_containers: {},
        page_name: 'title'
    },
    configModule,
    initModule;

    var
    present_page,
    dismiss_page,
    create_page,
    create_front,
    create_body,
    create_back;

    configModule = function(input_config) {
        cc.util.setConfig(input_config, moduleConfig);
        return true;
    };

    initModule = function(jq_container, d3_container) {

        moduleState.jq_containers.main = jq_container;
        moduleState.d3_containers.main = d3_container;

        moduleState.jq_containers.main
            .addClass('container');

        cc.model.configModule({});
        cc.model.initModule(moduleConfig.input_file_name);

        present_page({data: {page_name: 'cover'}});
    };

    present_page = function(event) {
        var page_name = event.data.page_name;
        if (moduleState.jq_containers[page_name] === undefined) {
            create_page(page_name);
        }
        dismiss_page(moduleState.page_name);
        moduleState.jq_containers[page_name].fadeIn('slow');
        moduleState.page_name = page_name;
    };

    dismiss_page = function(page_name) {
        if (moduleState.jq_containers[page_name] !== undefined &&
            moduleState.jq_containers[page_name].css('display') !== 'none') {
            moduleState.jq_containers[page_name].css('display', 'none');
        }
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
                .addClass('sixteen columns')

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-cover-logo')
                .click({page_name: 'contents'}, present_page)
                .text('logo')
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
                .addClass('sixteen columns')

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
                        .end()

                        .find('#cc-shell-contents-introduction')
                        .click({page_name: 'introduction'}, present_page)
                        .end()

                        .find('#cc-shell-contents-volume')
                        .click({page_name: 'volume'}, present_page)
                        .end()

                        .find('#cc-shell-contents-trust')
                        .click({page_name: 'trust'}, present_page)
                        .end()

                        .find('#cc-shell-contents-topics')
                        .click({page_name: 'topics'}, present_page)
                        .end()

                        .find('#cc-shell-contents-frequency')
                        .click({page_name: 'frequency'}, present_page)
                        .end()

                        .find('#cc-shell-contents-postscript')
                        .click({page_name: 'postscript'}, present_page)
                        .end()

                        .find('#cc-shell-contents-colophon')
                        .click({page_name: 'colophon'}, present_page)
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
            .attr('id', 'cc-shell-' + page_name + '-header')
            .addClass('sixteen columns')

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-shell-' + page_name + '-logo')
            .click({page_name: 'contents'}, present_page)
            .text('logox')
            .end()

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-shell-' + page_name + '-title')
            .load('html/cc-shell-front-matter-title.html')
            .end()

            .end() // div#cc-shell-page-name-header

        // body

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-shell-' + page_name + '-body')
            .addClass('sixteen columns')

            .append('<div></div>')
            .find('div:last')
            .addClass('row')

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-shell-' + page_name + '-column-left')
            .addClass('twelve columns alpha')
            .end()

            .append('<div></div>')
            .find('div:last')
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
                    .attr('id', 'cc-shell-' + page_name + '-navigation-preface')
                    .click({page_name: 'preface'}, present_page)
                    .end()

                    .find('#cc-shell-front-matter-navigation-introduction')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-introduction')
                    .click({page_name: 'introduction'}, present_page)
                    .end()

                    .find('#cc-shell-front-matter-navigation-volume')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-volume')
                    .click({page_name: 'volume'}, present_page)
                    .end()

                    .find('#cc-shell-front-matter-navigation-trust')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-trust')
                    .click({page_name: 'trust'}, present_page)
                    .end()

                    .find('#cc-shell-front-matter-navigation-topics')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-topics')
                    .click({page_name: 'topics'}, present_page)
                    .end()

                    .find('#cc-shell-front-matter-navigation-frequency')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-frequency')
                    .click({page_name: 'frequency'}, present_page)
                    .end()

                    .find('#cc-shell-front-matter-navigation-postscript')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-postscript')
                    .click({page_name: 'postscript'}, present_page)
                    .end()

                    .find('#cc-shell-front-matter-navigation-colophon')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-colophon')
                    .click({page_name: 'colophon'}, present_page)
                    .end();
            })
            .end(); // div#cc-shell-page-name-column-right
    };

    create_body = function(jq_container, page_name) {

        jq_container

        // header

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-shell-' + page_name + '-header')
            .addClass('sixteen columns')

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-shell-' + page_name + '-logo')
            .click({page_name: 'contents'}, present_page)
            .text('logo')
            .end()

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-shell-' + page_name + '-author')
            .load('html/cc-shell-body-author.html')
            .end()

            .end() // div#cc-shell-page-name-header

        // body

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-shell-' + page_name + '-body')
            .addClass('sixteen columns')

        // body title

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-shell-' + page_name + '-title')
            .load('html/cc-shell-body-title.html')
            .end()

        // body navigation

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-shell-' + page_name + '-navigation')
            .addClass('row')
            .load('html/cc-shell-body-navigation.html', function() {
                jq_container
                    .find('div#cc-shell-body-navigation-volume')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-volume')
                    .click({page_name: 'volume'}, present_page)
                    .end()

                    .find('div#cc-shell-body-navigation-trust')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-trust')
                    .click({page_name: 'trust'}, present_page)
                    .end()

                    .find('div#cc-shell-body-navigation-topics')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-topics')
                    .click({page_name: 'topics'}, present_page)
                    .end()

                    .find('div#cc-shell-body-navigation-frequency')
                    .attr('id', 'cc-shell-' + page_name + '-navigation-frequency')
                    .click({page_name: 'frequency'}, present_page)
                    .end();
            })
            .end() // div#cc-shell-page-name-navigation

        // body content

            .append('<div></div>')
            .find('div:last')
            .addClass('row')

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-shell-' + page_name + '-column-left')
            .addClass('four columns alpha')
            .end()

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-shell-' + page_name + '-column-right')
            .addClass('twelve columns omega')
            .end()

            .end() // div.row

            .end() // div#cc-shell-page-name-body

        // footer

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-shell-' + page_name + '-footer')
            .addClass('sixteen columns')

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-shell-' + page_name + '-social')
            .load('html/cc-shell-body-social.html')
            .end()

            .append('<div></div>')
            .find('div:last')
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
