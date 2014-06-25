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
    content,
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
                .text('Blue Peninsula')
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
                .append('<h1>Japan</h1>')
                .append('<h2>A Visual Collection</h2>')
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
                .append('<p>VIEW THE COLLECTION</p>')
                .end()

                .end(); // div#cc-cover-body

            break;

        case 'contents':
            create_front(moduleState.jq_containers[page_name], page_name);

            moduleState.jq_containers[page_name]
                .find('div#cc-' + page_name + '-column-left')
                .addClass('contents')

                .append('<h1></h1>')
                .find('h1:last')
                .text('Contents')
                .end()

                .append('<h2></h2>')
                .find('h2:last')
                .text('Preface')
                .click({page_name: 'preface'}, present_page)
                .end()

                .append('<h2></h2>')
                .find('h2:last')
                .text('Introduction')
                .click({page_name: 'introduction'}, present_page)
                .end()

                .append('<h2></h2>')
                .find('h2:last')
                .text('Perspectives')
                .end()

                .append('<h3></h3>')
                .find('h3:last')
                .addClass('contents indent-by-one')
                .text('Volume')
                .click({page_name: 'volume'}, present_page)
                .end()

                .append('<p></p>')
                .find('p:last')
                .addClass('contents indent-by-one')
                .text('Posts and photos proliferate')
                .end()

                .append('<h3></h3>')
                .find('h3:last')
                .addClass('contents indent-by-one')
                .text('Trust')
                .click({page_name: 'trust'}, present_page)
                .end()

                .append('<p></p>')
                .find('p:last')
                .addClass('contents indent-by-one')
                .text('Readers engage')
                .end()

                .append('<h3></h3>')
                .find('h3:last')
                .addClass('contents indent-by-one')
                .text('Topics')
                .click({page_name: 'topics'}, present_page)
                .end()

                .append('<p></p>')
                .find('p:last')
                .addClass('contents indent-by-one')
                .text('Top tags surface')
                .end()

                .append('<h3></h3>')
                .find('h3:last')
                .addClass('contents indent-by-one')
                .text('Frequency')
                .click({page_name: 'frequency'}, present_page)
                .end()

                .append('<p></p>')
                .find('p:last')
                .addClass('contents indent-by-one')
                .text('Content old and new, fast and slow')
                .end()

                .append('<h2></h2>')
                .find('h2:last')
                .text('Postscript')
                .click({page_name: 'postscript'}, present_page)
                .end()

                .append('<h2></h2>')
                .find('h2:last')
                .text('Colophon')
                .click({page_name: 'colophon'}, present_page)
                .end()

                .end();

            content =
                '<p>' +
                '405' +
                '</p><p>' +
                'It might be lonelier</br>' +
                'Without the Loneliness &mdash;</br>' +
                'I’m so accustomed to my Fate &mdash;</br>' +
                'Perhaps the Other &mdash; Peace &mdash;' +
                '</p><p>' +
                'Would interrupt the Dark &mdash;</br>' +
                'And crowd the little Room &mdash;</br>' +
                'Too scant &mdash; by Cubits &mdash; to contain</br>' +
                'The Sacrament &mdash; of Him &mdash;' +
                '</p><p>' +
                'I am not used to Hope &mdash;</br>' +
                'It might intrude upon &mdash;</br>' +
                'It’s sweet parade &mdash; blaspheme the place &mdash;</br>' +
                'Ordained to Suffering &mdash;' +
                '</p><p>' +
                'It might be easier</br>' +
                'To fail &mdash; with Land in Sight &mdash;</br>' +
                'Than gain &mdash; My Blue Peninsula &mdash;</br>' +
                'To perish &mdash; of Delight &mdash;' +
                '</p><p>' +
                '&mdash; Emily Dickinson' +
                '</p>';

            moduleState.jq_containers[page_name].find('div#cc-' + page_name + '-column-right')
                .empty()
                .append(content);

            break;

        case 'preface':
            create_front(moduleState.jq_containers[page_name], page_name);

            content =
                '<h1>PREFACE</h1>' +
                '<p>' +
                '"Tangible fragments of life" -- "oddball collections of ' +
                'trinkets amidst compendia of data" -- "open-ended ' +
                'juxtapositions". All descriptions of assemblages by the ' +
                'American artist Joseph Cornell (1903-1972). With no formal ' +
                'training, and while living with his mother and disabled ' +
                'brother in a small house in Flushing, Queens, he placed ' +
                'everyday objects in shadow boxes, in unexpected and ' +
                'evocative arrangements, creating art simultaneously above ' +
                'movements and styles, and ultimately influencing ' +
                'generations of American artists.' +
                '</p><p>' + 
                'The work of Joseph Cornell is an inspiration to Blue ' +
                'Peninsula as we work, not with the physical objects of ' +
                'everyday, but the virtual objects of the internet, that ' +
                'vast compendium of everyday human expression. Unlike ' +
                'Joseph Cornell, who sought to express a personal statement ' +
                'by his selection and juxtaposition of objects, Blue ' +
                'Peninsula seeks to create a visible storage of online ' +
                'content. Like Stewart Culin, the late "museum magician" of ' +
                'the Brooklyn Museum, we are "preserving the seed of things ' +
                'which may blossom and fruit again". The result is a ' +
                'personal narrative, not molded by a curator, but drawn by ' +
                'the viewer’s experience of the grouping and analyzing the ' +
                'content as a whole.' +
                '</p>';

            moduleState.jq_containers[page_name].find('div#cc-' + page_name + '-column-left')
                .append(content);

            break;

        case 'introduction':
            create_front(moduleState.jq_containers[page_name], page_name);

            content =
                '<h1>INTRODUCTION</h1>' +
                '<p>' +
                'Blue Peninsula collects sources you can trust and displays ' +
                'their web content in beautiful visual collections stored ' +
                'for reading now or later. For each series, we search among ' +
                'the millions of internet sources to analyze thousands and ' +
                'provide you with the best to streamline your finding, ' +
                'selecting, organizing, and reading web content. We ' +
                'identify trusted sources by measuring their volume and ' +
                'frequency of contribution, and the community interaction ' +
                'with their content, then collect the trusted content ' +
                'together by analyzing key factors to create original works ' +
                'that you navigate visually. Our collections are forever so ' +
                'you can read them on your own schedule and not worry about ' +
                'missing something or being left behind. You’ll discover ' +
                'new sources and delight in our surprising storehouses that ' +
                'prove “the whole is other than the sum of its parts.”' +
                '<p>';

            moduleState.jq_containers[page_name].find('div#cc-' + page_name + '-column-left')
                .append(content);

            break;

        case 'volume':
            create_body(moduleState.jq_containers[page_name], page_name);

            content =
                '<p>' +
                'Chart shows all trusted sources collected. Each circle ' +
                'represents one source and the size indicates the amount of ' +
                'content (photos, posts, or tweets) produced. To view a ' +
                'description of the source, hover over a circle, to view a ' +
                'sampling of the content, click.' +
                '</p>';

            moduleState.jq_containers[page_name].find('div#cc-' + page_name + '-title')
                .append(content);

            content =
                '<h3>How much content is produced</h3>' +
                '<p>' +
                'Circles represent each selected source, and are sized ' +
                'according to the amount of content produced: photos, ' +
                'posts, or tweets.' +
                '</p>';

            moduleState.jq_containers[page_name].find('div#cc-' + page_name + '-column-left')
                .append(content);

            break;

        case 'trust':
            create_body(moduleState.jq_containers[page_name], page_name);

            content =
                '<p>' +
                'Chart shows all trusted sources collected. Colors indicate ' +
                'the social media service where the source content was ' +
                'created. Trust is measured as the ratio of the number of ' +
                'members to posts (for Flickr), the number of likes to ' +
                'posts (for Tumblr), or the number of followers to tweets ' +
                '(for Twitter). More saturated, darker, colors indicate ' +
                'more trusted sources.' +
                '</p>';

            moduleState.jq_containers[page_name].find('div#cc-' + page_name + '-title')
                .append(content);

            content =
                '<h3>How trusted is a source</h3>' +
                '<p>' +
                'Colors indicate social media service with More saturated, ' +
                'darker, colors indicating more trusted sources.' +
                '</p>';

            moduleState.jq_containers[page_name].find('div#cc-' + page_name + '-column-left')
                .append(content);

            break;

        case 'topics':
            create_body(moduleState.jq_containers[page_name], page_name);

            content =
                '<p>' +
                'Chart shows the top tags collected from the most trusted ' +
                'sources, divided into topics related to Crisis or Culture.' +
                '</p>';

            moduleState.jq_containers[page_name].find('div#cc-' + page_name + '-title')
                .append(content);

            break;

        case 'frequency':
            create_body(moduleState.jq_containers[page_name], page_name);
            
            content =
                '<p>' +
                'Chart shows the most trusted sources as a function of ' +
                'their frequency of creation and age of the content in ' +
                'days.' +
                '</p>';

            moduleState.jq_containers[page_name].find('div#cc-' + page_name + '-title')
                .append(content);

            break;

        case 'postscript':
            create_back(moduleState.jq_containers[page_name], page_name);

            content =
                '<h1>POSTSCRIPT</h1>' +
                '<p>' +
                'Here is how to take action...' +
                '</p>';

            moduleState.jq_containers[page_name].find('div#cc-' + page_name + '-column-left')
                .append(content);

            break;

        case 'colophon':
            create_back(moduleState.jq_containers[page_name], page_name);

            content =
                '<h1>COLOPHON</h1>' +
                '<p>' +
                'Grid system created using Skeleton</br>' +
                'Graphics rendered using d3.js</br>' +
                'Content collected using Python</br>' +
                'Packaged as a single page web application</br>' +
                'Typefaces by Blu Pen Foundry' +
                '</p><p>' +
                'Graphic Design by Amy LeClair</br>' +
                'Technical Development by Raymond LeClair' +
                '</p><p>' +
                'Published by Blue Peninsula' +
                '</p><p>' +
                'Blue Peninsula</br>' +
                'Boston' +
                '</p><p>' +
                'www.blue-peninsula.com' +
                '</p>';
            
            moduleState.jq_containers[page_name].find('div#cc-' + page_name + '-column-left')
                .append(content);

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
            .append('<h4>Japan &mdash; A Visual Collection</h4>')
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
            .addClass('twelve columns alpha')
            .end()

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-column-right')
            .addClass('four columns omega')
            .end()

            .end() // div.row

            .end(); // div#cc-page-name-body

        // column left navigation

        moduleState.jq_containers[page_name]
            .find('div#cc-' + page_name + '-column-right')
            .addClass('contents')

            .append('<h2></h2>')
            .find('h2:last')
            .text('Contents')
            .click({page_name: 'contents'}, present_page)
            .end()

            .append('<h3></h3>')
            .find('h3:last')
            .text('Preface')
            .click({page_name: 'preface'}, present_page)
            .end()

            .append('<h3></h3>')
            .find('h3:last')
            .text('Introduction')
            .click({page_name: 'introduction'}, present_page)
            .end()

            .append('<h3></h3>')
            .find('h3:last')
            .text('Perspectives')
            .end()

            .append('<h4></h4>')
            .find('h4:last')
            .addClass('contents indent-by-one')
            .text('Volume')
            .click({page_name: 'volume'}, present_page)
            .end()

            .append('<h4></h4>')
            .find('h4:last')
            .addClass('contents indent-by-one')
            .text('Trust')
            .click({page_name: 'trust'}, present_page)
            .end()

            .append('<h4></h4>')
            .find('h4:last')
            .addClass('contents indent-by-one')
            .text('Topics')
            .click({page_name: 'topics'}, present_page)
            .end()

            .append('<h4></h4>')
            .find('h4:last')
            .addClass('contents indent-by-one')
            .text('Frequency')
            .click({page_name: 'frequency'}, present_page)
            .end()

            .append('<h3></h3>')
            .find('h3:last')
            .text('Postscript')
            .click({page_name: 'postscript'}, present_page)
            .end()

            .append('<h3></h3>')
            .find('h3:last')
            .text('Colophon')
            .click({page_name: 'colophon'}, present_page)
            .end()

            .end();

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
            .text('Blue Peninsula')
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
            .append('<h1>Japan</h1>')
            .append('<h2>Explore the Collection</h2>')
            .end()

        // body navigation

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-nav')
            .addClass('row')

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-nav-volume')
            .addClass('one column alpha')
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
            .addClass('one column omega')
            .click({page_name: 'frequency'}, present_page)
            .text('frequency')
            .end()

            .end() // div#cc-page-name-nav

            .append('<div></div>')
            .find('div:last')
            .addClass('row')

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-column-left')
            .addClass('four columns alpha')
            .text(page_name)
            .end()

            .append('<div></div>')
            .find('div:last')
            .attr('id', 'cc-' + page_name + '-column-right')
            .addClass('twelve columns omega')
            .text('column right')
            .end()

            .end() // div.row

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
