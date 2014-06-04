/*
 * spa.util.js
 * Utility module for SPA
 *
 * MIT License
 */

/*jslint
  browser: true, continue: true, devel: true, indent: 2, maxerr: 50, newcap: true,
  nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, white: true
*/

/*global
  $, spa
*/

spa.util = (function () {
    
    'use strict';

    /* Module scope variables */
    
    var
    makeError,
    setConfigMap;
    
    /* Public methods */

    /* makeError
     *
     * Purpose: Provide a convenience wrapper for creating an error object
     *
     * Arguments:
     *   name_text - the error name
     *   msg_text - the long error message
     *   data - optional data attached to the error object
     *
     * Returns: a newly constructed error object
     *
     * Throws: none
     */
    makeError = function (name_text, msg_text, data) {
        var error = new Error();
        error.name = name_text;
        error.message = msg_text;
        if (data) {
            error.data = data;
        }
        return error;
    };

    /* setConfigMap
     *
     * Purpose: Provides common code for setting configuration in feature modules.
     *
     * Arguments:
     *   input_map - source map of configuration key-value pairs
     *   settable_map - map of allowable configuration keys
     *   config_map = destination map of configuration key-value pairs
     *
     * Returns: true
     *
     * Throws: Exception if input key is not allowed
     */
    setConfigMap = function (arg_map) {
        var
        input_map = arg_map.input_map,
        settable_map = arg_map.settable_map,
        config_map = arg_map.config_map,
        key_name,
        error;

        for (key_name in input_map) {
            if (input_map.hasOwnProperty(key_name)) {
                if (settable_map.hasOwnProperty(key_name)) {
                    config_map[key_name] = input_map[key_name];
                }
                else {
                    error = makeError('Bad input',
                                      'Setting config key "'
                                      + key_name
                                      + '" is not supported');
                    throw error;
                }
            }
        }
    };

    return {
        makeError: makeError,
        setConfigMap: setConfigMap
    };

}());
