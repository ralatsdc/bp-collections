/*
 * spa.fake.js
 * Fake module for SPA
 */

/*jslint
  browser: true, continue: true, devel: true, indent: 2, maxerr: 50, newcap: true,
  nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, white: true
*/

/*global
  $, spa
*/

spa.fake = (function () {
    
    'use strict';
    
    var
    peopleList,
    fakeIdSerial,
    makeFakeId,
    mockSio;
    
    fakeIdSerial = 5;
    
    makeFakeId = function () {
        return 'id_' + String(fakeIdSerial++);
    };
    
    peopleList = [
        {name: 'Betty',
         _id: 'id_01',
         css_map: {top: 20,
                   left: 20,
                   'background-color': 'rgb(128, 128, 128)'
                  }
        },
        {name: 'Mike',
         _id: 'id_02',
         css_map: {top: 60,
                   left: 20,
                   'background-color': 'rgb(128, 255, 128)'
                  }
        },
        {name: 'Pebbles',
         _id: 'id_03',
         css_map: {top: 100,
                   left: 20,
                   'background-color': 'rgb(128, 192, 192)'
                  }
        },
        {name: 'Wilma',
         _id: 'id_04',
         css_map: {top: 140,
                   left: 20,
                   'background-color': 'rgb(192, 128, 128)'
                  }
        },
    ];
    
    mockSio = (function () {
        var
        on_sio,
        emit_sio,
        emit_mock_msg,
        send_listchange,
        listchange_idto,
        callback_map = {};
        
        on_sio = function (msg_type, callback) {
            callback_map[msg_type] = callback;
        };
        
        emit_sio = function (msg_type, data) {
            var
            person_map,
            i;

            // Respond to 'adduser' event with 'userupdate' callback
            // after a 3 second delay
            if (msg_type === 'adduser' && callback_map.userupdate) {
                setTimeout(
                    function () {
                        person_map = {
                            _id: makeFakeId(),
                            name: data.name,
                            css_map: data.css_map
                        };
                        peopleList.push(person_map);
                        callback_map.userupdate([person_map]);
                    }, 3000
                );
            }

            // Respond to 'updatechat' event with an 'updatechat'
            // callback after a 2 second delay. Echo back user info.
            if (msg_type === 'updatechat' && callback_map.updatechat) {
                setTimeout(
                    function () {
                        var
                        user = spa.model.people.get_user();
                        callback_map.updatechat([{
                            dest_id: user.id,
                            dest_name: user.name,
                            sender_id: data.dest_it,
                            msg_text: 'Thanks for the note, ' + user.name
                        }]);
                    }, 2000
                );
            }

            if (msg_type === 'leavechat') {
                // Reset login status
                delete callback_map.listchange,
                delete callback_map.updatechat;

                if (listchange_idto) {
                    clearTimeout(listchange_idto);
                    listchange_idto = undefined;
                }
                send_listchange();
            }

            // Simulate send of 'updateavatar' message and data to server
            if (msg_type === 'updateavatar' && callback_map.listchange) {
                
                // Simulate receipt of 'listchange' message
                for (i = 0; i < peopleList.length; i++) {
                    if (peopleList[i]._id === data.person_id) {
                        peopleList[i].css_map = data.css_map;
                        break;
                    }
                }
                
                // Execute callback for the 'listchange' message
                callback_map.listchange([peopleList]);
            }
        };
        
        emit_mock_msg = function () {
            setTimeout(
                function () {
                    var
                    user = spa.model.people.get_user();
                    if (callback_map.updatechat) {
                        callback_map.updatechat([{
                            dest_id: user.id,
                            dest_name: user.name,
                            sender_id: 'id_04',
                            msg_text: 'Hi there ' + user.name + '! Wilma here.'
                        }]);
                    }
                    else {
                        emit_mock_msg();
                    }
                }, 8000
            );
        };

        // Try once per second to use listchange callback. Stop
        // trying after first success.
        send_listchange = function () {
            listchange_idto = setTimeout(
                function () {
                    if (callback_map.listchange) {
                        callback_map.listchange([peopleList]);
                        emit_mock_msg();
                        listchange_idto = undefined;
                    }
                    else {
                        send_listchange();
                    }
                }, 1000
            );
        };
        
        // We have to start this process...
        send_listchange();
        
        return {
            emit: emit_sio,
            on: on_sio
        };
        
    }());
    
    return {
        mockSio: mockSio
    };

}());
