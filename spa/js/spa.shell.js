/*
 * spa.shell.js
 * Shell module for SPA
 */

/*jslint
  browser: true, continue: true, devel: true, indent: 2, maxerr: 50, newcap: true,
  nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, white: true
*/

/*global
  $, spa
*/

spa.shell = (function () {
    
    'use strict';

    /* Module scope variables */
    
    var
    configMap = {
        anchor_schema_map: {
            chat: {
                opened: true,
                closed: true},
        },
        main_html: String()
            + '<div class="spa-shell-head">'
            + '  <div class="spa-shell-head-logo">'
            + '    <h1>SPA</h1>'
            + '    <p>JavaScript end to end.</p>'
            + '  </div>'
            + '  <div class="spa-shell-head-acct"></div>'
            + '  <div class="spa-shell-head-search"></div>'
            + '</div>'
            + ' '
            + '<div class="spa-shell-main">'
            + '  <div class="spa-shell-main-nav"></div>'
            + '  <div class="spa-shell-main-content"></div>'
            + '</div>'
            + ' '
            + '<div class="spa-shell-foot"></div>'
            + '<div class="spa-shell-modal"></div>',
        chat_extend_time: 1000,
        chat_retract_time: 300,
        chat_extended_height: 450,
        chat_retracted_height: 15,
        chat_extended_title: 'Click to retract',
        chat_retracted_title: 'Click to extend',
        resize_interval: 200,
    },
    stateMap = {
        $container: undefined,
        anchor_map: {},
        resize_idto: undefined
    },
    jqueryMap = {},
    setJqueryMap,
    copyAnchorMap,
    changeAnchorPart,
    setChatAnchor,
    onHashchange,
    onLogin,
    onLogout,
    onResize,
    onTapAcct,
    initModule;
    
    /* Utility methods */
    
    copyAnchorMap = function () {
        return $.extend(true, {}, stateMap.anchor_map);
    };
    
    /* DOM methods */
    
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $acct: $container.find('.spa-shell-head-acct'),
            $nav: $container.find('.spa-shell-main-nav')
        };
    };
    
    /* changeAnchorPart
     *
     * Purpose: Changes part of the URI anchor component
     *
     * Arguments:
     *   arg_map - The map describing what part of the URI anchor we
     *             want changed
     *
     * Returns: boolean
     *   true - the anchor portion of the URI was updated
     *   false - the anchor portion of the URI was not updated
     *
     * Action:
     *   The current anchor_map is stored in stateMap.anchor_map.
     *   See uriAnchor for a discussion on encoding.
     *   This method:
     *     -- Creates a copy of this map using copyAnchorMap()
     *     -- Modifies the key-value pairs using arg_map
     *     -- Manages the distinction between independent and dependent
     *        values in the encoding
     *     -- Attempts to change the URI using uriAnchor
     *     -- Returns true on success, and false on failure
     */
    changeAnchorPart = function (arg_map) {
        var
        anchor_map_revise = copyAnchorMap(),
        bool_return = true,
        key_name,
        key_name_dep;
        
        // Merge changes into anchor map
        KEYVAL:
        for (key_name in arg_map) {
            if (arg_map.hasOwnProperty(key_name)) {
                
                // Skip dependent keys during iteration
                if (key_name.indexOf('_') === 0) {continue KEYVAL;}
                
                // Update independent key value
                anchor_map_revise[key_name] = arg_map[key_name];
                
                // Update matching dependent key
                key_name_dep = '_' + key_name;
                if (arg_map[key_name_dep]) {
                    anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
                }
                else {
                    delete anchor_map_revise[key_name_dep];
                    delete anchor_map_revise['_s' + key_name_dep];
                }
            }
        }
        
        // Attempt to update URI; revert if not successful
        try {
            $.uriAnchor.setAnchor(anchor_map_revise);
        }
        catch (error) {
            
            // Replace URI with existing state
            $.uriAnchor.setAnchor(stateMap.anchor_map, null, true);
            bool_return = false;
        }
        return bool_return;
    };
    
    /* Event handlers */
    
    /* onHashchange
     *
     * Purpose: Handles the hashchange event
     *
     * Arguments:
     *   event - jQuery event object
     *
     * Action:
     *   -- Parses the URI anchor component
     *   -- Compares proposed application state with existing
     *   -- Adjusts the application state only where proposed differs
     *      from existing and is allowed by anchor schema
     *
     * Returns: false
     */
    onHashchange = function (event) {
        var
        _s_chat_previous,
        _s_chat_proposed,
        s_chat_proposed,
        anchor_map_proposed,
        is_ok = true,
        anchor_map_previous = copyAnchorMap();
        
        // Attempt to parse anchor
        try {
            anchor_map_proposed = $.uriAnchor.makeAnchorMap();
        }
        catch (error) {
            $.uriAnchor.setAnchor(anchor_map_previous, null, true);
            return false;
        }
        stateMap.anchor_map = anchor_map_proposed;
        
        // Adjust chat component if changed
        _s_chat_previous = anchor_map_previous._s_chat;
        _s_chat_proposed = anchor_map_proposed._s_chat;
        if (!anchor_map_previous || _s_chat_previous !== _s_chat_proposed) {
            s_chat_proposed = anchor_map_proposed.chat;
            switch (s_chat_proposed) {
            case 'opened':
                is_ok = spa.chat.setSliderPosition('opened');
                break;
            case 'closed':
                is_ok = spa.chat.setSliderPosition('closed');
                break;
            default:
                spa.chat.setSliderPosition('closed');
                delete anchor_map_proposed.chat;
                $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
            }
        }

        // Revert anchor if slider change denied
        if (!is_ok) {
            if (anchor_map_previous) {
                $.uriAnchor.setAnchor(anchor_map_previous, null, true);
                stateMap.anchor_map = anchor_map_previous;
            } else {
                delete anchor_map_proposed.chat;
                $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
            }
        }
        return false;
    };
    
    /* onLogin
     */
    onLogin = function (event, login_user) {
        jqueryMap.$acct.text(login_user.name);
    };

    /* onLogout
     */
    onLogout = function (even, logout_user) {
        jqueryMap.$acct.text('Please sign-in');
    };

    /* onResize
     */
    onResize = function () {
        // Return if a resize timer is currently running
        if (stateMap.resize_idto) {
            return true;
        }
        spa.chat.handleResize();
        stateMap.resize_idto = setTimeout(
            function () {
                stateMap.resize_idto = undefined;
            },
            configMap.resize_interval);
        return true;
    };

    /* onTapAcct
     */
    onTapAcct = function (event) {
        var
        acct_text,
        user_name,
        user = spa.model.people.get_user();

        if (user.get_is_anon()) {
            user_name = prompt('Please sign-in');
            spa.model.people.login(user_name);
            jqueryMap.$acct.text('...processing...');
        }
        else {
            spa.model.people.logout();
        }
        return false;
    };

    /* Callbacks */

    /* setChatAnchor
     *
     * Purpose: Change the chat component of the anchor
     *
     * Arguments:
     *   position_type - may be 'closed' or 'opened'
     *
     * Action:
     *   Changes the URI anchor parameter 'chat' to the requested
     *   value if possible.
     *
     * Returns:
     *   true - requested anchor part was updated
     *   false - requested anchor part was not updated
     *
     * Throws: none
     *
     * Example: setChatAnchor('closed');
     */
    setChatAnchor = function (position_type) {
        return changeAnchorPart({chat: position_type});
    };

    /* Public methods */
    
    /* initModule
     *
     * Purpose: Directs the shell to offer its capability to the user
     *
     * Arguments:
     *   $container - A JQuery collection that should represent a
     *                single DOM container. Example: $('#app_div_id')
     *
     * Action:
     *   Populates $container with the shell of the UI and then
     *   configures and initialized feature modules. The Shell is also
     *   responsible for browser-wide issues such as URI anchor and
     *   cookie management.
     *
     * Returns: none
     */
    initModule = function ($container) {
        
        // Load HTML and map jQuery collections
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();
        
        // Configure uriAnchor to use our schema
        $.uriAnchor.configModule({
            schema_map: configMap.anchor_schema_map
        });
        
        // Configure and initialize feature modules
        spa.chat.configModule({
            set_chat_anchor: setChatAnchor,
            chat_model: spa.model.chat,
            people_model: spa.model.people
        });
        spa.chat.initModule(jqueryMap.$container);

        spa.avtr.configModule(
            {chat_model: spa.model.chat,
             people_model: spa.model.people
            }
        );
        spa.avtr.initModule(jqueryMap.$nav);

        // Handle URI anchor change events.
        // This is done after all feature modules are configured and
        // initialized otherwise they will not be ready to handle the
        // trigger event, which is used to ensure the anchor is
        // considered on-load.
        $(window)
            .bind('resize', onResize)
            .bind('hashchange', onHashchange)
            .trigger('hashchange');
        
        $.gevent.subscribe($container, 'spa-login', onLogin);
        $.gevent.subscribe($container, 'spa-logout', onLogout);

        jqueryMap.$acct
            .text('Please sign-in')
            .bind('utap', onTapAcct);
    };
    
    return {initModule: initModule};

}());
