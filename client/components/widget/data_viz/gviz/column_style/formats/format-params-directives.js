/**
 * @copyright Copyright 2015 Google Inc. All rights reserved.
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
 * @fileoverview ColumnStyleDirective encapsulates HTML, style
 *     and behavior for configuring styles for a single column.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.formats.ArrowFormatParamsDirective');
goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.formats.BarFormatParamsDirective');
goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.formats.DateFormatParamsDirective');
goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.formats.NumberFormatParamsDirective');
goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.formats.PatternFormatParamsDirective');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const gviz = explorer.components.widget.data_viz.gviz;
const formats = gviz.column_style.formats;

const FORMATS_PATH = '/static/components/widget/data_viz/gviz/column_style/formats/';


/**
 * Adds an up or down arrow to a numeric cell, depending on whether the value
 * is above or below a specified base value. If equal to the base value, no
 * arrow is shown.  For more info, see:
 * https://developers.google.com/chart/interactive/docs/reference#arrowformat
 *
 * @return {Object} Directive definition object.
 * @ngInject
 */
formats.ArrowFormatParamsDirective = function() {
  return {
    restrict: 'E',
    scope: {
      /** @type {!ColumnStyleModel} */
      'ngModel': '='
    },
    templateUrl: FORMATS_PATH + 'arrow-format-params-directive.html'
  };
};


/**
 * Adds a colored bar to a numeric cell indicating whether the cell value is
 * above or below a specified base value.  For more info see:
 * https://developers.google.com/chart/interactive/docs/reference#barformat
 *
 * @return {Object} Directive definition object.
 * @ngInject
 */
formats.BarFormatParamsDirective = function() {
  return {
    restrict: 'E',
    scope: {
      /** @type {!ColumnStyleModel} */
      'ngModel': '='
    },
    templateUrl: FORMATS_PATH + 'bar-format-params-directive.html'
  };
};


/**
 * Formats a JavaScript Date value in a variety of ways, including
 * "January 1, 2009," "1/1/09" and "Jan 1, 2009.  For more info, see:
 * https://developers.google.com/chart/interactive/docs/reference#dateformat
 *
 * @return {Object} Directive definition object.
 * @ngInject
 */
formats.DateFormatParamsDirective = function() {
  return {
    restrict: 'E',
    scope: {
      /** @type {!ColumnStyleModel} */
      'ngModel': '='
    },
    templateUrl: FORMATS_PATH + 'date-format-params-directive.html'
  };
};


/**
 * Describes how numeric columns should be formatted.  For more info, see:
 * https://developers.google.com/chart/interactive/docs/reference#numberformat
 *
 * @return {Object} Directive definition object.
 * @ngInject
 */
formats.NumberFormatParamsDirective = function() {
  return {
    restrict: 'E',
    scope: {
      /** @type {!ColumnStyleModel} */
      'ngModel': '='
    },
    templateUrl: FORMATS_PATH + 'number-format-params-directive.html'
  };
};


/**
 * Enables you to merge the values of designated columns into a single column,
 * along with arbitrary text.  For more info, see:
 * https://developers.google.com/chart/interactive/docs/reference#patternformat
 *
 * @return {Object} Directive definition object.
 * @ngInject
 */
formats.PatternFormatParamsDirective = function() {
  return {
    restrict: 'E',
    scope: {
      /** @type {!ColumnStyleModel} */
      'ngModel': '='
    },
    templateUrl: FORMATS_PATH + 'pattern-format-params-directive.html'
  };
};

});  // goog.scope
