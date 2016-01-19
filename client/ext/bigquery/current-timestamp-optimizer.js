/**
 * @copyright Copyright 2016 Google Inc. All rights reserved.
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
 * @fileoverview The CurrentTimestampOptimizer replaces the non-cacheable
 *    CURRENT_TIMESTAMP() in queries with a fixed datetime based on the specified
 *     granularity.
 * 
 * Granularity is used to provide an estimate of the current date/time, rounded to the nearest
 * previous 'x'.  An example of this can be seen below:
 *     original    CURRENT_TIMESTAMP()  2016-02-13 14:43:26
 *     granularity YEAR                 2016-01-01
 *                 MONTH                2016-02-01
 *                 WEEK                 2016-02-06 (Saturday of previous week)
 *                 DAY                  2016-02-13
 *                 HOUR                 2016-02-13 14:00:00
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.ext.bigquery.CurrentTimestampGranularity');
goog.provide('p3rf.perfkit.explorer.ext.bigquery.CurrentTimestampOptimizer');
goog.provide('p3rf.perfkit.explorer.ext.bigquery.CurrentTimestampOptimizerConfigModel');


goog.scope(function() {
  const bigquery = p3rf.perfkit.explorer.ext.bigquery;

  /**
   * Constants describing the types of granularity supported on timestamps.
   * @enum
   */
  bigquery.CurrentTimestampGranularity = {
    YEAR: 'YEAR',
    MONTH: 'MONTH',
    WEEK: 'WEEK',
    DAY: 'DAY',
    HOUR: 'HOUR'
  };
  const CurrentTimestampGranularity = bigquery.CurrentTimestampGranularity;

  /**
   * Describes the properties for configuring a CurrentTimestampOptimizer.
   *
   * @constructor
   */
  bigquery.CurrentTimestampOptimizerConfigModel = class {
    constructor(enabled=null, granularity=null) {
      /**
       * If true, the optimizer is enabled.  If false, it will not be applied.
       *
       * @export {?boolean}
       */
      this.enabled = enabled;

      /**
       * Defines the granularity of the optimizer.  See the module docstring for more.
       * 
       * @export {CurrentTimestampGranularity}
       */
      this.granularity = granularity;
    }
  }

  /**
   * See the module docstring for a description of this optimizer.
   *
   * @constructor
   */
  bigquery.CurrentTimestampOptimizer = class {
    constructor() {
      
    }
    
    /**
     * Returns true if the optimizer should be applied to the widget, otherwise false.
     *
     * @param {!DashboardModel} dashboard The active dashboard.
     * @param {!WidgetModel} widget The widget to apply query optimizations against.
     * @return {boolean} True if the optimizer should be applied to the current widget,
     *     otherwise false.
     */
    canApply(dashboard, widget) {
      if (goog.isDefAndNotNull(widget.datasource.config.bigQuery.optimizeCurrentTimestamp.enabled)) {
        return widget.datasource.config.bigQuery.optimizeCurrentTimestamp.enabled;
      }
      
      return dashboard.config.bigQuery.optimizeCurrentTimestamp.enabled;
    }

    /**
     * Returns the effective granularity for a widget on a dashboard.  See the class docstring
     * for more information on how granularity affects date calculation.
     *
     * If the widget .enabled setting is true and the widget's .granularity is specified, then
     * the widget's .granularity is used.  Otherwise, the dashboard's .granularity is used.
     * 
     * @param {!DashboardModel} dashboard The active dashboard.
     * @param {!WidgetModel} widget The widget to apply query optimizations against.
     * @return {!CurrentTimestampGranularity} The granularity to apply to the widget's
     *     CURRENT_TIMESTAMP() functions.
     */
    getEffectiveGranularity(dashboard, widget) {
      let widgetSetting = widget.datasource.config.bigQuery.optimizeCurrentTimestamp;
      let dashboardSetting = dashboard.config.bigQuery.optimizeCurrentTimestamp;

      if (goog.isDefAndNotNull(widgetSetting.granularity)) {
        return widgetSetting.granularity;
      } else {
        return dashboardSetting.granularity;
      }
    }

    /**
     * Returns the current date.  Used for mocking purposes.
     *
     * @return {!Date}
     */
    getCurrentDate() {
      return new Date();
    }

    /**
     * Returns the rounded date based on the provided granularity.
     *
     * @param {!CurrentTimestampGranularity} granularity
     */
    getRoundedDate(granularity) {
      let ranks = {YEAR: 0, MONTH: 1, DAY: 2, HOUR: 3};
      let rank = ranks[granularity];
      goog.asserts.assert(goog.isDefAndNotNull(rank));

      let current = this.getCurrentDate();

      let result = new Date(
        current.getFullYear(),
        rank >= ranks.MONTH ? current.getMonth() : 0,
        rank >= ranks.DAY ? current.getDate() : 1,
        rank >= ranks.HOUR ? current.getHours() : 0);

      return result;
    }

    /**
     * Applies the optimization to the current widget, modifying any CURRENT_TIMESTAMP() instances
     * in .query_exec.
     *
     * @param {!DashboardModel} dashboard The active dashboard.
     * @param {!WidgetModel} widget The widget to apply query optimizations against.
     * @param {boolean} force If true, applies the optimization even if canApply returns false.
     */
    apply(dashboard, widget, force=false) {
      if (force || this.canApply(dashboard, widget)) {
        let query = widget.datasource.query_exec;
        let granularity = this.getEffectiveGranularity(dashboard, widget);
        let effectiveDate = this.getRoundedDate(granularity);

        widget.datasource.query_exec = this.replaceCurrentTimestamp(query, effectiveDate);
      }
    }

    /**
     * Replaces the any instances of CURRENT_TIMESTAMP() with a fixed TIMESTAMP expression and
     * returns the result.
     * 
     * @param {string} query The query string that will be evaluated.
     * @param {Date} effectiveDate The datetime that will be used in place of CURRENT_TIMESTAMP().
     */
    replaceCurrentTimestamp(query, effectiveDate) {
      let regex = /\bCURRENT_TIMESTAMP\s*\(\s*\)/gi
      let effectiveDateString = 'TIMESTAMP(\'' + effectiveDate.toISOString() + '\')';
      return query.replace(regex, effectiveDateString);
    }
  }
});
