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
 * @fileoverview columnStyleService is a model encapsulating the properties
 * of a column style.  In practice, it is contained in a heterogenous array.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.ArrowFormatModel');
goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.BarFormatModel');
goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.ColumnStyleFormatModel');
goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.COLUMN_FORMATS');
goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.DateFormatModel');
goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.NumberFormatModel');
goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.PatternFormatModel');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const gviz = explorer.components.widget.data_viz.gviz;


/**
 * Base class for DataFormatModel classes.  May be extended in the future.
 *
 * @export
 */
gviz.column_style.ColumnStyleFormatModel = class {}


/**
 * Adds an up or down arrow to a numeric cell, depending on whether the value
 * is above or below a specified base value
 */
gviz.column_style.ArrowFormatModel = class extends
    gviz.column_style.ColumnStyleFormatModel {
  constructor(base) {
    /**
     * A number indicating the base value.
     * Used to compare against the cell value. If the cell value is higher,
     * the cell will include a green up arrow; if the cell value is lower,
     * it will include a red down arrow; if the same, no arrow.
     * @export {number}
     */
    this.base = 0;

    super();
  }
}


/**
 * Adds a colored bar to a numeric cell indicating whether the cell value is
 * above or below a specified base value.
 */
gviz.column_style.BarFormatModel = class extends
    gviz.column_style.ColumnStyleFormatModel {
  constructor(base) {
    /**
     * A number that is the base value to compare the cell value against.
     * @export {number}
     */
    this.base = 0;

    /**
     * A string indicating the negative value section of bars.
     * @export {?string}
     */
    this.colorNegative = null;

    /**
     * A string indicating the positive value section of bars.
     * @export {?string}
     */
    this.colorPositive = null;

    /**
     * A boolean indicating if to draw a 1 pixel dark base line when
     * negative values are present.
     * @export {boolean}
     */
    this.drawZeroLine = false;

    /**
     * The maximum number value for the bar range.
     * @export {?number}
     */
    this.max = null;

    /**
     * The minimum number value for the bar range.
     * @export {?number}
     */
    this.min = null;

    /**
     * If true, shows values and bars; if false, shows only bars.
     * @export {boolean}
     */
    this.showValue = true;

    /**
     * Thickness of each bar, in pixels.
     * @export ?number
     */
    this.widget = null;

    super();
  }
};


/**
 * Formats a JavaScript Date value in a variety of ways, including
 * "January 1, 2009," "1/1/09" and "Jan 1, 2009.
 */
gviz.column_style.DateFormatModel = class extends
    gviz.column_style.ColumnStyleFormatModel {
  constructor(base) {
    /**
     * A custom format pattern to apply to the value, similar to the
     * ICU date and time format.
     * @export {string}
     */
    this.pattern = '';

    /**
     * The time zone in which to display the date value.
     * @export {?string}
     */
    this.timeZone = '';

    super();
  }
};


/**
 * Describes how numeric columns should be formatted.
 */
gviz.column_style.NumberFormatModel = class extends
    gviz.column_style.ColumnStyleFormatModel {
  constructor(base) {
    /**
     * The format string is a subset of the ICU pattern set
     * For instance, {pattern:'#,###%'} will result in output
     * values "1,000%", "750%", and "50%" for values 10, 7.5,
     * and 0.5.
     * @export {string}
     */
    this.pattern = '';

    /**
     * The text color for negative values. No default value.
     * Values can be any acceptable HTML color value, such as
     * "red" or "#FF0000".
     * @export {?string}
     */
    this.negativeColor = '';

    super();
  }
};


/**
 * Enables you to merge the values of designated columns into a single
 * column, along with arbitrary text.
 */
gviz.column_style.PatternFormatModel = class extends
    gviz.column_style.ColumnStyleFormatModel {
  constructor(base) {
    /**
     * A string that describes which column values to put into the
     * destination column, along with any arbitrary text.
     * @export {string}
     */
    this.pattern = '';

    super();
  }
};


gviz.column_style.COLUMN_FORMATS = [
  {'id': 'ArrowFormat', 'title': 'Arrow',
   'directiveName': 'arrowFormatConfigDirective',
   'modelClass': gviz.column_style.ArrowFormatModel,
   'description': 'Adds an up or down arrow to a numeric cell, depending ' +
                  'on whether the value is above or below a specified base ' +
                  'value'},
  {'id': 'BarFormat', 'title': 'Bar',
   'directiveName': 'barFormatConfigDirective',
   'modelClass': gviz.column_style.BarFormatModel,
   'description': 'Adds a colored bar to a numeric cell indicating whether ' +
                  'the cell value is above or below a specified base value'},
  {'id': 'DateFormat', 'title': 'Date',
   'directiveName': 'dateFormatConfigDirective',
   'modelClass': gviz.column_style.DateFormatModel,
   'description': 'Formats a JavaScript Date value in a variety of ways, ' +
                  'including "January 1, 2009," "1/1/09" and "Jan 1, 2009'},
  {'id': 'NumberFormat', 'title': 'Number',
   'directiveName': 'numberFormatConfigDirective',
   'modelClass': gviz.column_style.NumberFormatModel,
   'description': 'Describes how numeric columns should be formatted'},
  {'id': 'PatternFormat', 'title': 'Pattern',
   'directiveName': 'patternFormatConfigDirective',
   'modelClass': gviz.column_style.PatternFormatModel,
   'description': 'Enables you to merge the values of designated columns ' +
                  'into a single column, along with arbitrary text'},
];



});  // goog.scope
