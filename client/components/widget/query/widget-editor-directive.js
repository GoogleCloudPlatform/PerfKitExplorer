/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview WidgetEditorDirective encapsulates HTML, style and behavior
 *     for the page footer of Explorer.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.query.WidgetEditorDirective');

goog.require('p3rf.perfkit.explorer.components.code_editor.CodeEditorCtrl');


goog.scope(function() {
var explorer = p3rf.perfkit.explorer;
var CodeEditorCtrl = explorer.components.code_editor.CodeEditorCtrl;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 */
explorer.components.widget.query.WidgetEditorDirective = function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    templateUrl: '/static/components/widget/query/widget-editor-directive.html',
    controllerAs: 'footerCtrl',
    controller: CodeEditorCtrl
  };
};

});  // goog.scope
