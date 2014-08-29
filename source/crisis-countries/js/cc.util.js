/**
 * Provides module utilities.
 */
/* global cc */
cc.util = (function () {
    
    'use strict';
    
    /* == Public variables == */

    var
    makeError,
    setConfig;
    
    /* == Public functions == */

    /**
     * Makes an error object.
     *
     * @param name_text {string} the error name
     * @param msg_text {string} the error message
     * @param data {Object} data to assign to the error object
     *
     * @return {Object} the error object
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
    
    /**
     * Sets configuration parameters, if permitted.
     *
     * @param {Object} input_config configuration key value pairs to
     *     set, if permitted
     * @param {Object} output_config configuration key value pairs
     *
     * @return {undefined}
     */
    setConfig = function (input_config, output_config) {
        var key_name, error;
        for (key_name in input_config) {
            if (input_config.hasOwnProperty(key_name)) {
                if (output_config.settable.hasOwnProperty(key_name) &&
                    output_config.settable.key_name) {
                    output_config[key_name] = input_config[key_name];
                }
                else {
                    error = makeError('Bad input',
                                      'Setting config key "' + key_name + '" is not supported');
                    throw error;
                }
            }
        }
    };
    
    return {
        makeError: makeError,
        setConfig: setConfig
    };
    
}());
