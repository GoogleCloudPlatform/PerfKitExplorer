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
  
  // Number of hours after midnight in UTC to which dates should be rounded.
  // For example, set this to 8 if day-granularity dates should be rounded to the
  // most recent 08:00:00 in UTC. This is currently a constant, in the
  // future it's planned to be replaced with a server-supplied offset.
  const DATE_ROUNDING_UTC_HOUR = 0;
  
  // Constant for the number of milliseconds in a day.
  const MS_PER_DAY = 86400*1000;

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
     * Boundaries for DAY, MONTH and YEAR are based on the local timezone.
     *
     * @param {!Date} date
     * @param {!CurrentTimestampGranularity} granularity
     */
    getRoundedDate(date, granularity) {
      let originalTimeMs = date.getTime();
      let result = new Date(originalTimeMs);

      switch (granularity) {
        case CurrentTimestampGranularity.HOUR:
          result.setUTCMinutes(0, 0, 0);
          break;
        case CurrentTimestampGranularity.DAY:
          result.setUTCHours(DATE_ROUNDING_UTC_HOUR, 0, 0, 0);
          break;
        case CurrentTimestampGranularity.MONTH:
          result.setUTCHours(DATE_ROUNDING_UTC_HOUR, 0, 0, 0);
          result.setUTCDate(1);
          break;
        case CurrentTimestampGranularity.YEAR:
          result.setUTCHours(DATE_ROUNDING_UTC_HOUR, 0, 0, 0);
          result.setUTCDate(1);
          result.setUTCMonth(0);
          break;
      }

      // If this puts us in the future, subtract a day.
      if (result.getTime() > originalTimeMs) {
        result = new Date(result.getTime() - MS_PER_DAY);
      }

      return result;
    }

    /**
     * Applies the optimization to the current widget, modifying any CURRENT_TIMESTAMP() instances
     * in .query_exec.
     *
     * @param {!DashboardModel} dashboard The active dashboard.
     * @param {!WidgetModel} widget The widget to apply query optimizations against.
     */
    apply(dashboard, widget) {
      if (this.canApply(dashboard, widget)) {
        let query = widget.datasource.query_exec;
        let granularity = this.getEffectiveGranularity(dashboard, widget);
        let currentDate = this.getCurrentDate();
        let effectiveDate = this.getRoundedDate(currentDate, granularity);

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
