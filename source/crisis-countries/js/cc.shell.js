/**
 * Creates, presents, and dismisses all pages.
 */
/* global cc */
cc.shell = (function () {

    'use strict';

    /* == Public variables == */

    var
    configModule,
    initModule,
    getJqContainers,
    getCollectionUrl,
    delegatePage;

    /* == Private variables == */

    var
    module_Config = {
        collection_name: 'car',
        init_page_name: 'cover',
        settable: {
            collection_name: true,
            init_page_name: false
        }
    },
    module_State = {
        collection_file: undefined,
        collection_url: undefined,
        jq_containers: {},
        uri_anchor: {}
    },
    present_Page,
    dismiss_Page,
    create_Page,
    create_Front,
    create_Body,
    create_Source,
    create_Back,
    on_Hash_Change,
    send_Message,
    hover_In,
    hover_Out;

    /* == Public functions ==*/

    /**
     * Sets the configuration key value pairs for this module.
     *
     * @param {Object} input_config configuration key value pairs to
     *     set, if permitted
     *
     * @return {boolean|undefined} true if successful, undefined
     *     otherwise
     */
    configModule = function (input_config) {
        cc.util.setConfig(input_config, module_Config);
        return true;
    };

    /**
     * Configures and initializes all required modules. Selects the
     * initial page, from the URI anchor, or module configuration.
     * Presents the initial page using the model module which
     * delegates presentation to this module. Binds the hash change
     * event.
     * 
     * @param {Object} jq_container a jQuery selection
     *
     * @return {undefined}
     */
    initModule = function (jq_container) {

        module_State.collection_file =
            'json/collection/' + module_Config.collection_name + '.json';
        module_State.collection_url =
            'http://localhost:8080/crisis-countries/' + module_Config.collection_name + '.html';
        if ($.isEmptyObject(jq_container)) {
            return;
        }

        // Sets the container class on the main div
        module_State.jq_containers.main = jq_container
            .addClass('container sixteen columns');

        cc.model.configModule({});
        cc.force.configModule({});

        // Assigns the initial page from the anchor, if present, or
        // configuration, if not
        var uri_anchor = $.uriAnchor.makeAnchorMap();
        var page_name;
        if ('page_name' in uri_anchor) {
            page_name = uri_anchor.page_name;
        } else {
            page_name = module_Config.init_page_name;
        }

        // Presents the initial page indirectly through the model
        // module
        switch (page_name) {
        case 'cover':
        case 'contents':
        case 'preface':
        case 'introduction':
        case 'volume':
        case 'trust':
        case 'topics':
        case 'frequency':
        case 'postscript':
        case 'colophon':
            cc.model.initModule(module_State.collection_file,
                                {page_name: page_name});
            break;

        case 'source':
            if ('source_index' in uri_anchor) {
                cc.model.initModule(module_State.collection_file,
                                    {source_index: uri_anchor.source_index});
            }
            break;
            
        default:
        }
        $(window).bind('hashchange', on_Hash_Change);
    };

    /**
     * Returns all jQuery selections.
     *
     * return {Array.Object}
     */
    getJqContainers = function () {
        return module_State.jq_containers;
    };

    /**
     * Returns the collection URL.
     *
     * return {String}
     */
    getCollectionUrl = function () {
        return module_State.collection_url;
    };

    /**
     * Present a page at the request of another module.
     *
     * @param {Object} event contains a data element which contains a
     *     page_name element
     *
     * @return {undefined}
     */
    delegatePage = function (event) {
        present_Page(event);
    };

    /* == Private functions ==*/

    /**
     * Presents the page contained in the URI anchor.
     *
     * @return {undefined}
     */
    on_Hash_Change = function () {
        var uri_anchor = $.uriAnchor.makeAnchorMap();
        if (uri_anchor.page_name !== module_State.uri_anchor.page_name) {
            present_Page({data: uri_anchor});
        }
    };

    // TODO: Move this to a common utilities object. Same for blu-pen
    send_Message = function (event) {
        /*
        window.setTimeout(
            function () {
                var event = {data: {page_name: 'connect'}};
                present_Page(event);
            }, 2000);
        */
        var url, qry = '?', win;
        url = 'mailto:';
        if (event.data !== null) {
            if (event.data.hasOwnProperty('to')) {
                url += encodeURIComponent(event.data.to);
            }
            if (event.data.hasOwnProperty('subject')) {
                url += qry + 'subject=' + encodeURIComponent(event.data.subject);
                qry = '&';
            }
            if (event.data.hasOwnProperty('body')) {
                url += qry + 'body=' + encodeURIComponent(event.data.body);
            }
        }
        win = window.open(url);
        win.setTimeout(
            function () {
                if (win && win.open && !win.closed) {
                    win.close();
                }
            }, 1000);
    };

    /**
     * Animates color change to indicate hover in.
     *
     * @return {undefined}
     */
    hover_In = function () {
        $(this).animate({'color': '#6085ff'}, 100);
    };

    /**
     * Animates color change to indicate hover out.
     *
     * @return {undefined}
     */
    hover_Out = function () {
        $(this).animate({'color': '#000000'}, 100);
    };

    /**
     * Creates the page to present as needed, presents force layout
     * for visual pages, dismisses page if different from URI anchor,
     * then animates page presentation and sets URI anchor.
     *
     * @param {Object} event contains a data element which contains a
     *     page_name element
     *
     * @return {undefined}
     */
    present_Page = function (event) {

        var page_name = event.data.page_name;

        // Create page as needed
        if (module_State.jq_containers[page_name] === undefined) {
            create_Page(page_name);
        }

        // Present force layout for visual pages
        switch (page_name) {
        case 'volume':
        case 'trust':
        case 'topics':
        case 'frequency':
            cc.force.presentForce(page_name);
            break;

        default:
        }

        // Dismiss page if different from URI anchor
        if (page_name !== module_State.uri_anchor.page_name) {
            dismiss_Page(module_State.uri_anchor.page_name);
        }

        // Animate page presentation
        module_State.jq_containers[page_name].fadeIn('slow');

        // Set URI anchor
        var uri_anchor = $.uriAnchor.makeAnchorMap();
        uri_anchor.page_name = page_name;
        $.uriAnchor.setAnchor(uri_anchor);
        module_State.uri_anchor = uri_anchor;
    };

    /**
     * Dismisses page if defined and displayed by setting 'display'
     * style to 'none'.
     *
     * @param {string} page_name the page name
     *
     * @return {undefined}
     */
    dismiss_Page = function (page_name) {
        if (module_State.jq_containers[page_name] !== undefined &&
            module_State.jq_containers[page_name].css('display') !== 'none') {
            module_State.jq_containers[page_name].css('display', 'none');
        }
    };

    /**
     * Creates front matter, body, and back matter pages by name,
     * loading content, populating elements, and attaching click and
     * hover callbacks as needed. Content is external to facilitate
     * internationalization.
     *
     * @param {string} page_name the page name
     *
     * @return {undefined}
     */
    create_Page = function (page_name) {

        var tags, i_tag;

        // Create and assign the page container
        var page_id = 'cc-shell-' + page_name;
        module_State.jq_containers.main
            .append('<div></div>')
            .find('div:last')
            .attr('id', page_id)
            .css('display', 'none')
            .end();
        module_State.jq_containers[page_name] = $('#' + page_id);

        // Create page content by name
        switch (page_name) {
        case 'cover':

            module_State.jq_containers[page_name]

            // Create cover page header

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-cover-header')
                .addClass('cc-shell-centered')

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-cover-logo')
                .click(function () {
                    window.open('http://www.blu-pen.com');
                })
                .load('img/bp-logo-two-color-text-circle.svg')
                .end()

                .end() // div#cc-shell-cover-header

                .append('<hr>')

            // Create cover page body

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-cover-body')
                .addClass('cc-shell-centered')

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-cover-title')
                .load('html/cc-shell-cover-title.html', function () {
                    var
                    text = 
                        cc.model.getCountry().toUpperCase() +
                        '\u2014 A Visual Collection',
                    url =
                        'http://localhost:8080/crisis-countries/' +
                        module_Config.collection_name +
                        '.html#!page_name=cover';

                    $('div#cc-shell-cover-title')
                        .find('h1')
                        .text(cc.model.getCountry().toUpperCase())
                        .end()

                        .find('.cc-shell-share-on-tumblr')
                        .load('img/bp-logo-tumblr-square.svg')
                        .attr('href',
                              'http://www.tumblr.com/share/link?url=' +
                              encodeURIComponent(url) +
                              '&name=' + encodeURIComponent('Blu Pen') +
                              '&description=' + encodeURIComponent(text))
                        .end()

                        .find('.cc-shell-share-on-twitter')
                        .load('img/bp-logo-twitter-square.svg')
                        .attr('href',
                              'https://twitter.com/share?url=' +
                              encodeURIComponent(url) +
                              '&via=' + encodeURIComponent('blu_pen') +
                              '&text=' + encodeURIComponent(text))
                        .end()

                        .find('.cc-shell-share-by-email')
                        .load('img/bp-logo-email-square.svg')
                        .click({subject: 'Blu Pen',
                                body:
                                cc.model.getCountry().toUpperCase() +
                                ' \u2014 A Visual Collection\n' +
                                'http://localhost:8080/crisis-countries/' +
                                module_Config.collection_name +
                                '.html'},
                               send_Message)
                        .end();
                })
                .end()

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-cover-image')
                .addClass('offset-by-three ten columns')
                .load('img/cc-cover-' + module_Config.collection_name + '.svg')
                .end()

                .append('<div></div>')
                .find('div:last')
                .attr('id', 'cc-shell-cover-navigation')
                .load('html/cc-shell-cover-navigation.html', function () {
                    $('#cc-shell-cover-navigation')
                        .find('h1')
                        .click({page_name: 'contents'}, present_Page)
                        .hover(hover_In, hover_Out);
                })
                .end()

                .end(); // div#cc-shell-cover-body

            break;

        case 'contents':

            // Create default front matter page
            create_Front(module_State.jq_containers[page_name], page_name);

            // Create content page navigation
            module_State.jq_containers[page_name]
                .find('div#cc-shell-front-contents')
                .removeClass('eight columns alpha')
                .load('html/cc-shell-front-contents.html', function () {
                    module_State.jq_containers[page_name]
                        .find('#cc-shell-front-contents-nav-to-preface')
                        .click({page_name: 'preface'}, present_Page)
                        .hover(hover_In, hover_Out)
                        .end()

                        .find('#cc-shell-front-contents-nav-to-introduction')
                        .click({page_name: 'introduction'}, present_Page)
                        .hover(hover_In, hover_Out)
                        .end()

                        .find('.cc-shell-front-contents-nav-to-volume')
                        .click({page_name: 'volume'}, present_Page)
                        .hover(hover_In, hover_Out)
                        .end()

                        .find('#cc-shell-front-contents-nav-to-trust')
                        .click({page_name: 'trust'}, present_Page)
                        .hover(hover_In, hover_Out)
                        .end()

                        .find('#cc-shell-front-contents-nav-to-topics')
                        .click({page_name: 'topics'}, present_Page)
                        .hover(hover_In, hover_Out)
                        .end()

                        .find('#cc-shell-front-contents-nav-to-frequency')
                        .click({page_name: 'frequency'}, present_Page)
                        .hover(hover_In, hover_Out)
                        .end()

                        .find('#cc-shell-front-contents-nav-to-postscript')
                        .click({page_name: 'postscript'}, present_Page)
                        .hover(hover_In, hover_Out)
                        .end()

                        .find('#cc-shell-front-contents-nav-to-colophon')
                        .click({page_name: 'colophon'}, present_Page)
                        .hover(hover_In, hover_Out)
                        .end();
                })
                .end(); // div#cc-shell-front-contents

            // Destroy front matter page navigation
            module_State.jq_containers[page_name]
                .find('div#cc-shell-front-navigation-contents')
                .empty()
                .load('html/cc-shell-empty.html');

            break;

        case 'preface':

            // Create default front matter page
            create_Front(module_State.jq_containers[page_name], page_name);

            // Load preface page content
            module_State.jq_containers[page_name]
                .find('div#cc-shell-front-preface')
                .load('html/cc-shell-front-preface.html');

            break;

        case 'introduction':

            // Create default front matter page
            create_Front(module_State.jq_containers[page_name], page_name);

            // Load introduction page content
            module_State.jq_containers[page_name]
                .find('div#cc-shell-front-introduction')
                .load('html/cc-shell-front-introduction.html');

            break;

        case 'volume':

            // Create default body page
            create_Body(module_State.jq_containers[page_name], page_name);

            // Load volume page content
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
                .load('html/cc-shell-visual-volume-description.html', function () {
                    cc.force.resizeVolumeLegend();

                    var
                    text = 
                        cc.model.getCountry().toUpperCase() +
                        '\u2014 A Visual Collection: Volume',
                    url =
                        'http://localhost:8080/crisis-countries/' +
                        module_Config.collection_name +
                        '.html#!page_name=volume';

                    $('div#cc-shell-visual-volume-description')
                        .find('.cc-shell-share-on-tumblr')
                        .load('img/bp-logo-tumblr-square.svg')
                        .attr('href',
                              'http://www.tumblr.com/share/link?url=' +
                              encodeURIComponent(url) +
                              '&name=' + encodeURIComponent('Blu Pen') +
                              '&description=' + encodeURIComponent(text))
                        .end()

                        .find('.cc-shell-share-on-twitter')
                        .load('img/bp-logo-twitter-square.svg')
                        .attr('href',
                              'https://twitter.com/share?url=' +
                              encodeURIComponent(url) +
                              '&via=' + encodeURIComponent('blu_pen') +
                              '&text=' + encodeURIComponent(text))
                        .end()

                        .find('.cc-shell-share-by-email')
                        .load('img/bp-logo-email-square.svg')
                        .click({subject: 'Blu Pen',
                                body:
                                cc.model.getCountry().toUpperCase() +
                                ' \u2014 A Visual Collection: Volume\n' +
                                'http://localhost:8080/crisis-countries/' +
                                module_Config.collection_name +
                                '.html#!page_name=volume'},
                               send_Message)
                        .end();
                })
                .end()

                .append('<div></div>')
                .find('div:last')
                .addClass('two-thirds column omega')
                .attr('id', 'cc-shell-visual-volume-graphic')
                .end()

                .end(); // div#cc-shell-visual-content-volume
            
            // Initialize volume force layout
            cc.force.initModule(page_name);

            break;

        case 'trust':

            // Create default body page
            create_Body(module_State.jq_containers[page_name], page_name);

            // Load trust page content
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
                .load('html/cc-shell-visual-trust-description.html', function () {
                    cc.force.resizeTrustLegend();

                    var
                    text = 
                        cc.model.getCountry().toUpperCase() +
                        '\u2014 A Visual Collection: Trust',
                    url =
                        'http://localhost:8080/crisis-countries/' +
                        module_Config.collection_name +
                        '.html#!page_name=trust';

                    $('div#cc-shell-visual-trust-description')
                        .find('.cc-shell-share-on-tumblr')
                        .load('img/bp-logo-tumblr-square.svg')
                        .attr('href',
                              'http://www.tumblr.com/share/link?url=' +
                              encodeURIComponent(url) +
                              '&name=' + encodeURIComponent('Blu Pen') +
                              '&description=' + encodeURIComponent(text))
                        .end()

                        .find('.cc-shell-share-on-twitter')
                        .load('img/bp-logo-twitter-square.svg')
                        .attr('href',
                              'https://twitter.com/share?url=' +
                              encodeURIComponent(url) +
                              '&via=' + encodeURIComponent('blu_pen') +
                              '&text=' + encodeURIComponent(text))
                        .end()

                        .find('.cc-shell-share-by-email')
                        .load('img/bp-logo-email-square.svg')
                        .click({subject: 'Blu Pen',
                                body:
                                cc.model.getCountry().toUpperCase() +
                                ' \u2014 A Visual Collection: Trust\n' +
                                'http://localhost:8080/crisis-countries/' +
                                module_Config.collection_name +
                                '.html#!page_name=trust'},
                               send_Message)
                        .end();
                })
                .end()

                .append('<div></div>')
                .find('div:last')
                .addClass('two-thirds column omega')
                .attr('id', 'cc-shell-visual-trust-graphic')
                .end()

                .end(); // div#cc-shell-visual-content-trust
            
            // Initialize trust force layout
            cc.force.initModule(page_name);

            break;

        case 'topics':

            // Create default body page
            create_Body(module_State.jq_containers[page_name], page_name);

            // Get tags for display
            tags = cc.model.getTags();

            // Load topics page content
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
                .load('html/cc-shell-visual-topics-description.html', function () {
                    cc.force.resizeTopicsLegend();

                    var
                    text = 
                        cc.model.getCountry().toUpperCase() +
                        '\u2014 A Visual Collection: Topics',
                    url =
                        'http://localhost:8080/crisis-countries/' +
                        module_Config.collection_name +
                        '.html#!page_name=topics';

                    $('div#cc-shell-visual-topics-description')
                        .find('.cc-shell-share-on-tumblr')
                        .load('img/bp-logo-tumblr-square.svg')
                        .attr('href',
                              'http://www.tumblr.com/share/link?url=' +
                              encodeURIComponent(url) +
                              '&name=' + encodeURIComponent('Blu Pen') +
                              '&description=' + encodeURIComponent(text))
                        .end()

                        .find('.cc-shell-share-on-twitter')
                        .load('img/bp-logo-twitter-square.svg')
                        .attr('href',
                              'https://twitter.com/share?url=' +
                              encodeURIComponent(url) +
                              '&via=' + encodeURIComponent('blu_pen') +
                              '&text=' + encodeURIComponent(text))
                        .end()

                        .find('.cc-shell-share-by-email')
                        .load('img/bp-logo-email-square.svg')
                        .click({subject: 'Blu Pen',
                                body:
                                cc.model.getCountry().toUpperCase() +
                                ' \u2014 A Visual Collection: Topics\n' +
                                'http://localhost:8080/crisis-countries/' +
                                module_Config.collection_name +
                                '.html#!page_name=topics'},
                               send_Message)
                        .end();
                })
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

            // Initialize topics force layout
            cc.force.initModule(page_name);

            // Load crisis tag content and populate crisis tag element
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

            // Load culture tag content and populate culture tag element
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

            // Create default body page
            create_Body(module_State.jq_containers[page_name], page_name);
            
            // Load frequency page content
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
                .load('html/cc-shell-visual-frequency-description.html', function () {
                    var
                    text = 
                        cc.model.getCountry().toUpperCase() +
                        '\u2014 A Visual Collection: Frequency',
                    url =
                        'http://localhost:8080/crisis-countries/' +
                        module_Config.collection_name +
                        '.html#!page_name=frequency';

                    $('div#cc-shell-visual-frequency-description')
                        .find('.cc-shell-share-on-tumblr')
                        .load('img/bp-logo-tumblr-square.svg')
                        .attr('href',
                              'http://www.tumblr.com/share/link?url=' +
                              encodeURIComponent(url) +
                              '&name=' + encodeURIComponent('Blu Pen') +
                              '&description=' + encodeURIComponent(text))
                        .end()

                        .find('.cc-shell-share-on-twitter')
                        .load('img/bp-logo-twitter-square.svg')
                        .attr('href',
                              'https://twitter.com/share?url=' +
                              encodeURIComponent(url) +
                              '&via=' + encodeURIComponent('blu_pen') +
                              '&text=' + encodeURIComponent(text))
                        .end()

                        .find('.cc-shell-share-by-email')
                        .load('img/bp-logo-email-square.svg')
                        .click({subject: 'Blu Pen',
                                body:
                                cc.model.getCountry().toUpperCase() + 
                                ' \u2014 A Visual Collection: Frequency\n' +
                                'http://localhost:8080/crisis-countries/' +
                                module_Config.collection_name +
                                '.html#!page_name=frequency'},
                               send_Message)
                        .end();
                })
                .end()

                .append('<div></div>')
                .find('div:last')
                .addClass('two-thirds column omega')
                .attr('id', 'cc-shell-visual-frequency-graphic')
                .end()

                .end(); // div#cc-shell-visual-content-frequency

            // Initialize frequency force layout
            cc.force.initModule(page_name);

            break;

        case 'postscript':

            // Create default back matter page
            create_Back(module_State.jq_containers[page_name], page_name);

            // Load postscript page content
            module_State.jq_containers[page_name]
                .find('div#cc-shell-front-postscript')
                .load('html/cc-shell-front-postscript.html');

            break;

        case 'colophon':

            // Create default back matter page
            create_Back(module_State.jq_containers[page_name], page_name);

            // Load colophon page content
            module_State.jq_containers[page_name]
                .find('div#cc-shell-front-colophon')
                .load('html/cc-shell-front-colophon.html');

            break;

        default:

            /* Note that the source page name cannot be known in
               advance, since it depends on the crisis country
               data. The source pages are the only pages with this
               characteristic, which is why creation of source pages
               is the switch default. */

            // Create default source page
            create_Source(module_State.jq_containers[page_name], page_name);
        }
    };

    /**
     * Creates default front matter pages.
     *
     * @param {Object} jq_container the jQuery container to which the
     *     page will be appended
     * @param {string} page_name the page name to create
     *
     * @return {undefined}
     */
    create_Front = function (jq_container, page_name) {

        jq_container

        // Create front matter header

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
                    .click({page_name: 'cover'}, present_Page)
                    .hover(hover_In, hover_Out)
                    .text(cc.model.getCountry().toUpperCase());
            })
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('one-third column omega cc-shell-front-share')
            .attr('id', 'cc-shell-front-share-' + page_name)
            .load('html/cc-shell-front-share.html', function () {
                $('div#cc-shell-front-share-' + page_name)
                    .find('.cc-shell-front-logo')
                    .load('img/bp-logo-two-color-text-circle.svg')
                    .end()

                    .find('.cc-shell-share-on-flickr')
                    .load('img/bp-logo-flickr-square.svg')
                    .end()

                    .find('.cc-shell-share-on-tumblr')
                    .load('img/bp-logo-tumblr-square.svg')
                    .end()

                    .find('.cc-shell-share-on-twitter')
                    .load('img/bp-logo-twitter-square.svg')
                    .end()

                    .find('.cc-shell-share-by-email')
                    .load('img/bp-logo-email-square.svg')
                    .click(function () {
                        window.open('http://eepurl.com/bfB51j');
                    })
                    .end();
            })
            .end()

            .end() // div#cc-shell-front-header-page-name

            .append('<hr>')

        // Create front matter page body

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

        // Create front matter page column right navigation

        module_State.jq_containers[page_name]
            .find('div#cc-shell-front-navigation-' + page_name)
            .load('html/cc-shell-front-navigation.html', function () {
                module_State.jq_containers[page_name]
                    .find('#cc-shell-front-nav-to-preface')
                    .addClass('cc-shell-front-nav-to-preface')
                    .attr('id', 'cc-shell-front-nav-to-preface-' + page_name)
                    .click({page_name: 'preface'}, present_Page)
                    .hover(hover_In, hover_Out)
                    .end()

                    .find('#cc-shell-front-nav-to-introduction')
                    .addClass('cc-shell-front-nav-to-introduction')
                    .attr('id', 'cc-shell-front-nav-to-introduction-' + page_name)
                    .click({page_name: 'introduction'}, present_Page)
                    .hover(hover_In, hover_Out)
                    .end()

                    .find('.cc-shell-front-nav-to-volume')
                    // .addClass('cc-shell-front-nav-to-volume')
                    .attr('id', 'cc-shell-front-nav-to-volume-' + page_name)
                    .click({page_name: 'volume'}, present_Page)
                    .hover(hover_In, hover_Out)
                    .end()

                    .find('#cc-shell-front-nav-to-trust')
                    .addClass('cc-shell-front-nav-to-trust')
                    .attr('id', 'cc-shell-front-nav-to-trust-' + page_name)
                    .click({page_name: 'trust'}, present_Page)
                    .hover(hover_In, hover_Out)
                    .end()

                    .find('#cc-shell-front-nav-to-topics')
                    .addClass('cc-shell-front-nav-to-topics')
                    .attr('id', 'cc-shell-front-nav-to-topics-' + page_name)
                    .click({page_name: 'topics'}, present_Page)
                    .hover(hover_In, hover_Out)
                    .end()

                    .find('#cc-shell-front-nav-to-frequency')
                    .addClass('cc-shell-front-nav-to-frequency')
                    .attr('id', 'cc-shell-front-nav-to-frequency-' + page_name)
                    .click({page_name: 'frequency'}, present_Page)
                    .hover(hover_In, hover_Out)
                    .end()

                    .find('#cc-shell-front-nav-to-postscript')
                    .addClass('cc-shell-front-nav-to-postscript')
                    .attr('id', 'cc-shell-front-nav-to-postscript-' + page_name)
                    .click({page_name: 'postscript'}, present_Page)
                    .hover(hover_In, hover_Out)
                    .end()

                    .find('#cc-shell-front-nav-to-colophon')
                    .addClass('cc-shell-front-nav-to-colophon')
                    .attr('id', 'cc-shell-front-nav-to-colophon-' + page_name)
                    .click({page_name: 'colophon'}, present_Page)
                    .hover(hover_In, hover_Out)
                    .end();
            })
            .end() // div#cc-shell-front-navigation-page-name

        // Create front matter page footer

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
            .load('html/cc-shell-empty.html')
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('one-third column omega')
            .load('html/cc-shell-empty.html')
            .end()

            .end() // div.row

            .end(); // div#cc-shell-front-footer-page-name
    };

    /**
     * Creates default body pages.
     *
     * @param {Object} jq_container the jQuery container to which the
     *     page will be appended
     * @param {string} page_name the page name to create
     *
     * @return {undefined}
     */
    create_Body = function (jq_container, page_name) {

        // Assign navigation sequence for body pages
        var
        back = {
            volume: 'introduction',
            trust: 'volume',
            topics: 'trust',
            frequency: 'topics'
        },
        next = {
            volume: 'trust',
            trust: 'topics',
            topics: 'frequency',
            frequency: 'postscript'
        };

        jq_container

        // Create body page header

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-visual-header')
            .attr('id', 'cc-shell-visual-header-' + page_name)

            .append('<div></div>')
            .find('div:last')
            .addClass('two-thirds column alpha cc-shell-visual-title')
            .attr('id', 'cc-shell-visual-title-' + page_name)
            .load('html/cc-shell-visual-title.html', function () {
                var
                text = 
                    cc.model.getCountry().toUpperCase() +
                    '\u2014 A Visual Collection',
                url =
                    'http://localhost:8080/crisis-countries/' +
                    module_Config.collection_name +
                    '.html#!page_name=cover';

                $('div#cc-shell-visual-title-' + page_name)
                    .find('h1')
                    .click({page_name: 'cover'}, present_Page)
                    .hover(hover_In, hover_Out)
                    .text(cc.model.getCountry().toUpperCase())
                    .end()

                    .find('.cc-shell-share-on-tumblr')
                    .load('img/bp-logo-tumblr-square.svg')
                    .attr('href',
                          'http://www.tumblr.com/share/link?url=' +
                          encodeURIComponent(url) +
                          '&name=' + encodeURIComponent('Blu Pen') +
                          '&description=' + encodeURIComponent(text))
                    .end()

                    .find('.cc-shell-share-on-twitter')
                    .load('img/bp-logo-twitter-square.svg')
                    .attr('href',
                          'https://twitter.com/share?url=' +
                          encodeURIComponent(url) +
                          '&via=' + encodeURIComponent('blu_pen') +
                          '&text=' + encodeURIComponent(text))
                    .end()

                    .find('.cc-shell-share-by-email')
                    .load('img/bp-logo-email-square.svg')
                    .click({subject: 'Blu Pen',
                            body:
                            cc.model.getCountry().toUpperCase() +
                            ' \u2014 A Visual Collection\n' +
                            'http://localhost:8080/crisis-countries/' +
                            module_Config.collection_name +
                            '.html'},
                           send_Message)
                    .end();
            })
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('one-third column omega cc-shell-visual-share')
            .attr('id', 'cc-shell-visual-share-' + page_name)
            .load('html/cc-shell-visual-share.html', function () {
                    $('div#cc-shell-visual-share-' + page_name)
                    .find('.cc-shell-visual-logo')
                    .load('img/bp-logo-two-color-text-circle.svg')
                    .end()

                    .find('.cc-shell-share-on-flickr')
                    .load('img/bp-logo-flickr-square.svg')
                    .end()

                    .find('.cc-shell-share-on-tumblr')
                    .load('img/bp-logo-tumblr-square.svg')
                    .end()

                    .find('.cc-shell-share-on-twitter')
                    .load('img/bp-logo-twitter-square.svg')
                    .end()

                    .find('.cc-shell-share-by-email')
                    .load('img/bp-logo-email-square.svg')
                    .click(function () {
                        window.open('http://eepurl.com/bfB51j');
                    })
                    .end();
            })
            .end()

            .end() // div#cc-shell-visual-header-page-name

            .append('<hr>')

        // Create body page body

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-visual-body')
            .attr('id', 'cc-shell-visual-body-' + page_name)

        // Create body page navigation

            .append('<div></div>')
            .find('div:last')
            .addClass('row cc-shell-visual-navigation')
            .attr('id', 'cc-shell-visual-navigation-' + page_name)
            .load('html/cc-shell-visual-navigation.html', function () {
                jq_container
                    .find('div.cc-shell-circle-arrow:first')
                    .click({page_name: back[page_name]}, present_Page)
                    .load('img/cc-circle-arrow-left.svg')
                    .end()

                    .find('#cc-shell-visual-nav-to-volume')
                    .addClass('cc-shell-visual-nav-to-volume')
                    .attr('id', 'cc-shell-visual-nav-to-volume-' + page_name)
                    .click({page_name: 'volume'}, present_Page)
                    .hover(hover_In, hover_Out)
                    .end()

                    .find('#cc-shell-visual-nav-to-trust')
                    .addClass('cc-shell-visual-nav-to-trust')
                    .attr('id', 'cc-shell-visual-nav-to-trust-' + page_name)
                    .click({page_name: 'trust'}, present_Page)
                    .hover(hover_In, hover_Out)
                    .end()

                    .find('#cc-shell-visual-nav-to-topics')
                    .addClass('cc-shell-visual-nav-to-topics')
                    .attr('id', 'cc-shell-visual-nav-to-topics-' + page_name)
                    .click({page_name: 'topics'}, present_Page)
                    .hover(hover_In, hover_Out)
                    .end()

                    .find('#cc-shell-visual-nav-to-frequency')
                    .addClass('cc-shell-visual-nav-to-frequency')
                    .attr('id', 'cc-shell-visual-nav-to-frequency-' + page_name)
                    .click({page_name: 'frequency'}, present_Page)
                    .hover(hover_In, hover_Out)
                    .end()
                
                    .find('div.cc-shell-circle-arrow:last')
                    .click({page_name: next[page_name]}, present_Page)
                    .load('img/cc-circle-arrow-right.svg')
                    .end();
            })
            .end() // div#cc-shell-visual-navigation-page-name

        // Create body page content

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-visual-content row')
            .attr('id', 'cc-shell-visual-content-' + page_name)
            .end()

            .end() // div#cc-shell-visual-body-page-name

        // Create body page footer

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
            .load('html/cc-shell-empty.html')
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('one-third column omega')
            .load('html/cc-shell-empty.html')
            .end()

            .end() // div.row

            .end(); // div#cc-shell-visual-footer-page-name
    };

    /**
     * Creates default source pages.
     *
     * @param {Object} jq_container the jQuery container to which the
     *     page will be appended
     * @param {string} page_name the page name to create
     *
     * @return {undefined}
     */
    create_Source = function (jq_container, page_name) {

        // Get source sample
        var source_object = cc.model.getSourceObject();

        jq_container

        // Create source page header

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-source-header')
            .attr('id', 'cc-shell-source-header-' + page_name)

            .append('<div></div>')
            .find('div:last')
            .addClass('row')

            .append('<div></div>')
            .find('div:last')
            .addClass('two-thirds column alpha cc-shell-source-title')
            .attr('id', 'cc-shell-source-title-' + page_name)
            .load('html/cc-shell-source-title.html', function () {
                $('div#cc-shell-source-title-' + page_name)
                    .find('h4')
                    .click({page_name: 'cover'}, present_Page)
                    .hover(hover_In, hover_Out)
                    .text(cc.model.getCountry().toUpperCase());
            })
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('one-third column omega cc-shell-source-share')
            .attr('id', 'cc-shell-source-share-' + page_name)
            .load('html/cc-shell-source-share.html', function () {
                $('div#cc-shell-source-share-' + page_name)
                    .find('.cc-shell-visual-logo')
                    .load('img/bp-logo-two-color-text-circle.svg')
                    .end()

                    .find('.cc-shell-share-on-flickr')
                    .load('img/bp-logo-flickr-square.svg')
                    .end()

                    .find('.cc-shell-share-on-tumblr')
                    .load('img/bp-logo-tumblr-square.svg')
                    .end()

                    .find('.cc-shell-share-on-twitter')
                    .load('img/bp-logo-twitter-square.svg')
                    .end()

                    .find('.cc-shell-share-by-email')
                    .load('img/bp-logo-email-square.svg')
                    .click(function () {
                        window.open('http://eepurl.com/bfB51j');
                    })
                    .end();
            })
            .end()

            .end() // div.row

        // Create source page header author

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-source-author')
            .attr('id', 'cc-shell-source-author-' + page_name)
            .load('html/cc-shell-source-author.html', function () {
                $('div#cc-shell-source-author-' + page_name)
                    .find('h2')
                    .text(source_object.data.name)
                    .click(function () {
                        window.open(source_object.data.url);
                    })
                    .hover(hover_In, hover_Out)
                    .end();
            })
            .end() 

            .end() // div#cc-shell-source-header-page-name

            .append('<hr>')

        // Create source page body

            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-source-body')
            .attr('id', 'cc-shell-source-body-' + page_name);

        // Create source page body content by placing text or photo
        // samples in a grid

        var n_row = 3, n_col = 3, n_smp = n_row * n_col, i_smp = -1, content;

        // Fill each row
        for (var i_row = 0; i_row < n_row; i_row += 1) {

            // Fill column one
            i_smp += 1;
            if (i_smp < source_object.sample.length && i_smp < n_smp) {

                if (source_object.sample[i_smp].type === 'text') {
                    content = source_object.sample[i_smp].value;
                } else { // type === 'photo'
                    content = '<img src="' + source_object.sample[i_smp].url + '">';
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

            // Fill column two
            i_smp += 1;
            if (i_smp < source_object.sample.length && i_smp < n_smp) {

                if (source_object.sample[i_smp].type === 'text') {
                    content = source_object.sample[i_smp].value;
                } else { // type === 'photo'
                    content = '<img src="' + source_object.sample[i_smp].url + '">';
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

            // Fill column three
            i_smp += 1;
            if (i_smp < source_object.sample.length && i_smp < n_smp) {

                if (source_object.sample[i_smp].type === 'text') {
                    content = source_object.sample[i_smp].value;
                } else { // type === 'photo'
                    content = '<img src="' + source_object.sample[i_smp].url + '">';
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

        // Create source page footer

        jq_container.find('div#cc-shell-source-body-' + page_name)
            .append('<div></div>')
            .find('div:last')
            .addClass('cc-shell-source-footer')
            .attr('id', 'cc-shell-source-footer-' + page_name)

            .append('<div></div>')
            .find('div:last')
            .addClass('two-thirds column alpha')
            .load('html/cc-shell-empty.html')
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('one-third column omega')
            .load('html/cc-shell-empty.html')
            .end()

            .end(); // div#cc-shell-source-footer-page-name
    };

    /**
     * Creates default back matter pages precisely by creating a
     * default front matter page.
     *
     * @param {Object} jq_container the jQuery container to which the
     *     page will be appended
     * @param {string} page_name the page name to create
     *
     * @return {undefined}
     */
    create_Back = function (jq_container, page_name) {
        create_Front(jq_container, page_name);
    };

    return {
        configModule: configModule,
        initModule: initModule,
        getJqContainers: getJqContainers,
        getCollectionUrl: getCollectionUrl,
        delegatePage: delegatePage
    };

}());
