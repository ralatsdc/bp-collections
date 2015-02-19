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
    createFooter,
    delegatePage;

    var
    module_Config = {
        page_names: [
            'home',
            'browse',
            'connect',
            'news'
        ],
        section_names: {
            home: [
                'number',
                'outwit',
                'zebras',
                'tame',
                'fashion',
                'eliminate',
                'buildings',
                'preserve',
                'bones',
                'less',
                'window'
            ],
            browse: [
                'browse'
            ],
            connect: [
                'connect'
            ],
            news: [
                'news'
            ]
        },
        init_page_name: 'home',
        init_section_name: undefined,
        paging_major_bottom: 100,
        paging_minor_bottom: 100,
        country_file_name: '../crisis-countries/json/collection/car.json',
        twitter_tweets_per_day: 500000000,
        tumblr_posts_per_day: 80000000,
        flickr_photos_per_day: 1830000,
        mail_to: 'info@blu-pen.com',
        settable: {
            page_names: false,
            section_names: false,
            init_page_name: true,
            init_section_name: true,
            paging_major_bottom: false,
            paging_minor_bottom: false,
            country_file_name: true,
            twitter_tweets_per_day: false,
            tumblr_posts_per_day: false,
            flickr_photos_per_day: false,
            mail_to: false
        }
    },
    module_State = {
        jq_containers: {},
        uri_anchor: {},
        window_width: undefined,
        window_height: undefined,
        header_height: undefined,
        section_height: undefined,
        footer_height: 0,
        last_color: undefined,
        scroll_element: undefined
    },

    init_Header,
    init_Body,

    set_Window_Dimensions,
    set_Header_Height,
    set_Section_Height,
    set_Footer_Height,

    create_Body,
    create_Text,
    create_Image,
    create_Text_Left,
    create_Text_Right,

    present_Page,
    dismiss_Page,

    get_Scroll_Element,
    scroll_To_Section,
    scroll_Down,
    scroll_Up,
    disable_scrolling,
    enable_scrolling,

    send_Message,

    hover_In,
    hover_Out,
    on_Hash_Change,
    on_Resize,
    do_Callback;

    configModule = function (input_config) {
        bp.util.setConfig(input_config, module_Config);
        return true;
    };

    initModule = function (jq_container) {

        module_State.jq_containers.main =
            jq_container;

        bp.model.configModule({});

        bp.tumblr.configModule({});
        bp.tumblr.initModule({});

        cc.model.configModule({});
        // TODO: Look at initializing the cc model when needed with a callback
        cc.model.initModule(module_Config.country_file_name);

        cc.force.configModule({});

        init_Header();
    };

    getJqContainers = function () {
        return module_State.jq_containers;
    };

    createFooter = function (jq_page, callback, data) {
        jq_page
            .append('<div></div>')
            .find('div:last')
            .addClass('bp-shell-footer-content')
            .load('html/bp-shell-footer.html', function () {
                jq_page
                    .find('.bp-shell-share-on-flickr')
                    .load('img/bp-logo-flickr-square.svg')
                    .end()

                    .find('.bp-shell-share-on-tumblr')
                    .load('img/bp-logo-tumblr-square.svg')
                    .end()

                    .find('.bp-shell-share-on-twitter')
                    .load('img/bp-logo-twitter-square.svg')
                    .end()

                    .find('.bp-shell-share-by-email')
                    .load('img/bp-logo-email-square.svg')
                    .end()

                    .find('.bp-shell-footer-content .bp-shell-share-by-email')
                    .click({to: module_Config.mail_to,
                            subject: 'Greetings!'}, send_Message)
                    .end()

                    .find('.bp-shell-nav-to-browse')
                    .click({page_name: 'browse'}, present_Page)
                    .end()
                
                    .find('.bp-shell-nav-to-news')
                    .click({page_name: 'news'}, present_Page)
                    .end()
                
                    .find('.bp-shell-nav-to-connect')
                    .click({page_name: 'connect'}, present_Page)
                    .end();
                
                do_Callback(callback, data);
            });
    };

    delegatePage = function (event) {
        present_Page(event);
    };

    init_Header = function () {

        set_Window_Dimensions();

        module_State.jq_containers.header_fixed =
            module_State.jq_containers.main
            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-header-fixed')
            .addClass('room')
            .css('z-index', 4);

        module_State.jq_containers.header_content =
            module_State.jq_containers.header_fixed
            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-header-content')
            .addClass('container sixteen columns');

        module_State.jq_containers.header_content
            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-header-logo')
            .addClass('one-third column')
            .click({page_name: 'home'}, present_Page)
            .load('img/bp-logo-two-color-text-circle.svg', function () {
                module_State.jq_containers.header_content
                    .append('<div></div>')
                    .find('div:last')
                    .attr('id', 'bp-shell-header-navigation')
                    .addClass('two-thirds column opensansbold')
                    .load('html/bp-shell-header-navigation.html', function () {
                        module_State.jq_containers.header_content
                            .find('.bp-shell-share-on-flickr')
                            .load('img/bp-logo-flickr-square.svg')
                            .end()

                            .find('.bp-shell-share-on-tumblr')
                            .load('img/bp-logo-tumblr-square.svg')
                            .end()

                            .find('.bp-shell-share-on-twitter')
                            .load('img/bp-logo-twitter-square.svg')
                            .end()

                            .find('.bp-shell-share-by-email')
                            .load('img/bp-logo-email-square.svg')
                            .click({to: module_Config.mail_to,
                                    subject: 'Greetings!'}, send_Message)
                            .end()

                            .find('.bp-shell-nav-to-browse')
                            .click({page_name: 'browse'}, present_Page)
                            .end()
                
                            .find('.bp-shell-nav-to-news')
                            .click({page_name: 'news'}, present_Page)
                            .end()
                
                            .find('.bp-shell-nav-to-connect')
                            .click({page_name: 'connect'}, present_Page)
                            .end();

                        set_Header_Height();

                        init_Body();
                    });
            });
    };

    init_Body = function () {

        var i_p, page_names;

        set_Section_Height();

        module_State.jq_containers.body =
            module_State.jq_containers.main
            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-body-scrolling')
            .addClass('container row sixteen columns')

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-body-spacer')
            .load('html/bp-shell-empty.html')
            .end();

        page_names = module_Config.page_names;
        for (i_p = 0; i_p < page_names.length; i_p += 1) {
            create_Body(page_names[i_p]);
        }

        $(window).bind('hashchange', on_Hash_Change);
        $(window).bind('resize', on_Resize);
    };

    set_Window_Dimensions = function () {
        var
        w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0];
        module_State.window_width = w.innerWidth || e.clientWidth || g.clientWidth;
        module_State.window_height = w.innerHeight|| e.clientHeight|| g.clientHeight;
    };

    set_Header_Height = function () {
        module_State.header_height = 
            parseInt(module_State.jq_containers.header_content.css('height')) +
            parseInt(module_State.jq_containers.header_content.css('margin-top')) +
            parseInt(module_State.jq_containers.header_content.css('margin-bottom'));
    };

    set_Section_Height = function () {
        module_State.section_height =
            module_State.window_height -
            module_State.header_height;
    };

    set_Footer_Height = function () {
        var footer_height;
        $('div.bp-shell-footer-content').each(function () {
            footer_height = parseInt($(this).css('height'));
            if (footer_height > 0) {
                module_State.footer_height = footer_height;
            }
        });
    };

    create_Body = function (page_name) {

        var
        page_id = 'bp-shell-' + page_name,
        section_names = module_Config.section_names[page_name];

        module_State.jq_containers[page_name] =
            module_State.jq_containers.body
            .append('<div></div>')
            .find('div:last')
            .attr('id', page_id)
            .addClass('bp-shell-body')
            .css('display', 'none');

        for (var i_s = 0; i_s < section_names.length; i_s += 1) {
            var
            section_name = section_names[i_s],
            section_id = 'bp-shell-' + page_name + '-' + section_name;

            module_State.jq_containers[page_name + '-' + section_name] =
                module_State.jq_containers[page_name]
                .append('<div></div>')
                .find('div:last')
                .attr('id', section_id);

            switch (section_name) {
            case 'number':
            case 'outwit':
            case 'browse':
            case 'connect':
                create_Text(page_name, section_name);
                break;

            case 'zebras':
            case 'fashion':
            case 'buildings':
            case 'bones':
                create_Image(page_name, section_name);
                break;

            case 'window':
                create_Image(page_name, section_name,
                             present_Page, {page_name: module_Config.init_page_name,
                                            section_name: module_Config.init_section_name});
                break;

            case 'tame':
            case 'preserve':
                create_Text_Left(page_name, section_name);
                break;

            case 'eliminate':
            case 'less':
                create_Text_Right(page_name, section_name);
                break;
                
            case 'news':
                bp.tumblr.createNews({data: {page_name: page_name, section_name: section_name}});
                break;

            default:
            }
        }
    };

    create_Text = function (page_name, section_name, callback, data) {

        var
        jq_page = module_State.jq_containers[page_name],
        jq_section = module_State.jq_containers[page_name + '-' + section_name];

        jq_section
            .append('<div></div>')
            .find('div:last')
            .addClass('bp-shell-section-spacer')
            .load('html/bp-shell-empty.html')
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('bp-shell-section-content')
            .load('html/bp-shell-' + section_name + '.html', function () {

                switch (section_name) {
                case 'number':
                    jq_section
                        .find('a.bp-shell-share-on-tumblr')
                        .attr('href',
                              'http://www.tumblr.com/share/link?url=' +
                              encodeURIComponent('http://localhost:8080/blu-pen/home.html') +
                              '&name=' + encodeURIComponent('Blu Pen') +
                              '&description=' + encodeURIComponent('Content is flooding the Internet'))
                        .end()

                        .find('a.bp-shell-share-on-twitter')
                        .attr('href',
                              'https://twitter.com/share?url=' +
                              encodeURIComponent('http://localhost:8080/blu-pen/home.html') +
                              '&via=' + encodeURIComponent('blu_pen') +
                              '&text=' + encodeURIComponent('Content is flooding the Internet'))
                        .end()

                        .find('span.bp-shell-share-by-email')
                        .click({subject: 'Blu Pen',
                                body: 'Content is flooding the Internet'}, send_Message)
                        .end()

                        .addClass('bp-shell-section-without-footer')
                        .append('<div></div>')
                        .find('div:last')
                        .addClass('sixteen columns centered bp-shell-paging-major')
                        .click(scroll_Down)
                        .load('img/bp-circle-arrow-down.svg', function () {
                            var
                            interval = 100,
                            counter = 0,
                            rate =
                                (module_Config.flickr_photos_per_day +
                                 module_Config.tumblr_posts_per_day +
                                 module_Config.twitter_tweets_per_day) / 86400000;
                            // [photos|posts|tweets/ms] = [photos|posts|tweets/day] / [ms/day]
                            window.setInterval(function () {
                                counter += Math.round(interval * rate);
                                $('#bp-shell-counter').text(counter.toLocaleString());
                            }, interval);
                            on_Resize();
                            do_Callback(callback, data);
                        });
                    break;

                case 'outwit':
                    jq_section
                        .addClass('bp-shell-section-without-footer')
                        .append('<div></div>')
                        .find('div:last')
                        .addClass('sixteen columns centered bp-shell-paging-minor')
                        .click(scroll_Down)
                        .load('img/bp-circle-arrow-down.svg', function () {
                            on_Resize();
                            do_Callback(callback, data);
                        });
                    break;

                case 'browse':
                    jq_section
                        .find('div.bp-shell-content a.bp-shell-share-on-tumblr')
                        .attr('href',
                              'http://www.tumblr.com/share/link?url=' +
                              encodeURIComponent('http://localhost:8080/blu-pen/browse.html') +
                              '&name=' + encodeURIComponent('Blu Pen') +
                              '&description=' + encodeURIComponent('The Crisis Collection \u2014 One'))
                        .end()

                        .find('div.bp-shell-content a.bp-shell-share-on-twitter')
                        .attr('href',
                              'https://twitter.com/share?url=' +
                              encodeURIComponent('http://localhost:8080/blu-pen/browse.html') +
                              '&via=' + encodeURIComponent('blu_pen') +
                              '&text=' + encodeURIComponent('The Crisis Collection \u2014 One'))
                        .end()

                        .find('div.bp-shell-content span.bp-shell-share-by-email')
                        .click({subject: 'Blu Pen',
                                body: 'The Crisis Collection \u2014 One'}, send_Message)
                        .end()

                        .find('#bp-shell-collection-source-car')
                        .click(function () {
                            window.open('http://localhost:8080/crisis-countries/car.html');
                        })
                        .load('img/cc-cover-car.svg')
                        .end()

                        .find('div#bp-shell-collection-share-car a.bp-shell-share-on-tumblr')
                        .attr('href',
                              'http://www.tumblr.com/share/link?url=' +
                              encodeURIComponent('http://localhost:8080/crisis-countries/car.html') +
                              '&name=' + encodeURIComponent('Blu Pen') +
                              '&description=' + encodeURIComponent('CAR \u2014 A Visual Collection'))
                        .end()

                        .find('div#bp-shell-collection-share-car a.bp-shell-share-on-twitter')
                        .attr('href',
                              'https://twitter.com/share?url=' +
                              encodeURIComponent('http://localhost:8080/crisis-countries/car.html') +
                              '&via=' + encodeURIComponent('blu_pen') +
                              '&text=' + encodeURIComponent('CAR \u2014 A Visual Collection'))
                        .end()

                        .find('div#bp-shell-collection-share-car span.bp-shell-share-by-email')
                        .click({subject: 'Blu Pen',
                                body: 'CAR \u2014 A Visual Collection'}, send_Message)
                        .end()

                        .find('#bp-shell-collection-source-haiti')
                        .click(function () {
                            window.open('http://localhost:8080/crisis-countries/haiti.html');
                        })
                        .load('img/cc-cover-haiti.svg')
                        .end()

                        .find('div#bp-shell-collection-share-haiti a.bp-shell-share-on-tumblr')
                        .attr('href',
                              'http://www.tumblr.com/share/link?url=' +
                              encodeURIComponent('http://localhost:8080/crisis-countries/haiti.html') +
                              '&name=' + encodeURIComponent('Blu Pen') +
                              '&description=' + encodeURIComponent('Haiti \u2014 A Visual Collection'))
                        .end()

                        .find('div#bp-shell-collection-share-haiti a.bp-shell-share-on-twitter')
                        .attr('href',
                              'https://twitter.com/share?url=' +
                              encodeURIComponent('http://localhost:8080/crisis-countries/haiti.html') +
                              '&via=' + encodeURIComponent('blu_pen') +
                              '&text=' + encodeURIComponent('Haiti \u2014 A Visual Collection'))
                        .end()

                        .find('div#bp-shell-collection-share-haiti span.bp-shell-share-by-email')
                        .click({subject: 'Blu Pen',
                                body: 'Haiti \u2014 A Visual Collection'}, send_Message)
                        .end()

                        .find('#bp-shell-collection-source-japan')
                        .click(function () {
                            window.open('http://localhost:8080/crisis-countries/japan.html');
                        })
                        .load('img/cc-cover-japan.svg')
                        .end()

                        .find('div#bp-shell-collection-share-japan a.bp-shell-share-on-tumblr')
                        .attr('href',
                              'http://www.tumblr.com/share/link?url=' +
                              encodeURIComponent('http://localhost:8080/crisis-countries/japan.html') +
                              '&name=' + encodeURIComponent('Blu Pen') +
                              '&description=' + encodeURIComponent('Japan \u2014 A Visual Collection'))
                        .end()

                        .find('div#bp-shell-collection-share-japan a.bp-shell-share-on-twitter')
                        .attr('href',
                              'https://twitter.com/share?url=' +
                              encodeURIComponent('http://localhost:8080/crisis-countries/japan.html') +
                              '&via=' + encodeURIComponent('blu_pen') +
                              '&text=' + encodeURIComponent('Japan \u2014 A Visual Collection'))
                        .end()

                        .find('div#bp-shell-collection-share-japan span.bp-shell-share-by-email')
                        .click({subject: 'Blu Pen',
                                body: 'Japan \u2014 A Visual Collection'}, send_Message)
                        .end()

                        .find('#bp-shell-collection-source-philippines')
                        .click(function () {
                            window.open('http://localhost:8080/crisis-countries/philippines.html');
                        })
                        .load('img/cc-cover-philippines.svg')
                        .end()

                        .find('div#bp-shell-collection-share-philippines a.bp-shell-share-on-tumblr')
                        .attr('href',
                              'http://www.tumblr.com/share/link?url=' +
                              encodeURIComponent('http://localhost:8080/crisis-countries/philippines.html') +
                              '&name=' + encodeURIComponent('Blu Pen') +
                              '&description=' + encodeURIComponent('Philippines \u2014 A Visual Collection'))
                        .end()

                        .find('div#bp-shell-collection-share-philippines a.bp-shell-share-on-twitter')
                        .attr('href',
                              'https://twitter.com/share?url=' +
                              encodeURIComponent('http://localhost:8080/crisis-countries/philippines.html') +
                              '&via=' + encodeURIComponent('blu_pen') +
                              '&text=' + encodeURIComponent('Philippines \u2014 A Visual Collection'))
                        .end()

                        .find('div#bp-shell-collection-share-philippines span.bp-shell-share-by-email')
                        .click({subject: 'Blu Pen',
                                body: 'Philippines \u2014 A Visual Collection'}, send_Message)
                        .end()

                        .find('#bp-shell-collection-source-south-sudan')
                        .click(function () {
                            window.open('http://localhost:8080/crisis-countries/south-sudan.html');
                        })
                        .load('img/cc-cover-south-sudan.svg')
                        .end()

                        .find('div#bp-shell-collection-share-south-sudan a.bp-shell-share-on-tumblr')
                        .attr('href',
                              'http://www.tumblr.com/share/link?url=' +
                              encodeURIComponent('http://localhost:8080/crisis-countries/south-sudan.html') +
                              '&name=' + encodeURIComponent('Blu Pen') +
                              '&description=' + encodeURIComponent('South Sudan \u2014 A Visual Collection'))
                        .end()

                        .find('div#bp-shell-collection-share-south-sudan a.bp-shell-share-on-twitter')
                        .attr('href',
                              'https://twitter.com/share?url=' +
                              encodeURIComponent('http://localhost:8080/crisis-countries/south-sudan.html') +
                              '&via=' + encodeURIComponent('blu_pen') +
                              '&text=' + encodeURIComponent('South Sudan \u2014 A Visual Collection'))
                        .end()

                        .find('div#bp-shell-collection-share-south-sudan span.bp-shell-share-by-email')
                        .click({subject: 'Blu Pen',
                                body: 'South Sudan \u2014 A Visual Collection'}, send_Message)
                        .end()

                        .find('#bp-shell-collection-source-syria')
                        .click(function () {
                            window.open('http://localhost:8080/crisis-countries/syria.html');
                        })
                        .load('img/cc-cover-syria.svg')
                        .end()

                        .find('div#bp-shell-collection-share-syria a.bp-shell-share-on-tumblr')
                        .attr('href',
                              'http://www.tumblr.com/share/link?url=' +
                              encodeURIComponent('http://localhost:8080/crisis-countries/syria.html') +
                              '&name=' + encodeURIComponent('Blu Pen') +
                              '&description=' + encodeURIComponent('Syria \u2014 A Visual Collection'))
                        .end()

                        .find('div#bp-shell-collection-share-syria a.bp-shell-share-on-twitter')
                        .attr('href',
                              'https://twitter.com/share?url=' +
                              encodeURIComponent('http://localhost:8080/crisis-countries/syria.html') +
                              '&via=' + encodeURIComponent('blu_pen') +
                              '&text=' + encodeURIComponent('Syria \u2014 A Visual Collection'))
                        .end()

                        .find('div#bp-shell-collection-share-syria span.bp-shell-share-by-email')
                        .click({subject: 'Blu Pen',
                                body: 'Syria \u2014 A Visual Collection'}, send_Message)
                        .end()

                        .find('#bp-shell-collection-source-zimbabwe')
                        .click(function () {
                            window.open('http://localhost:8080/crisis-countries/zimbabwe.html');
                        })
                        .load('img/cc-cover-zimbabwe.svg')
                        .end()

                        .find('div#bp-shell-collection-share-zimbabwe a.bp-shell-share-on-tumblr')
                        .attr('href',
                              'http://www.tumblr.com/share/link?url=' +
                              encodeURIComponent('http://localhost:8080/crisis-countries/zimbabwe.html') +
                              '&name=' + encodeURIComponent('Blu Pen') +
                              '&description=' + encodeURIComponent('Zimbabwe \u2014 A Visual Collection'))
                        .end()

                        .find('div#bp-shell-collection-share-zimbabwe a.bp-shell-share-on-twitter')
                        .attr('href',
                              'https://twitter.com/share?url=' +
                              encodeURIComponent('http://localhost:8080/crisis-countries/zimbabwe.html') +
                              '&via=' + encodeURIComponent('blu_pen') +
                              '&text=' + encodeURIComponent('Zimbabwe \u2014 A Visual Collection'))
                        .end()

                        .find('div#bp-shell-collection-share-zimbabwe span.bp-shell-share-by-email')
                        .click({subject: 'Blu Pen',
                                body: 'Zimbabwe \u2014 A Visual Collection'}, send_Message)
                        .end();

                    createFooter(jq_page, function () {
                        do_Callback(callback, data);
                    });
                    break;

                case 'connect':
                    createFooter(jq_page, function () {
                        jq_section
                            .addClass('bp-shell-section-with-footer')
                            .find('.bp-shell-share-by-email')
                            .click({to: module_Config.mail_to,
                                    subject: 'Greetings!'}, send_Message)
                            .end();

                        on_Resize();
                        do_Callback(callback, data);
                    });
                    break;

                default:
                }
            });
    };

    create_Image = function (page_name, section_name, callback, data) {

        var
        jq_page = module_State.jq_containers[page_name],
        jq_section = module_State.jq_containers[page_name + '-' + section_name];

        jq_section
            .css({'background': 'url(img/bp-' + section_name + '.jpg)',
                  'background-size': 'cover'})
            .append('<div></div>')
            .find('div:last')
            .addClass('one-third column')
            .load('html/bp-shell-empty.html', function () {
                switch (section_name) {
                case 'zebras':
                case 'fashion':
                case 'buildings':
                case 'bones':
                    jq_section
                        .append('<div></div>')
                        .find('div:last')
                        .addClass('two-thirds column bp-shell-caption-without-footer oswaldbold')
                        .load('html/bp-shell-' + section_name + '.html', function () {
                            jq_section
                                .addClass('bp-shell-section-without-footer')
                                .append('<div></div>')
                                .find('div:last')
                                .addClass('sixteen columns centered bp-shell-paging-minor')
                                .click(scroll_Down)
                                .load('img/bp-circle-arrow-down.svg', function () {
                                    on_Resize();
                                    do_Callback(callback, data);
                                });
                        });
                    break;

                case 'window':
                    jq_section
                        .append('<div></div>')
                        .find('div:last')
                        .addClass('two-thirds column bp-shell-caption-with-footer oswaldbold')
                        .load('html/bp-shell-' + section_name + '.html', function () {
                            createFooter(jq_page, function () {
                                jq_section
                                    .addClass('bp-shell-section-with-footer');
                                on_Resize();
                                do_Callback(callback, data);
                            });
                        });
                    break;

                default:
                }
            });
    };

    create_Text_Left = function (page_name, section_name, callback, data) {

        var jq_section = module_State.jq_containers[page_name + '-' + section_name];

        jq_section
            .append('<div></div>')
            .find('div:last')
            .addClass('bp-shell-section-spacer')
            .load('html/bp-shell-empty.html')
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('bp-shell-section-content')

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-' + section_name + '-content')
            .addClass('two-thirds column')
            .load('html/bp-shell-' + section_name + '-content.html', function () {
                jq_section
                    .find('div.bp-shell-section-content')
                    .append('<div></div>')
                    .find('div:last')
                    .attr('id', 'bp-shell-' + section_name + '-navigation')
                    .addClass('one-third column')
                    .load('html/bp-shell-' + section_name + '-navigation.html', function () {
                        jq_section
                            .addClass('bp-shell-section-without-footer')
                            .find('a.bp-shell-share-on-tumblr')
                            .attr('href',
                                  'http://www.tumblr.com/share/link?url=' +
                                  encodeURIComponent('http://localhost:8080/blu-pen/browse.html') +
                                  '&name=' + encodeURIComponent('Blu Pen') +
                                  '&description=' + encodeURIComponent('The Crisis Collection \u2014 One'))
                            .end()

                            .find('a.bp-shell-share-on-twitter')
                            .attr('href',
                                  'https://twitter.com/share?url=' +
                                  encodeURIComponent('http://localhost:8080/blu-pen/browse.html') +
                                  '&via=' + encodeURIComponent('blu_pen') +
                                  '&text=' + encodeURIComponent('The Crisis Collection \u2014 One'))
                            .end()

                            .find('span.bp-shell-share-by-email')
                            .click({subject: 'Blu Pen',
                                    body: 'The Crisis Collection \u2014 One'}, send_Message)
                            .end();

                        switch (section_name) {
                        case 'tame':
                            jq_section
                                .find('#bp-shell-tame-image')
                                .load('img/cc-cover-car.svg')
                                .end();
                            break;

                        case 'preserve':
                            break;
                                
                        default:
                        }

                        jq_section
                            .append('<div></div>')
                            .find('div:last')
                            .addClass('sixteen columns centered bp-shell-paging-minor')
                            .click(scroll_Down)
                            .load('img/bp-circle-arrow-down.svg', function () {
                                on_Resize();
                                do_Callback(callback, data);
                            });
                    });
            });
    };

    create_Text_Right = function (page_name, section_name, callback, data) {

        var jq_section = module_State.jq_containers[page_name + '-' + section_name];

        jq_section
            .append('<div></div>')
            .find('div:last')
            .addClass('bp-shell-section-spacer')
            .load('html/bp-shell-empty.html')
            .end()

            .append('<div></div>')
            .find('div:last')
            .addClass('bp-shell-section-content')

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'bp-shell-' + section_name + '-navigation')
            .addClass('one-third column')
            .load('html/bp-shell-' + section_name + '-navigation.html', function () {

                jq_section
                    .find('a.bp-shell-share-on-tumblr')
                    .attr('href',
                          'http://www.tumblr.com/share/link?url=' +
                          encodeURIComponent('http://localhost:8080/blu-pen/browse.html') +
                          '&name=' + encodeURIComponent('Blu Pen') +
                          '&description=' + encodeURIComponent('The Crisis Collection \u2014 One'))
                    .end()

                    .find('a.bp-shell-share-on-twitter')
                    .attr('href',
                          'https://twitter.com/share?url=' +
                          encodeURIComponent('http://localhost:8080/blu-pen/browse.html') +
                          '&via=' + encodeURIComponent('blu_pen') +
                          '&text=' + encodeURIComponent('The Crisis Collection \u2014 One'))
                    .end()

                    .find('span.bp-shell-share-by-email')
                    .click({subject: 'Blu Pen',
                            body: 'The Crisis Collection \u2014 One'}, send_Message)
                    .end();

                switch (section_name) {
                case 'eliminate':
                    cc.force.initModule('trust');
                    cc.force.presentForce('trust');
                    break;


                case 'less':
                    jq_section
                        .find('#bp-shell-less-image')
                        .load('img/cc-cover-japan.svg')
                        .end();
                    break;

                default:
                }

                jq_section
                    .find('div.bp-shell-section-content')
                    .append('<div></div>')
                    .find('div:last')
                    .attr('id', 'bp-shell-' + section_name + '-content')
                    .addClass('two-thirds column')
                    .load('html/bp-shell-' + section_name + '-content.html', function () {
                        jq_section
                            .addClass('bp-shell-section-without-footer')
                            .append('<div></div>')
                            .find('div:last')
                            .addClass('sixteen columns centered bp-shell-paging-minor')
                            .click(scroll_Down)
                            .load('img/bp-circle-arrow-down.svg', function () {
                                on_Resize();
                                do_Callback(callback, data);
                            });
                    });
            });
    };

    present_Page = function (event) {

        var page_name, jq_page, section_name, uri_anchor;

        if (module_State.scroll_element === undefined) {
            module_State.scroll_element = get_Scroll_Element();
        }

        page_name = module_State.uri_anchor.page_name;
        jq_page = module_State.jq_containers[page_name];

        if (jq_page !== undefined && jq_page.css('display') !== 'none') {
            dismiss_Page(event);

        } else {

            page_name = event.data.page_name;
            jq_page = module_State.jq_containers[page_name];

            jq_page.fadeIn('slow', function () {
                on_Resize();

                section_name = event.data.section_name;

                if (section_name !== undefined) {
                    scroll_To_Section(page_name, section_name);
                }
            });

            uri_anchor = $.uriAnchor.makeAnchorMap();
            uri_anchor.page_name = page_name;
            $.uriAnchor.setAnchor(uri_anchor);
            module_State.uri_anchor = uri_anchor;
        }
    };

    dismiss_Page = function (event) {

        var page_name, jq_page;

        page_name = module_State.uri_anchor.page_name;
        jq_page = module_State.jq_containers[page_name];

        jq_page.fadeOut('slow', function () {
            $(module_State.scroll_element).scrollTop(0);
            present_Page(event);
        });
    };

    get_Scroll_Element = function () {

        /* If missing doctype (quirks mode) then will always use 'body' */
        if ( document.compatMode !== 'CSS1Compat' ) {
            return 'body';
        }

        /* If there's a doctype (and your page should) most browsers
        will support the scrollTop property on EITHER html OR body
        we'll have to do a quick test to detect which one... */
        var html = document.documentElement;
        var body = document.body;

        /* Get our starting position. pageYOffset works for all
        browsers except IE8 and below. */
        var startingY = window.pageYOffset || body.scrollTop || html.scrollTop;

        /* Scroll the window down by 1px (scrollTo works in all
        browsers) */
        var newY = startingY + 1;
        window.scrollTo(0, newY);

        /* And check which property changed. FF and IE use only
         html. Safari uses only body. Chrome has values for both, but
         says body.scrollTop is deprecated when in Strict mode, so
         let's check for html first. */
        var element = ( html.scrollTop === newY ) ? 'html' : 'body';

        /* Now reset back to the starting position */
        window.scrollTo(0, startingY);

        return element;
    };

    scroll_Up = function () {

        var
        page_name = module_State.uri_anchor.page_name,
        section_names = module_Config.section_names[page_name],
        i_s = Math.ceil($(module_State.scroll_element).scrollTop() / module_State.section_height);

        if (0 < i_s && i_s < section_names.length) {
            i_s -= 1;
            scroll_To_Section(page_name, section_names[i_s]);
        }
    };

    scroll_Down = function () {

        var
        page_name = module_State.uri_anchor.page_name,
        section_names = module_Config.section_names[page_name],
        i_s = Math.floor($(module_State.scroll_element).scrollTop() / module_State.section_height);

        if (-1 < i_s && i_s < section_names.length - 1) {
            i_s += 1;
            scroll_To_Section(page_name, section_names[i_s]);
        }
    };

    scroll_To_Section = function (page_name, section_name) {

        var
        section_names = module_Config.section_names[page_name],
        i_s = section_names.indexOf(section_name),
        scroll_target = i_s * module_State.section_height;
        
        disable_scrolling();
        $(module_State.scroll_element).animate({scrollTop: scroll_target}, 600, enable_scrolling);
    };

    disable_scrolling = function () {
        $(module_State.scroll_element).css('overflow', 'hidden');
    };

    enable_scrolling = function () {
        $(module_State.scroll_element).css('overflow', 'auto');
    };

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

    hover_In = function () {
        module_State.last_color = $(this).css('color');
        $(this).animate({'color': '#1AB6E5'}, 100);
    };

    hover_Out = function () {
        $(this).animate({'color': module_State.last_color}, 100);
    };
    
    on_Hash_Change = function () {
        var uri_anchor = $.uriAnchor.makeAnchorMap();
        if (uri_anchor.page_name !== module_State.uri_anchor.page_name) {
            present_Page({data: uri_anchor});
        }
    };

    on_Resize = function () {
        set_Window_Dimensions();
        set_Header_Height();
        set_Section_Height();
        set_Footer_Height();

        $('#bp-shell-body-spacer')
            .css('height', module_State.header_height + 'px');

        $('.bp-shell-section-without-footer')
            .css('height', module_State.section_height + 'px');

        $('.bp-shell-section-with-footer')
            .css('height', module_State.section_height - module_State.footer_height + 'px');

        $('.bp-shell-caption-without-footer')
            .css('padding-top', 0.618 * module_State.section_height + 'px');

        $('.bp-shell-caption-with-footer')
            .css('padding-top', 0.618 * (module_State.section_height - module_State.footer_height) + 'px');

        var
        page_name = module_State.uri_anchor.page_name,
        section_names = module_Config.section_names[page_name];
        switch(page_name) {
        case 'home':

            for (var i_s = 0; i_s < section_names.length; i_s += 1) {
                var
                section_name = section_names[i_s],
                section_id = 'bp-shell-' + page_name + '-' + section_name,
                paging_height;

                switch (section_name) {
                case 'number':
                    $('#' + section_id + ' .bp-shell-paging-major')
                        .css('height', parseInt($('#' + section_id + ' .bp-shell-paging-major svg').css('height')));
                    paging_height = 
                        module_State.section_height -
                        parseInt($('#' + section_id + ' .bp-shell-section-spacer').css('padding-top')) -
                        parseInt($('#' + section_id + ' .bp-shell-content').css('height')) -
                        // parseInt($('#' + section_id + ' .bp-shell-content p:last').css('margin-bottom')) -
                        parseInt($('#' + section_id + ' .bp-shell-paging-major svg').css('height')) - 
                        module_Config.paging_major_bottom;
                    $('#' + section_id + ' .bp-shell-paging-major').css('padding-top', paging_height + 'px');
                    break;

                case 'outwit':
                    $('#' + section_id + ' .bp-shell-paging-minor')
                        .css('height', parseInt($('#' + section_id + ' .bp-shell-paging-minor svg').css('height')));
                    paging_height = 
                        module_State.section_height -
                        parseInt($('#' + section_id + ' .bp-shell-section-spacer').css('padding-top')) -
                        parseInt($('#' + section_id + ' .bp-shell-content').css('height')) -
                        parseInt($('#' + section_id + ' .bp-shell-content p:last').css('margin-bottom')) -
                        parseInt($('#' + section_id + ' .bp-shell-paging-minor svg').css('height')) - 
                        module_Config.paging_minor_bottom;
                    $('#' + section_id + ' .bp-shell-paging-minor').css('padding-top', paging_height + 'px');
                    break;

                case 'zebras':
                case 'fashion':
                case 'buildings':
                case 'bones':
                    $('#' + section_id + ' .bp-shell-paging-minor')
                        .css('height', parseInt($('#' + section_id + ' .bp-shell-paging-minor svg').css('height')));
                    paging_height = 
                        module_State.section_height -
                        parseInt($('#' + section_id + ' .bp-shell-caption-without-footer').css('padding-top')) -
                        parseInt($('#' + section_id + ' .bp-shell-caption-without-footer').css('height')) -
                        parseInt($('#' + section_id + ' .bp-shell-paging-minor').css('height')) -
                        module_Config.paging_minor_bottom;
                    if (module_State.window_width > 767) {
                        paging_height += parseInt($('#' + section_id + ' p').css('margin-bottom'));
                    }
                    $('#' + section_id + ' .bp-shell-paging-minor').css('padding-top', paging_height + 'px');
                    break;

                case 'tame':
                case 'eliminate':
                case 'preserve':
                case 'less':
                    $('#' + section_id + ' .bp-shell-paging-minor')
                        .css('height', parseInt($('#' + section_id + ' .bp-shell-paging-minor svg').css('height')));
                    paging_height = 
                        module_State.section_height -
                        parseInt($('#' + section_id + ' .bp-shell-section-spacer').css('padding-top'));
                    if (module_State.window_width > 767) {
                        paging_height -= 
                            Math.max(parseInt($('#bp-shell-' + section_name + '-content').css('height')),
                                     parseInt($('#bp-shell-' + section_name + '-navigation').css('height')));
                    } else {
                        paging_height -= 
                            parseInt($('#bp-shell-' + section_name + '-content').css('height')) +
                            parseInt($('#bp-shell-' + section_name + '-navigation').css('height'));
                    }
                    paging_height -= 
                        parseInt($('#' + section_id + ' .bp-shell-paging-minor svg').css('height')) +
                        module_Config.paging_minor_bottom;
                    $('#' + section_id + ' .bp-shell-paging-minor').css('padding-top', paging_height + 'px');
                    break;

                case 'window':
                    break;

                default:
                }
            }
            break;

        case 'browse':
        case 'connect':
        case 'news':
            break;

        default:
        }
    };

    do_Callback = function (callback, data) {
        if (callback !== undefined && typeof callback === 'function') {
            if (data !== undefined) {
                callback({data: data});
            } else {
                callback();
            }
        }
    };

    return {
        configModule: configModule,
        initModule: initModule,
        getJqContainers: getJqContainers,
        createFooter: createFooter,
        delegatePage: delegatePage
    };

}());
