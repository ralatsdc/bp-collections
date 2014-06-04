/*
 * spa.model.js
 * Model module for SPA
 */

/*jslint
  browser: true, continue: true, devel: true, indent: 2, maxerr: 50, newcap: true,
  nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, white: true
*/

/*global
  TAFFY, $, spa
*/

spa.model = (function () {
    
    'use strict';
    
    var
    configMap = {
        anon_id: 'a0'
    },
    stateMap = {
        anon_user: null,
        cid_serial: 0,
        people_cid_map: {},
        people_db: TAFFY(),
        is_connected: false,
        user: null
    },
    isFakeData = true,
    personProto,
    makeCid,
    clearPeopleDb,
    completeLogin,
    makePerson,
    removePerson,
    chat,
    people,
    initModule;
    
    /*
     * People object API
     *
     * Provides methods and events to manage a collection of person
     * objects.
     *
     * Public methods include:
     *
     *   get_user() - returns the current user person object. If the
     *     current user is not signed-in, returns an anonymous person
     *     object
     *
     *   get_by_cid(<client_id>) - returns a person object
     *     corresponding to the specified identifier
     *
     *   get_db() - returns the TaffyDB database of all person
     *     objects, including the current user person object,
     *     pre-sorted
     *
     *   login(<user_name>) - logs in as the user corresponding to
     *     the specified user name. The current user person object is
     *     updated
     *
     *   logout() - updates the current user person object to the
     *     anonymous person object
     *
     * jQuery global custom events include:
     *
     *   'spa-login' - published when a user login process
     *     completes. The updated user person object is provided as
     *     data.
     *   
     *   'spa-logout' - published when a user logout process
     *     completes. The former user person object is provided as
     *     data.
     *
     * Person object API
     *
     * Provides methods for representing a person.
     *
     * Methods include:
     *
     *   get_is_user() - returns true if the object represents the
     *     current user
     *
     *   get_is_anon() - returns true if the object represent the
     *     anonymous user
     *
     * Attributes include:
     *
     *   cid - string client side id. Always defined. Only different
     *     from id attribute if the object is not synchronized with
     *     the back end
     *
     *   id - string server side id. May be undefined if the object
     *     is not synchronized with the back end
     *
     *   name - string user name
     *
     *   css_map - an attribute map used for avatar presentation
     */
    personProto = {
        get_is_user: function () {
            return this.cid === stateMap.user_cid;
        },
        get_is_anon: function () {
            return this.cid === stateMap.anon_user.cid;
        }
    };
    
    makeCid = function () {
        return 'c' + String(stateMap.cid_serial++);
    };
    
    clearPeopleDb = function () {
        var
        user = stateMap.user;
        stateMap.people_db = TAFFY();
        stateMap.people_cid_map = {};
        if (user) {
            stateMap.people_db.insert(user);
            stateMap.people_cid_map[user.cid] = user;
        }
    };
    
    completeLogin = function (user_list) {
        var
        user_map = user_list[0];

        delete stateMap.people_cid_map[user_map.cid];
        stateMap.user.cid = user_map._id;
        stateMap.user.id = user_map._id;
        stateMap.user.css_map = user_map.css_map;
        stateMap.people_cid_map[user_map._id] = stateMap.user;
        chat.join();

        $.gevent.publish('spa-login', [stateMap.user]);
    };
    
    makePerson = function (person_map) {
        var
        person,
        cid = person_map.cid,
        css_map = person_map.css_map,
        id = person_map.id,
        name = person_map.name;
        
        if (cid === undefined || ! name) {
            throw 'client id and name required';
        }
        
        person = Object.create(personProto);
        
        person.cid = cid;
        person.css_map = css_map;
        person.id = id;
        person.name = name;
        
        if (id) {
            person.id = id;
        }
        
        stateMap.people_cid_map[cid] = person;
        stateMap.people_db.insert(person);
        
        return person;
    };
    
    removePerson = function (person) {
        if (!person) {
            return false;
        }
        // Can't remove anonymous person
        if (person.id === configMap.anon_id) {
            return false;
        }
        stateMap.people_db({cid: person.cid}).remove();
        if (person.cid) {
            delete stateMap.people_cid_map[person.cid];
        }
        return true;
    };
    
    people = (function () {
        var
        get_by_cid,
        get_db,
        get_user,
        login,
        logout;
        
        get_user = function () {
            return stateMap.user;
        };
        
        get_by_cid = function (cid) {
            return stateMap.people_cid_map[cid];
        };
        
        get_db = function () {
            return stateMap.people_db;
        };
        
        login = function (name) {
            var
            sio = isFakeData ? spa.fake.mockSio : spa.data.getSio();
            
            stateMap.user = makePerson({
                cid: makeCid(),
                css_map: {top: 25, left: 25, 'background-color': '#8f8'},
                name: name
            });
            
            sio.on('userupdate', completeLogin);
            
            sio.emit('adduser', {
                cid: stateMap.user.cid,
                css_map: stateMap.user.css_map,
                name: stateMap.user.name
            });
        };
        
        logout = function () {
            var
            user = stateMap.user;

            chat._leave();
            stateMap.user = stateMap.anon_user;
            clearPeopleDb();
            
            $.gevent.publish('spa-logout', [user]);
            
            return is_removed;
        };
        
        return {
            get_user: get_user,
            get_by_cid: get_by_cid,
            get_db: get_db,
            login: login,
            logout: logout
        };
        
    }());
    
    /*
     * Chat object API
     *
     * Provides methods and events to manage chat messaging.
     *
     * Public methods include:
     *
     *   join() - joins the chat room. This routine sets up the chat
     *     protocol with the backend including publishers for
     *     'spa-listchange' and 'spa-updatechat' global custom
     *     events. If the current user is anonymous, join() aborts and
     *     returns false.
     *
     *   get_chatee() - returns the person object with whom the user is
     *     chatting. If there is no chatee, returns null.
     *
     *   set_chatee(<person_id>) - set the chatee to the person
     *     identified by person_id. If the person_id does not exit in
     *     the people list, the chatee is set to null. If the person
     *     requested is already the chatee, returns false. Publishes a
     *     'spa-setchatee' global custom event.
     *
     *   send_msg(<msg_text>) - sends a message to the
     *     chatee. Publishes a 'spa-updatechat' global custom
     *     event. If the user is anonymous or the chatee is null,
     *     aborts and returns false.
     *
     *   update_avatar(<update_avtr_map>) - sends the update_avtr_map
     *     to the backend. This results in a 'spa-listchange' event
     *     which publishes the updated people list and avatar
     *     information (the css_map in the person objects). The
     *     update_avtr_map must have the form:
     *       {person_id: person_id,
     *        css_map: css_map}.
     *
     * jQuery global custom events published by the object include:
     *
     *   spa-setchatee - published when a new chatee is set. A map of
     *     the form:
     *       {old_chatee: <old_chatee_person_object>,
     *        new_chatee: <new_chatee_person_object>}
     *     is provided as data.
     *
     *   spa-listchange - published when the list of online people
     *     changes in length (i.e. when a person joins or leaves
     *     a chat) or when their contents change (i.e. when a person's
     *     avatar details change). A subscriber to this event should get
     *     the people_db from the people model for the updated data.
     *
     *   spa-updatechat - published when a new message is received or
     *     sent. A map of the form:
     *       {dest_id: <chatee_id>,
     *        dest_name: <chatee_name>,
     *        sender_id: <sender_id>,
     *        msg_text: <message_content>}
     *     is provided as data.
     */
    chat = (function () {
        var
        _publish_listchange,
        _publish_updatechat,
        _update_list,
        _leave_chat,
        get_chatee,
        join_chat,
        send_msg,
        set_chatee,
        update_avatar,
        chatee = null;
        
        _update_list = function (arg_list) {
            var
            i,
            person_map,
            make_person_map,
            person,
            people_list = arg_list[0],
            is_chatee_online = false;
            
            clearPeopleDb();
            
            PERSON:
            for (i = 0; i < people_list.length; i++) {
                person_map = people_list[i];
                
                if (!person_map.name) {
                    continue PERSON;
                }
                
                // If user defined, update css_map and skip remainder
                if (stateMap.user && stateMap.user.id === person_map._id) {
                    stateMap.user.css_map = person_map.css_map;
                    continue PERSON;
                }
                
                make_person_map = {
                    cid: person_map._id,
                    css_map: person_map.css_map,
                    id: person_map._id,
                    name: person_map.name
                };
                person = makePerson(make_person_map);

                if (chatee && chatee.id === make_person_map.id) {
                    is_chatee_online = true;
                    chatee = person;
                }
            }
            stateMap.people_db.sort('name');

            // If chatee is not longer online, we unset the chatee
            // which triggers the 'spa-setchatee' global event
            if (chatee && !is_chatee_online) {
                set_chatee('');
            }
        };
        
        _publish_listchange = function (arg_list) {
            _update_list(arg_list);
            $.gevent.publish('spa-listchange', [arg_list]);
        };
        
        _publish_updatechat = function (arg_list) {
            var
            msg_map = arg_list[0];

            if (!chatee) {
                set_chatee(msg_map.sender_id);
            }
            else if (msg_map.sender_id !== stateMap.user.id
                     && msg_map.sender_id !== chatee.id) {
                set_chatee(msg_map.sender_id);
            }
            $.gevent.publish('spa-updatechat', [msg_map]);
        };

        _leave_chat = function () {
            var
            sio = isFakeData ? spa.fake.mockSio : spa.data.getSio();
            
            chatee = null;
            stateMap.is_connected = false;
            
            if (sio) {
                sio.emit('leavechat');
            }
        };
        
        get_chatee = function () {
            return chatee;
        };

        join_chat = function () {
            var
            sio;
            
            if (stateMap.is_connected) {
                return false;
            }
            
            if (stateMap.user.get_is_anon()) {
                console.warn('User must be defined before joining chat');
                return false;
            }
            
            sio = isFakeData ? spa.fake.mockSio : spa.data.getSio();
            sio.on('listchange', _publish_listchange);
            sio.on('updatechat', _publish_updatechat);
            stateMap.is_connected = true;

            return true;
        };
        
        send_msg = function (msg_text) {
            var
            msg_map,
            sio = isFakeData ? spa.fake.mockSio : spa.data.getSio();

            if (!sio) {
                return false;
            }
            
            if (!(stateMap.user && chatee)) {
                return false;
            }

            msg_map = {
                dest_id: chatee.id,
                dest_name: chatee.name,
                sender_id: stateMap.user.id,
                msg_text: msg_text
            };
            
            // We published updatechat so we can show our outgoing
            // messages
            _publish_updatechat([msg_map]);
            sio.emit('updatechat', msg_map);
            
            return true;
        };

        set_chatee = function (person_id) {
            var
            new_chatee;

            new_chatee = stateMap.people_cid_map[person_id];

            if (new_chatee) {
                if (chatee && chatee.id === new_chatee.id) {
                    return false;
                }
            }
            else {
                new_chatee = null;
            }

            $.gevent.publish('spa-setchatee', {old_chatee: chatee,
                                               new_chatee: new_chatee});
            chatee = new_chatee;

            return true;
        };
                
        /*
         * avatar_update_map should have the form:
         * {person_id: <string>,
         *  css_map: {top: <int>,
         *            left: <int>,
         *            'background-color': <string>
         *           }
         * }
         */
        update_avatar = function (avatar_update_map) {
            var
            sio = isFakeData ? spa.fake.mockSio : spa.data.getSio();
            if (sio) {
                sio.emit('updateavatar', avatar_update_map);
            }
        };

        return {
            _leave: _leave_chat,
            get_chatee: get_chatee,
            join: join_chat,
            send_msg: send_msg,
            set_chatee: set_chatee,
            update_avatar: update_avatar
        };

    }());
    
    initModule = function () {

        // Initialize anonymous person
        stateMap.anon_user = makePerson({
            cid: configMap.anon_id,
            id: configMap.anon_id,
            name: 'anonymous'
        });
        stateMap.user = stateMap.anon_user;
    };
    
    return {
        initModule: initModule,
        people: people,
        chat: chat
    };
    
}());
