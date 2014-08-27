/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview QueryEditorDirective encapsulates HTML, style and behavior
 *     for the left-hand well of Explorer.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.query.QueryEditorDirective');


goog.scope(function() {
var explorer = p3rf.perfkit.explorer;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 */
explorer.components.widget.query.QueryEditorDirective = function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    templateUrl: '/static/components/widget/query/query-editor-directive.html',
    controller: 'QueryEditorCtrl as queryEditorCtrl'
  };
};

});  // goog.scope
