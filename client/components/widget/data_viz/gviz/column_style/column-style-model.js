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
 * @fileoverview columnStyleModel is a model encapsulating the properties
 * of a column style.  In practice, it is contained in a heterogenous array.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.ColumnStyleModel');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const gviz = explorer.components.widget.data_viz.gviz;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @export
 */
gviz.column_style.ColumnStyleModel = class {
  constructor(columnId, title, dataRole, seriesColor, dataFormat) {
    /**
     * Specifies the column id that the style applies to.
     * @export {string}
     */
    this.column_id = columnId || '';

    /**
     * A string representing a real-world name for the column.
     * @export {string}
     */
    this.title = title || '';

    /**
     * A string representing the gviz role to apply to the column.
     * For more on roles, see:
     *    https://developers.google.com/chart/interactive/docs/roles
     * @export {string}
     */
    this.data_role = dataRole || '';

    /**
     * A string representing the series color.
     * @export {string}
     */
    this.series_color = seriesColor || '';

    /**
     * A string representing the gviz format to apply to the column.
     * For more on formats, see:
     *    https://developers.google.com/chart/interactive/docs/reference#formatters
     * @export {string}
     */
    this.data_format = dataFormat || '';
  }
}

});  // goog.scope
