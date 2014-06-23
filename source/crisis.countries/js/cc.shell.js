/*
 * cc.shell.js
 */

/* global cc */

cc.shell = (function() {

    'use strict';

    var
    moduleConfig = {
        input_file_name: 'json/car.json',
        page_names: [
            'cover',
            'contents', 'preface', 'introduction',
            'volume', 'trust', 'topics', 'frequency',
            'postscript', 'colophon'
        ],
        settable: {
            input_file_name: false,
            page_names: false
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

        var page_id = 'cc-shell-pg-' + page_name;
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
                .attr('id', 'cc-cover-header')
                .addClass('sixteen columns')

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-cover-logo')
                .text('logo')
                .click({page_name: 'contents'}, present_page)
                .end()

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-cover-author')
                .text('blue peninsula')
                .end()

                .end() // div#cc-cover-header

            // body

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-cover-body')
                .addClass('sixteen columns')

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-cover-title')
                .text('title')
                .end()

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-cover-image')
                .text('image')
                .end()

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-cover-nav')
                .click({page_name: 'contents'}, present_page)
                .text('navigation')
                .end()

                .end(); // div#cc-cover-body

            break;

        case 'contents':
            create_front(moduleState.jq_containers[page_name], page_name);
            break;

        case 'preface':
            create_front(moduleState.jq_containers[page_name], page_name);
            break;

        case 'introduction':
            create_front(moduleState.jq_containers[page_name], page_name);
            break;

        case 'volume':
            create_body(moduleState.jq_containers[page_name], page_name);
            break;

        case 'trust':
            create_body(moduleState.jq_containers[page_name], page_name);
            break;

        case 'topics':
            create_body(moduleState.jq_containers[page_name], page_name);
            break;

        case 'frequency':
            create_body(moduleState.jq_containers[page_name], page_name);
            break;

        case 'postscript':
            create_back(moduleState.jq_containers[page_name], page_name);
            break;

        case 'colophon':
            create_back(moduleState.jq_containers[page_name], page_name);
            break;

        default:
        }
    };

    create_front = function(jq_container, page_name) {

        jq_container

        // header

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-header')
            .addClass('sixteen columns')

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-logo')
            .click({page_name: 'cover'}, present_page)
            .text('logo')
            .click({page_name: 'contents'}, present_page)
            .end()

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-title')
            .text('title')
            .end()

            .end() // div#cc-page-name-header

        // body

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-body')
            .addClass('sixteen columns')

            .append('<div></div>')
            .find('div:last')
            .addClass('row')

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-column-left')
            .addClass('eight columns')
            .text(page_name)
            .end()

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-column-right')
            .addClass('four columns')
            .end()

            .end() // div.row

            .end(); // div#cc-page-name-body

        // column left navigation

        jq_container = moduleState.jq_containers[page_name].find('#cc-' + page_name + '-column-right');
        for (var i_pg = 0; i_pg < moduleConfig.page_names.length; i_pg += 1) {
            var pg_nm = moduleConfig.page_names[i_pg];
            jq_container
                .append('<p></p>')
                .find('p:last')
                .click({page_name: pg_nm}, present_page)
                .text(pg_nm)
                .end();
        }
    };

    create_body = function(jq_container, page_name) {

        jq_container

        // header

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-header')
            .addClass('sixteen columns')

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-logo')
            .text('logo')
            .click({page_name: 'contents'}, present_page)
            .end()

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-author')
            .text('author')
            .end()

            .end() // div#cc-page-name-header

        // body

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-body')
            .addClass('sixteen columns')

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-title')
            .text('title')
            .end()

        // body navigation

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-nav')
            .addClass('row')

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-nav-volume')
            .addClass('one column')
            .click({page_name: 'volume'}, present_page)
            .text('volume')
            .end()

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-nav-trust')
            .addClass('one column')
            .click({page_name: 'trust'}, present_page)
            .text('trust')
            .end()

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-nav-topics')
            .addClass('one column')
            .click({page_name: 'topics'}, present_page)
            .text('topics')
            .end()

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-nav-frequency')
            .addClass('one column')
            .click({page_name: 'frequency'}, present_page)
            .text('frequency')
            .end()

            .end() // div#cc-page-name-nav

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-column-left')
            .addClass('four columns')
            .text(page_name)
            .end()

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-column-right')
            .addClass('eight columns')
            .text('column right')
            .end()

            .end() // div#cc-page-name-body

        // footer

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-footer')
            .addClass('sixteen columns')

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-social')
            .text('social')
            .end()

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-publisher')
            .text('publisher')
            .end()

            .end(); // div#cc-page-name-footer

    };

    create_back = function(jq_container, page_name) {
        create_front(jq_container, page_name);
    };

    return {
        configModule: configModule,
        initModule: initModule
    };

}());
