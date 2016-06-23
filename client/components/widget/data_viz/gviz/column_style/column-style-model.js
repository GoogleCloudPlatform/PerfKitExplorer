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

goog.provide('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.ColumnStyleModel');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const gviz = explorer.components.widget.data_viz.gviz;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @param {string=} opt_columnId
 * @param {string=} opt_title
 * @param {string=} opt_dataRole
 * @param {string=} opt_seriesColor
 * @param {boolean=} opt_isHtml
 * @export
 */
gviz.column_style.ColumnStyleModel = class {
  constructor(opt_columnId, opt_title, opt_dataRole, opt_seriesColor, opt_isHtml) {
    /**
     * Specifies the column id that the style applies to.
     * @export {string}
     */
    this.column_id = opt_columnId || '';

    /**
     * A string representing a real-world name for the column.
     * @export {string}
     */
    this.title = opt_title || '';

    /**
     * A string representing the gviz role to apply to the column.
     * For more on roles, see:
     *    https://developers.google.com/chart/interactive/docs/roles
     * @export {string}
     */
    this.data_role = opt_dataRole || '';

    /**
     * A string representing the series color.
     * @export {string}
     */
    this.series_color = opt_seriesColor || '';

    /**
     * A boolean indicating whether the column supports HTML content.
     * This is presently applicable to tooltip columns.
     * @export {boolean}
     */
    this.is_html = opt_isHtml || false;
  }
}

});  // goog.scope
