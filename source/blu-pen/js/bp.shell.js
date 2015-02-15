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
        init_page_name: 'home',
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
        paging_major_bottom: 100,
        paging_minor_bottom: 100,
        country_file_name: '../crisis-countries/json/collection/car.json',
        twitter_tweets_per_day: 500000000,
        tumblr_posts_per_day: 80000000,
        flickr_photos_per_day: 1830000,
        mail_to: 'raymond.leclair@gmail.com',
        settable: {
            page_names: false,
            init_page_name: true,
            section_names: false,
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
        window_height: undefined,
        header_height: undefined,
        section_height: undefined,
        last_color: undefined,
        scroll_element: undefined
    },

    init_Header,
    init_Body,

    set_Window_Height,
    set_Header_Height,
    set_Section_Height,

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
                    .find('.bp-shell-footer-nav-to-tumblr')
                    .load('img/bp-logo-tumblr-square.svg')
                    .end()

                    .find('.bp-shell-footer-nav-to-twitter')
                    .load('img/bp-logo-twitter-square.svg')
                    .end()

                    .find('.bp-shell-footer-nav-to-email')
                    .click(send_Message)
                    .load('img/bp-logo-email-square.svg')
                    .end()

                    .find('.bp-shell-footer-nav-to-browse')
                    .click({page_name: 'browse'}, present_Page)
                    .end();

                do_Callback(callback, data);
            });
    };

    delegatePage = function (event) {
        present_Page(event);
    };

    init_Header = function () {

        set_Window_Height();

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
            .load('img/bp-logo-two-color-text.svg', function () {
                module_State.jq_containers.header_content
                    .append('<div></div>')
                    .find('div:last')
                    .attr('id', 'bp-shell-header-navigation')
                    .addClass('two-thirds column opensansbold')
                    .load('html/bp-shell-header-navigation.html', function () {
                        module_State.jq_containers.header_content
                            .find('#bp-shell-header-nav-to-browse')
                            .click({page_name: 'browse'}, present_Page)
                            .end()

                            .find('#bp-shell-header-nav-to-news')
                            .click({page_name: 'news'}, present_Page)
                            .end()

                            .find('#bp-shell-header-nav-to-connect')
                            .click({page_name: 'connect'}, present_Page)
                            .end()

                            .find('#bp-shell-header-nav-to-flickr')
                            .load('img/bp-logo-flickr-square.svg')
                            .end()

                            .find('#bp-shell-header-nav-to-tumblr')
                            .load('img/bp-logo-tumblr-square.svg')
                            .end()

                            .find('#bp-shell-header-nav-to-twitter')
                            .load('img/bp-logo-twitter-square.svg')
                            .end()

                            .find('#bp-shell-header-nav-to-email')
                            .click(send_Message)
                            .load('img/bp-logo-email-square.svg')
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

    set_Window_Height = function () {
        var
        w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName(module_State.scroll_element)[0];
        // width = w.innerWidth || e.clientWidth || g.clientWidth;
        module_State.window_height = w.innerHeight|| e.clientHeight|| g.clientHeight;
    };

    set_Header_Height = function () {
        if (module_State.jq_containers.header_content !== undefined) {
            module_State.header_height = 
                parseInt(module_State.jq_containers.header_content.css('height')) +
                parseInt(module_State.jq_containers.header_content.css('margin-top')) +
                parseInt(module_State.jq_containers.header_content.css('margin-bottom'));
        }
    };

    set_Section_Height = function () {
        module_State.section_height =
            module_State.window_height -
            module_State.header_height;
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
                create_Image(page_name, section_name, present_Page, {page_name: 'home'});
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
                        .addClass('bp-shell-section')
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
                        .addClass('bp-shell-section')
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
                        .find('#bp-shell-collection-source-car')
                        .click(function () {
                            window.open('http://localhost:8080/crisis-countries/car.html');
                        })
                        .load('img/cc-cover-car.svg')
                        .end()

                        .find('#bp-shell-collection-source-haiti')
                        .click(function () {
                            window.open('http://localhost:8080/crisis-countries/haiti.html');
                        })
                        .load('img/cc-cover-haiti.svg')
                        .end()

                        .find('#bp-shell-collection-source-japan')
                        .click(function () {
                            window.open('http://localhost:8080/crisis-countries/japan.html');
                        })
                        .load('img/cc-cover-japan.svg')
                        .end()

                        .find('#bp-shell-collection-source-philippines')
                        .click(function () {
                            window.open('http://localhost:8080/crisis-countries/philippines.html');
                        })
                        .load('img/cc-cover-philippines.svg')
                        .end()

                        .find('#bp-shell-collection-source-south-sudan')
                        .click(function () {
                            window.open('http://localhost:8080/crisis-countries/south-sudan.html');
                        })
                        .load('img/cc-cover-south-sudan.svg')
                        .end()

                        .find('#bp-shell-collection-source-syria')
                        .click(function () {
                            window.open('http://localhost:8080/crisis-countries/syria.html');
                        })
                        .load('img/cc-cover-syria.svg')
                        .end()

                        .find('#bp-shell-collection-source-zimbabwe')
                        .click(function () {
                            window.open('http://localhost:8080/crisis-countries/zimbabwe.html');
                        })
                        .load('img/cc-cover-zimbabwe.svg')
                        .end();

                    createFooter(jq_page, function () {
                        do_Callback(callback, data);
                    });
                    break;

                case 'connect':
                    createFooter(jq_page, function () {
                        jq_section
                            .addClass('bp-shell-section')
                            .find('#bp-shell-connect-nav-to-email')
                            .click(send_Message)
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
                jq_section
                    .append('<div></div>')
                    .find('div:last')
                    .addClass('two-thirds column bp-shell-caption oswaldbold')
                    .load('html/bp-shell-' + section_name + '.html', function () {
                        switch (section_name) {
                        case 'zebras':
                        case 'fashion':
                        case 'buildings':
                        case 'bones':
                            jq_section
                                .addClass('bp-shell-section')
                                .append('<div></div>')
                                .find('div:last')
                                .addClass('sixteen columns centered bp-shell-paging-minor')
                                .click(scroll_Down)
                                .load('img/bp-circle-arrow-down.svg', function () {
                                    on_Resize();
                                    do_Callback(callback, data);
                                });
                            break;

                        case 'window':
                            createFooter(jq_page, function () {
                                jq_section
                                    .addClass('bp-shell-section');
                                on_Resize();
                                do_Callback(callback, data);
                            });
                            break;

                        default:
                        }
                    });
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
                            .addClass('bp-shell-section');

                        switch (section_name) {
                        case 'tame':
                            jq_section
                                .find('#bp-shell-tame-image')
                                .load('img/cc-cover-car.svg')
                                .end()

                                .find('#bp-shell-tame-nav-to-browse')
                                .click({page_name: 'browse'}, present_Page)
                                .end();
                            break;

                        case 'preserve':
                            jq_section
                                .find('#bp-shell-preserve-nav-to-browse')
                                .click({page_name: 'browse'}, present_Page)
                                .end();
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

                switch (section_name) {
                case 'eliminate':
                    cc.force.initModule('trust');
                    cc.force.presentForce('trust');
                    jq_section
                        .find('#bp-shell-eliminate-nav-to-browse')
                        .click({page_name: 'browse'}, present_Page)
                        .end();
                    break;


                case 'less':
                    jq_section
                        .find('#bp-shell-less-image')
                        .load('img/cc-cover-japan.svg')
                        .end()

                        .find('#bp-shell-less-nav-to-browse')
                        .click({page_name: 'browse'}, present_Page)
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
                            .addClass('bp-shell-section')
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

        var page_name, jq_page, uri_anchor;

        page_name = module_State.uri_anchor.page_name;

        jq_page = module_State.jq_containers[page_name];

        if (jq_page !== undefined && jq_page.css('display') !== 'none') {
            dismiss_Page(event);

        } else {

            page_name = event.data.page_name;

            jq_page = module_State.jq_containers[page_name];

            jq_page.fadeIn('slow', function () {
                on_Resize();
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

        // if missing doctype (quirks mode) then will always use 'body'
        if ( document.compatMode !== 'CSS1Compat' ) {
            return 'body';
        }

        // if there's a doctype (and your page should)
        // most browsers will support the scrollTop property on EITHER html OR body
        // we'll have to do a quick test to detect which one...
        var html = document.documentElement;
        var body = document.body;

        // get our starting position. 
        // pageYOffset works for all browsers except IE8 and below
        var startingY = window.pageYOffset || body.scrollTop || html.scrollTop;

        // scroll the window down by 1px (scrollTo works in all browsers)
        var newY = startingY + 1;
        window.scrollTo(0, newY);

        // And check which property changed
        // FF and IE use only html. Safari uses only body.
        // Chrome has values for both, but says 
        // body.scrollTop is deprecated when in Strict mode.,
        // so let's check for html first.
        var element = ( html.scrollTop === newY ) ? 'html' : 'body';

        // now reset back to the starting position
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

        if (module_State.scroll_element === undefined) {
            module_State.scroll_element = get_Scroll_Element();
        }

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

        if (module_State.scroll_element === undefined) {
            module_State.scroll_element = get_Scroll_Element();
        }

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

    send_Message = function () {
        /*
        window.setTimeout(
            function () {
                var event = {data: {page_name: 'connect'}};
                present_Page(event);
            }, 2000);
        */
        var win = window.open('mailto:' + module_Config.mail_to);
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
        set_Window_Height();
        set_Header_Height();
        set_Section_Height();

        $('#bp-shell-body-spacer').css('height', module_State.header_height + 'px');
        $('.bp-shell-section').css('height', module_State.section_height + 'px');
        $('.bp-shell-caption').css('padding-top', 0.618 * module_State.section_height + 'px');

        // TODO: There has got to be a better way...
        var
        page_name = module_State.uri_anchor.page_name,
        section_names = module_Config.section_names[page_name],
        footer_height;
        switch(page_name) {
        case 'home':
            
            /*
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
                        parseInt($('#' + section_id + ' .bp-shell-content').css('padding-top')) -
                        parseInt($('#' + section_id + ' .bp-shell-content').css('height')) -
                        parseInt($('#' + section_id + ' .bp-shell-content p').css('margin-bottom')) -
                        parseInt($('#' + section_id + ' .bp-shell-paging-major svg').css('height')) - 
                        module_Config.paging_major_bottom;
                    $('#' + section_id + ' .bp-shell-paging-major').css('padding-top', paging_height + 'px');
                    break;

                case 'outwit':
                    $('#' + section_id + ' .bp-shell-paging-minor')
                        .css('height', parseInt($('#' + section_id + ' .bp-shell-paging-minor svg').css('height')));
                    paging_height = 
                        module_State.section_height -
                        parseInt($('#' + section_id + ' .bp-shell-content').css('padding-top')) -
                        parseInt($('#' + section_id + ' .bp-shell-content').css('height')) -
                        parseInt($('#' + section_id + ' .bp-shell-content p').css('margin-bottom')) -
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
                        parseInt($('#' + section_id + ' .bp-shell-caption').css('padding-top')) -
                        parseInt($('#' + section_id + ' .bp-shell-caption').css('height')) -
                        parseInt($('#' + section_id + ' .bp-shell-caption h3').css('margin-bottom')) -
                        parseInt($('#' + section_id + ' .bp-shell-paging-minor svg').css('height')) -
                        module_Config.paging_minor_bottom;
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
                        parseInt($('#' + section_id + ' .bp-shell-navigation').css('padding-top')) -
                        parseInt($('#' + section_id + ' .bp-shell-navigation').css('height')) -
                        parseInt($('#' + section_id + ' .bp-shell-paging-minor svg').css('height')) - 
                        module_Config.paging_minor_bottom;
                    $('#' + section_id + ' .bp-shell-paging-minor').css('padding-top', paging_height + 'px');
                    break;

                case 'window':
                    // TODO: Fix this
                    footer_height = 99; // parseInt($('#bp-shell-home .bp-shell-footer-content').css('height'));
                    $('#bp-shell-home-window')
                        .css('height', module_State.section_height - footer_height + 'px');
                    $('#bp-shell-home-window .bp-shell-caption')
                        .css('padding-top', 0.618 * (module_State.section_height - footer_height) + 'px');
                    break;

                default:
                }
            }
            */
            footer_height = parseInt($('#bp-shell-home .bp-shell-footer-content').css('height'));
            $('#bp-shell-home-window')
                .css('height', module_State.section_height - footer_height + 'px');
            $('#bp-shell-home-window .bp-shell-caption')
                .css('padding-top', 0.618 * (module_State.section_height - footer_height) + 'px');
            break;

        case 'browse':
            break;

        case 'connect':
            footer_height = parseInt($('#bp-shell-connect .bp-shell-footer-content').css('height'));
            $('#bp-shell-connect-connect')
                .css('height', module_State.section_height - footer_height + 'px');
            break;

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
