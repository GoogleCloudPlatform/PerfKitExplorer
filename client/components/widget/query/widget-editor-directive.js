/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @fileoverview WidgetEditorDirective encapsulates HTML, style and behavior
 *     for the page footer of Explorer.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.query.WidgetEditorDirective');

goog.require('p3rf.perfkit.explorer.components.code_editor.CodeEditorCtrl');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const CodeEditorCtrl = explorer.components.code_editor.CodeEditorCtrl;


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
