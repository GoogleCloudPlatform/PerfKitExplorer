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
 * @fileoverview Code-behind for utility functions in dealing with dates.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.dateUtil');

goog.require('goog.date.UtcDateTime');
goog.require('goog.string');

goog.scope(function() {


var dateUtil = p3rf.perfkit.explorer.dateUtil;


/**
 * Multiplier used to convert Samples Mart timestamps (UTC seconds) to microsec.
 * @type {number} */
dateUtil.BQ_TIMESTAMP_MULTIPLIER = 1000000;


/**
 * First day of week when doing weekly aggregations.  Defaults to 0 (Sunday).
 * @type {number} */
dateUtil.BQ_FIRST_DAY_OF_WEEK = 0;


/**
 * Returns the first second of the day (in UTC seconds since epoch) based on
 * a Date.
 * @param {goog.date.Date} value A Date that will be converted.
 * @return {?number} The first second of the day since the epoch (1970-01-01) in
 *     UTC time.
 */
dateUtil.getUTCSecondsFromDate = function(value) {
  if (value) {
    var utc_date = new goog.date.UtcDateTime(
        value.getFullYear(), value.getMonth(), value.getDate());
    return utc_date.getTime() / 1000;
  } else {
    return null;
  }
};


/**
 * Returns the first second of the day (in UTC seconds since epoch) based on
 * the selected value of a Closure library datepicker.
 * @param {goog.ui.DatePicker} picker A Closure library datepicker to convert
 *     into UTC seconds.
 * @return {?number} The first second of the day since the epoch (1970-01-01) in
 *     UTC time.
 */
dateUtil.getUTCSecondsFromDatePicker = function(picker) {
  return dateUtil.getUTCSecondsFromDate(picker.getDate());
};


/**
 * Returns the last second of the supplied date.  This is used primarily
 * to convert end dates in ranges to accommodate all data that occurred on that
 * date.
 * @param {goog.date.Date} value A Date to convert.
 * @return {?number} The last second of the day since the epoch (1970-01-01) in
 *     UTC time.
 */
dateUtil.getLastUTCSecondFromDate = function(value) {
  if (value) {
    var DAY_SECONDS = 86400;
    var timestamp = (
        dateUtil.getUTCSecondsFromDate(value) +
        DAY_SECONDS - 1);
    return timestamp;
  } else {
    return null;
  }
};


/**
 * Returns the last second of the supplied date.  This is used primarily
 * to convert end dates in ranges to accommodate all data that occurred on that
 * date.
 * @param {goog.ui.DatePicker} picker A Closure library datepicker to convert
 *     into UTC seconds.
 * @return {?number} The last second of the day since the epoch (1970-01-01) in
 *     UTC time.
 */
dateUtil.getLastUTCSecondFromDatePicker = function(picker) {
  if (picker.getDate()) {
    var DAY_SECONDS = 86400;
    var timestamp = (
        dateUtil.getUTCSecondsFromDatePicker(picker) +
        DAY_SECONDS - 1);
    return timestamp;
  } else {
    return null;
  }
};

});  // goog.scope
