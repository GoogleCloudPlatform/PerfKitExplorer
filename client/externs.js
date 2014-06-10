/**
 * @fileoverview Externs for Closure compiler.
 *
 * This allows us to use Angular and other things that should not be compiled,
 * while avoiding a bunch of warnings about undefined variables.
 *
 * @externs
 * @author joemu@google.com (Joe Allan Muharsky)
 */

angular.$httpBackend = function() {};
angular.$httpBackend.prototype.whenGET = function(a) {};
angular.$httpBackend.prototype.whenPOST = function(a) {};
angular.$httpBackend.prototype.passThrough = function() {};
angular.$httpBackend.prototype.respond = function(a) {};

CodeMirror.prototype.setValue = function(a) {};

function history() {}
history.pushState = function(a, b, c) {};

var CURRENT_USER_ADMIN = null;
var CURRENT_USER_EMAIL = null;
