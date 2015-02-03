/**
 * bp.tumblr.js
 */

/* global bp */

bp.tumblr = (function () {
    
    'use strict';
    
    var
    initModule,
    configModule;
    
    var
    module_Config = {
        settable: {
        }
    },
    module_State = {
        jq_section: {},
        jq_page: {}
    },
    createNews;
    
    configModule = function (input_config) {
        bp.util.setConfig(input_config, module_Config);
        return true;
    };
    
    initModule = function () {
    };
    
    createNews = function (event) {
        
        var
        page_name = event.data.page_name,
        section_name = event.data.section_name,
        jq_page =
            bp.shell.getJqContainers()[page_name],
        jq_section =
            bp.shell.getJqContainers()[page_name + '-' + section_name]
            .addClass('row bp-shell-content');

        module_State.jq_page = jq_page;
        module_State.jq_section = jq_section;

        var posts = bp.model.getPosts();
        if (posts === null) {
            bp.model.initModule(createNews,
                                {page_name: page_name, section_name: section_name});
            return;
        }
        for (var i_post = 0; i_post < posts.length; i_post += 1) {
            var post = posts[i_post];

            switch (post.type) {
            case 'text':
                /*
                 * Response Field  Type    Description
                 * title           String  The optional title of the post
                 * body            String  The full post body
                 */
                break;
                
            case 'photo':
                /*
                 * Response Field  Type    Description
                 * photos          Array   Photo objects with properties:
                 *                           caption - string: user supplied caption for the individual photo
                 *                             (Photosets only)
                 *                           alt_sizes - array: alternate photo sizes, each with:
                 *                             width - number: width of the photo, in pixels
                 *                             height - number: height of the photo, in pixels
                 *                             url - string: Location of the photo file (either a JPG, GIF, or PNG)
                 * caption         String  The user-supplied caption
                 * width           Number  The width of the photo or photoset
                 * height          Number  The height of the photo or photoset
                 */
                var
                content = '<h3 class="comfortaabold">' + post.date + '</h3>',
                photos = post.photos;
                for (var i_photo = 0; i_photo < photos.length; i_photo += 1) {
                    var
                    photo = photos[i_photo],
                    url = photo.alt_sizes[1].url;
                    content += '<img src="' + url + '">';
                }
                content += post.caption;
                jq_section
                    .append('<div></div>')
                    .find('div:last')
                    .addClass('eight columns offset-by-four')
                    .html(content)
                    .end();

                break;
                
            case 'quote':
                /*
                 * Response Field  Type    Description                                   Notes
                 * text            String  The text of the quote
                 *                           (can be modified by the user when posting)
                 * source          String  Full HTML for the source of the quote         See also the table
                 *                           Example: <a href="...">Steve Jobs</a>       of common response fields
                 */
                break;
                
            case 'link':
                /*
                 * Response Field  Type    Description
                 * title           String  The title of the page the link points to
                 * url             String  The link
                 * description     String  A user-supplied description
                 */
                break;
                
            case 'chat':
                /*
                 * Response Field  Type    Description
                 * title           String  The optional title of the post
                 * body            String  The full chat body
                 * dialogue        Array   Array of objects with the following properties:
                 *                           name - string: name of the speaker
                 *                           label - string: label of the speaker
                 *                           phrase - string: text
                 */
                break;
                
            case 'audio':
                /*
                 * Response Field  Type    Description
                 * caption         String  The user-supplied caption
                 * player          String  HTML for embedding the audio player
                 * plays           Number  Number of times the audio post has been played
                 * album_art       String  Location of the audio file's ID3 album art image
                 * artist          String  The audio file's ID3 artist value
                 * album           String  The audio file's ID3 album value
                 * track_name      String  The audio file's ID3 title value
                 * track_number    Number  The audio file's ID3 track value
                 * year            Number  The audio file's ID3 year value
                 */
                break;
                
            case 'video':
                /*
                 * Response Field  Type                    Description                      Notes
                 * caption         String                  The user-supplied caption   
                 * player          Array of embed objects  Object fields within the array:  Values vary by video source
                 *                                           width - number: width of
                 *                                             video player, in pixels
                 *                                           embed_code - string: HTML for
                 *                                             embedding the video player
                 */
                break;
                
            case 'answer':
                /*
                 * Response Field  Type    Description
                 * asking_name     String  The blog name of the user asking the question
                 * asking_url      String  The blog URL of the user asking the question
                 * question        String  The question being asked
                 * answer          String  The answer given
                 */
                break;
                
            default:
            }
        }
        bp.shell.createFooter(jq_page);
    };
    
    return {
        configModule: configModule,
        initModule: initModule,
        createNews: createNews
    };
    
}());
