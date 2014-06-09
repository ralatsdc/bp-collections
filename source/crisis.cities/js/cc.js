/*
 * cc.js
 */

/*jslint
  browser: true, continue: true, devel: true, indent: 2, maxerr: 50, newcap: true,
  nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, white: true
*/

/*global
  $, cc
*/

var cc = (function () {

    'use strict';

    var
    initModule;

    initModule = function ($3container) {
        cc.shell.initModule($3container);
    };

    return {initModule: initModule};

}());
