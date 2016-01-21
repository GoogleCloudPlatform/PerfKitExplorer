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
 * @fileoverview QueryResultConfigDirective encapsulates HTML, style and behavior
 *     for the results and shape.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.query.QueryResultConfigDirective');

goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.FieldResult');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.LabelResult');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const FieldResult = explorer.models.perfkit_simple_builder.FieldResult;
const LabelResult = explorer.models.perfkit_simple_builder.LabelResult;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 */
explorer.components.widget.query.QueryResultConfigDirective = function() {
  return {
    restrict: 'E',
    replace: false,
    transclude: false,
    scope: {
      /** @type {!ChartWidgetModel} */
      'ngModel': '='
    },
    templateUrl: '/static/components/widget/query/query-result-config-directive.html'
  };
};

});  // goog.scope
