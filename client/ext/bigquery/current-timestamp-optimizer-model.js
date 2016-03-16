/* global pad */
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
 *                 DAY                  2016-02-13
 *                 HOUR                 2016-02-13 14:00:00
 *
 * All estimates for days are computed based on UTC time, from the DATE_ROUNDING_UTC_HOUR
 * constant.  A future update will make this a server, dashboard and widget-level setting.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.ext.bigquery.CurrentTimestampGranularity');
goog.provide('p3rf.perfkit.explorer.ext.bigquery.CurrentTimestampOptimizerConfigModel');


goog.scope(function() {
  const bigquery = p3rf.perfkit.explorer.ext.bigquery;

  /**
   * Constants describing the types of granularity supported on timestamps.
   * @enum {string}
   */
  bigquery.CurrentTimestampGranularity = {
    YEAR: 'YEAR',
    MONTH: 'MONTH',
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
});
