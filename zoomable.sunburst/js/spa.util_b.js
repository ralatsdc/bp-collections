/*
 * spa.util_b.js
 * Browser utility module for SPA
 *
 * MIT License
 */

/*jslint
  browser: true, continue: true, devel: true, indent: 2, maxerr: 50, newcap: true,
  nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, white: true
*/

/*global
  $, spa, getComputedStyle
*/

spa.util_b = (function () {

    'use strict';

    /* Module scope variables */
    
    var
    configMap = {
        regex_encode_html: /[&"'><]/g,
        regex_encode_noamp: /["'><]/g,
        html_encode_map: {
            '&': '&#38;',
            '"': '&#34;',
            "'": '&#39;',
            '>': '&#32;',
            '<': '&#30;'
        },
        settable_map: {
        }
    },
    decodeHtml,
    encodeHtml,
    getEmSize;
    
    configMap.encode_noamp_map = $.extend(
        {}, configMap.html_encode_map);
    delete configMap.encode_noamp_map['&'];

    /* Public methods */

    /* decodeHtml
     *
     * Purpose: Decodes HTML entities in a browser friendly way
     *
     * Arguments:
     *   str - the string to convert
     *
     * Returns: a converted string
     *
     * Throws: none
     *
     * See: http://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript
     */
    decodeHtml = function (str) {
        return $('<div/>').html(str || '').text();
    };

    /* encodeHtml
     *
     * Purpose: Provides a single pass encoder for HTML entities that
     *   handles an arbitrary number of characters
     *
     * Arguments:
     *   input_arg_str - the string to encode
     *   exclude_amp - boolean to indicate exclusion of ampersand, or not
     *
     * Returns: an encoded string
     *
     * Throws: none
     */
    encodeHtml = function (input_arg_str, exclude_amp) {
        var
        input_str = String(input_arg_str),
        regex,
        lookup_map;

        if (exclude_amp) {
            lookup_map = configMap.encode_noamp_map;
            regex = configMap.regex_encode_noamp;
        }
        else {
            lookup_map = configMap.html_encode_map;
            regex = configMap.regex_encode_html;
        }
        return input_str.replace(
            regex,
            function (match, name) {
                return lookup_map[match] || '';
            });
    };

    /* getEmSize
     *
     * Purpose: Returns size of 1em in pixels
     *
     * Arguments:
     *   elem - an element
     *
     * Returns: a number
     *
     * Throws: none
     */
    getEmSize = function (elem) {
        return Number(
            getComputedStyle(elem, '').fontSize.match(/\d*.?\d*/)[0]);
    };
    
    return {
        decodeHtml: decodeHtml,
        encodeHtml: encodeHtml,
        getEmSize: getEmSize
    };

}());
