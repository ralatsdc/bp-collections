/*
 * cc.shell.js
 */

/* global cc */

cc.shell = (function () {

    'use strict';

    var
    configModule,
    initModule,
    getJqContainers,
    delegatePage;

    var
    module_Config = {
        country_file_name: 'json/collection/japan.json',
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
        // cc.grid.configModule({});

        cc.model.initModule(module_Config.country_file_name);
        // cc.grid.initModule();

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

    delegatePage = function (event) {
        present_Page(event);
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
            // cc.grid.presentGrid(page_name);
            cc.force.presentForce(page_name);
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

        var tags, i_tag, topics;

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
                .load('img/blu-pen-logo-two-color-text.svg')
                .end()

                .end() // div#cc-shell-cover-header

                .append('<hr>')

            // body

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-cover-body')
                .addClass('centered')

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-cover-title')
                .load('html/cc-shell-cover-title.html', function () {
                    $('div#cc-shell-cover-title')
                        .find('h1')
                        .text(cc.model.getCountry().toUpperCase());
                })
                .end()

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-cover-image')
                .text('An Image')
                // .load('img/blu-pen-cover-topics-japan.svg')
                .end()

                .append('<hr>')

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-cover-navigation')
                .click({page_name: 'contents'}, present_Page)
                .hover(to_Red, to_Black)
                .load('html/cc-shell-cover-navigation.html')
                .end()

                .append('<hr>')

                .end(); // div#cc-shell-cover-body

            break;

        case 'contents':
            create_Front(module_State.jq_containers[page_name], page_name);

            module_State.jq_containers[page_name]
                .find('div#cc-shell-front-contents')
                .removeClass('eight columns alpha')
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
            // TODO: Why is it necessary to load this empy file?
                .load('html/cc-shell-front-empty.html');

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
                .find('#cc-shell-visual-content-volume')

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-visual-volume-title')
                .load('html/cc-shell-visual-volume-title.html')
                .end()

                .append('<div></div>')
                .find('div:last')
                .addClass('one-third column alpha')
                .attr('id', 'cc-shell-visual-volume-description')
                .load('html/cc-shell-visual-volume-description.html')
                .end()

                .append('<div></div>')
                .find('div:last')
                .addClass('two-thirds column omega')
                .attr('id', 'cc-shell-visual-volume-graphic')
                .end()

                .end(); // div#cc-shell-visual-content-volume

            cc.force.initModule(page_name);

            break;

        case 'trust':
            create_Body(module_State.jq_containers[page_name], page_name);

            module_State.jq_containers[page_name]
                .find('#cc-shell-visual-content-trust')

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-visual-trust-title')
                .load('html/cc-shell-visual-trust-title.html')
                .end()

                .append('<div></div>')
                .find('div:last')
                .addClass('one-third column alpha')
                .attr('id', 'cc-shell-visual-trust-description')
                .load('html/cc-shell-visual-trust-description.html')
                .end()

                .append('<div></div>')
                .find('div:last')
                .addClass('two-thirds column omega')
                .attr('id', 'cc-shell-visual-trust-graphic')
                .end()

                .end(); // div#cc-shell-visual-content-trust

            cc.force.initModule(page_name);

            break;

        case 'topics':
            create_Body(module_State.jq_containers[page_name], page_name);

            tags = cc.model.getTags();

            module_State.jq_containers[page_name]
                .find('#cc-shell-visual-content-topics')

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-visual-topics-title')
                .load('html/cc-shell-visual-topics-title.html')
                .end()

                .append('<div></div>')
                .find('div:last')
                .addClass('one-third column alpha')
                .attr('id', 'cc-shell-visual-topics-description')
                .load('html/cc-shell-visual-topics-description.html')
                .end()

                .append('<div></div>')
                .find('div:last')
                .addClass('two-thirds column omega')

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-visual-topics-crisis')
                .end()

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-visual-topics-graphic')
                .end()

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-visual-topics-culture')
                .end()

                .end() // div#two-thirds column omega

                .end(); // div#cc-shell-visual-content-topics

            cc.force.initModule(page_name);

            module_State.jq_containers[page_name]
                .find('#cc-shell-visual-topics-crisis')
                .load('html/cc-shell-visual-topics-crisis.html', function () {
                    var crisis_tags = '';
                    for (i_tag = 0; i_tag < tags.length; i_tag += 1) {
                        if (tags[i_tag].type === 'crisis') {
                            crisis_tags += tags[i_tag].tag + ' &centerdot; ';
                        }
                    }
                    module_State.jq_containers[page_name]
                        .find('#cc-shell-visual-topics-crisis')
                        .find('h5:last')
                        .html(crisis_tags.slice(0, crisis_tags.length - 13));
                });

            module_State.jq_containers[page_name]
                .find('#cc-shell-visual-topics-culture')
                .load('html/cc-shell-visual-topics-culture.html', function () {
                    var culture_tags = '';
                    for (i_tag = 0; i_tag < tags.length; i_tag += 1) {
                        if (tags[i_tag].type === 'common') {
                            culture_tags += tags[i_tag].tag + ' &centerdot; ';
                        }
                    }
                    module_State.jq_containers[page_name]
                        .find('#cc-shell-visual-topics-culture')
                        .find('h5:last')
                        .html(culture_tags.slice(0, culture_tags.length - 13));
                });

            break;

        case 'frequency':
            create_Body(module_State.jq_containers[page_name], page_name);
            
            module_State.jq_containers[page_name]
                .find('#cc-shell-visual-content-frequency')

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-visual-frequency-title')
                .load('html/cc-shell-visual-frequency-title.html')
                .end()

                .append('<div></div>')
                .find('div:last')
                .addClass('one-third column alpha')
                .attr('id', 'cc-shell-visual-frequency-description')
                .load('html/cc-shell-visual-frequency-description.html')
                .end()

                .append('<div></div>')
                .find('div:last')
                .addClass('two-thirds column omega')
                .attr('id', 'cc-shell-visual-frequency-graphic')
                .end()

                .end(); // div#cc-shell-visual-content-frequency

            // cc.grid.initGrid(page_name);
            cc.force.initModule(page_name);

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
            create_Source(module_State.jq_containers[page_name], page_name);
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
            .addClass('two-thirds column alpha cc-shell-front-title')
            .attr('id', 'cc-shell-front-title-' + page_name)
            .load('html/cc-shell-front-title.html', function () {
                $('div#cc-shell-front-title-' + page_name)
                    .find('h4')
                    .click({page_name: 'contents'}, present_Page)
                    .hover(to_Red, to_Black)
                    .text(cc.model.getCountry().toUpperCase());
            })
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('one-third column omega cc-shell-front-share')
            .attr('id', 'cc-shell-front-share-' + page_name)
            .load('html/cc-shell-front-share.html')
            .end()

            .end() // div#cc-shell-page-name-header

            .append('<hr>')

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
            .addClass('two-thirds column alpha')

            .append('<div></div>')
            .find('div:last')
            .addClass('eight columns alpha cc-shell-front-content')
            .attr('id', 'cc-shell-front-' + page_name)
            .end()

            .end() // div.two-thirds column

            .append('<div></div>')
            .find('div:last')
            .addClass('one-third column omega cc-shell-front-navigation')
            .attr('id', 'cc-shell-front-navigation-' + page_name)
            .end()

            .end() // div.row

            .end(); // div#cc-shell-front-body-page-name

        // column right navigation

        module_State.jq_containers[page_name]
            .find('div#cc-shell-front-navigation-' + page_name)
            .load('html/cc-shell-front-navigation.html', function () {
                module_State.jq_containers[page_name]
                    .find('#cc-shell-front-nav-to-preface')
                    .addClass('cc-shell-front-nav-to-preface')
                    .attr('id', 'cc-shell-front-nav-to-preface-' + page_name)
                    .click({page_name: 'preface'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end()

                    .find('#cc-shell-front-nav-to-introduction')
                    .addClass('cc-shell-front-nav-to-introduction')
                    .attr('id', 'cc-shell-front-nav-to-introduction-' + page_name)
                    .click({page_name: 'introduction'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end()

                    .find('#cc-shell-front-nav-to-volume')
                    .addClass('cc-shell-front-nav-to-volume')
                    .attr('id', 'cc-shell-front-nav-to-volume-' + page_name)
                    .click({page_name: 'volume'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end()

                    .find('#cc-shell-front-nav-to-trust')
                    .addClass('cc-shell-front-nav-to-trust')
                    .attr('id', 'cc-shell-front-nav-to-trust-' + page_name)
                    .click({page_name: 'trust'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end()

                    .find('#cc-shell-front-nav-to-topics')
                    .addClass('cc-shell-front-nav-to-topics')
                    .attr('id', 'cc-shell-front-nav-to-topics-' + page_name)
                    .click({page_name: 'topics'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end()

                    .find('#cc-shell-front-nav-to-frequency')
                    .addClass('cc-shell-front-nav-to-frequency')
                    .attr('id', 'cc-shell-front-nav-to-frequency-' + page_name)
                    .click({page_name: 'frequency'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end()

                    .find('#cc-shell-front-nav-to-postscript')
                    .addClass('cc-shell-front-nav-to-postscript')
                    .attr('id', 'cc-shell-front-nav-to-postscript-' + page_name)
                    .click({page_name: 'postscript'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end()

                    .find('#cc-shell-front-nav-to-colophon')
                    .addClass('cc-shell-front-nav-to-colophon')
                    .attr('id', 'cc-shell-front-nav-to-colophon-' + page_name)
                    .click({page_name: 'colophon'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end();
            })
            .end() // div#cc-shell-front-navigation-page-name

        // footer

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-front-footer')
            .attr('id', 'cc-shell-front-footer-' + page_name)

            .append('<div></div>')
            .find('div:last')
            .addClass('row')

            .append('<div></div>')
            .find('div:last')
            .addClass('two-thirds column alpha')
            .load('html/cc-shell-front-empty.html')
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('one-third column omega cc-shell-front-logo')
            .attr('id', 'cc-shell-front-logo-' + page_name)
            .load('img/blu-pen-logo-two-color-text.svg')
            .end()

            .end() // div.row

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
        }
    };

    create_Visual = function (jq_container, page_name) {

        jq_container

        // header

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-visual-header')
            .attr('id', 'cc-shell-visual-header-' + page_name)

            .append('<div></div>')
            .find('div:last')
            .addClass('two-thirds column alpha cc-shell-visual-title')
            .attr('id', 'cc-shell-visual-title-' + page_name)
            .load('html/cc-shell-visual-title.html', function () {
                $('div#cc-shell-visual-title-' + page_name)
                    .find('h1')
                    .click({page_name: 'contents'}, present_Page)
                    .hover(to_Red, to_Black)
                    .text(cc.model.getCountry().toUpperCase());
            })
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('one-third column omega cc-shell-visual-share')
            .attr('id', 'cc-shell-visual-share-' + page_name)
            .load('html/cc-shell-visual-share.html')
            .end()

            .end() // div#cc-shell-visual-header-page-name

            .append('<hr>')

        // body

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-visual-body')
            .attr('id', 'cc-shell-visual-body-' + page_name)

        // body navigation

            .append('<div></div>')
            .find('div:last')
            .addClass('row cc-shell-visual-navigation')
            .attr('id', 'cc-shell-visual-navigation-' + page_name)
            .load('html/cc-shell-visual-navigation.html', function () {
                jq_container
                    .find('#cc-shell-visual-nav-to-volume')
                    .addClass('cc-shell-visual-nav-to-volume')
                    .attr('id', 'cc-shell-visual-nav-to-volume-' + page_name)
                    .click({page_name: 'volume'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end()

                    .find('#cc-shell-visual-nav-to-trust')
                    .addClass('cc-shell-visual-nav-to-trust')
                    .attr('id', 'cc-shell-visual-nav-to-trust-' + page_name)
                    .click({page_name: 'trust'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end()

                    .find('#cc-shell-visual-nav-to-topics')
                    .addClass('cc-shell-visual-nav-to-topics')
                    .attr('id', 'cc-shell-visual-nav-to-topics-' + page_name)
                    .click({page_name: 'topics'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end()

                    .find('#cc-shell-visual-nav-to-frequency')
                    .addClass('cc-shell-visual-nav-to-frequency')
                    .attr('id', 'cc-shell-visual-nav-to-frequency-' + page_name)
                    .click({page_name: 'frequency'}, present_Page)
                    .hover(to_Red, to_Black)
                    .end();
            })
            .end() // div#cc-shell-visual-navigation-page-name

        // body content

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-visual-content row')
            .attr('id', 'cc-shell-visual-content-' + page_name)
            .end()

            .end() // div#cc-shell-visual-body-page-name

        // footer

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-visual-footer')
            .attr('id', 'cc-shell-visual-footer-' + page_name)

            .append('<div></div>')
            .find('div:last')
            .addClass('row')

            .append('<div></div>')
            .find('div:last')
            .addClass('two-thirds column alpha')
            .load('html/cc-shell-front-empty.html')
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('one-third column omega cc-shell-visual-logo')
            .attr('id', 'cc-shell-visual-logo-' + page_name)
            .load('img/blu-pen-logo-two-color-text.svg')
            .end()

            .end() // div.row

            .end(); // div#cc-shell-visual-footer-page-name
    };

    create_Source = function (jq_container, page_name) {

        var current_source = cc.model.getCurrentSource();

        jq_container

        // header

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-source-header')
            .attr('id', 'cc-shell-source-header-' + page_name)

            .append('<div></div>')
            .find('div:last')
            .addClass('row')

            .append('<div></div>')
            .find('div:last')
            .addClass('two-thirds column cc-shell-source-title')
            .attr('id', 'cc-shell-source-title-' + page_name)
            .load('html/cc-shell-source-title.html', function () {
                var country = cc.model.getCountry().toLowerCase();
                $('div#cc-shell-source-title-' + page_name)
                    .find('h4')
                    .text(country.charAt(0).toUpperCase() + country.slice(1));
            })
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('one-third column cc-shell-source-share')
            .attr('id', 'cc-shell-source-share-' + page_name)
            .load('html/cc-shell-source-share.html')
            .end()

            .end() // div.row

        // header author

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-source-author')
            .attr('id', 'cc-shell-source-author-' + page_name)
            .load('html/cc-shell-source-author.html', function () {
                $('div#cc-shell-source-author-' + page_name)
                    .find('h2')
                    .text(current_source.data.name)
                    .end();
            })
            .end() 

            .end() // div#cc-shell-source-header-page-name

            .append('<hr>')

        // body

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-source-body')
            .attr('id', 'cc-shell-source-body-' + page_name)
            .end();

        // body content

        var n_row = 3, n_col = 3, n_smp = n_row * n_col, i_smp = -1, content;

        for (var i_row = 0; i_row < n_row; i_row += 1) {

            i_smp += 1;
            if (i_smp < current_source.sample.length && i_smp < n_smp) {

                if (current_source.sample[i_smp].type === 'text') {
                    content = current_source.sample[i_smp].value;
                } else { // type === 'photo'
                    content = '<img src="' + current_source.sample[i_smp].value + '">';
                }

                jq_container.find('div#cc-shell-source-body-' + page_name)
                    .append('<div></div>')
                    .find('div:last')
                    .addClass('row')

                    .append('<div></div>')
                    .find('div:last')
                    .addClass('one-third column alpha cc-shell-source-content')
                    .attr('id', 'cc-shell-source-content-' + page_name)
                    .html(content)
                    .end()

                    .end(); // div.row
            } else {
                break;
            }

            i_smp += 1;
            if (i_smp < current_source.sample.length && i_smp < n_smp) {

                if (current_source.sample[i_smp].type === 'text') {
                    content = current_source.sample[i_smp].value;
                } else { // type === 'photo'
                    content = '<img src="' + current_source.sample[i_smp].value + '">';
                }

                jq_container.find('div.row:last')
                    .append('<div></div>')
                    .find('div:last')
                    .addClass('one-third column cc-shell-source-content')
                    .attr('id', 'cc-shell-source-content-' + page_name)
                    .html(content)
                    .end();
            } else {
                break;
            }

            i_smp += 1;
            if (i_smp < current_source.sample.length && i_smp < n_smp) {

                if (current_source.sample[i_smp].type === 'text') {
                    content = current_source.sample[i_smp].value;
                } else { // type === 'photo'
                    content = '<img src="' + current_source.sample[i_smp].value + '">';
                }

                jq_container.find('div.row:last')
                    .append('<div></div>')
                    .find('div:last')
                    .addClass('one-third column omega cc-shell-source-content')
                    .attr('id', 'cc-shell-source-content-' + page_name)
                    .html(content)
                    .end();
            } else {
                break;
            }
        }

        // footer

        jq_container.find('div#cc-shell-source-body-' + page_name)
            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-source-footer')
            .attr('id', 'cc-shell-source-footer-' + page_name)

            .append('<div></div>')
            .find('div:last')
            .addClass('two-thirds column alpha')
            .load('html/cc-shell-front-empty.html')
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('one-third column omega cc-shell-source-logo')
            .attr('id', 'cc-shell-source-logo-' + page_name)
            .load('img/blu-pen-logo-two-color-text.svg')
            .end()

            .end(); // div#cc-shell-source-footer-page-name
    };

    create_Back = function (jq_container, page_name) {
        create_Front(jq_container, page_name);
    };

    return {
        configModule: configModule,
        initModule: initModule,
        getJqContainers: getJqContainers,
        delegatePage: delegatePage
    };

}());
