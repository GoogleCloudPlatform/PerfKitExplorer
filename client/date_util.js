/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Code-behind for utility functions in dealing with dates.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.dashkit.explorer.dateUtil');

goog.require('goog.date.UtcDateTime');
goog.require('goog.string');

goog.scope(function() {


var dateUtil = p3rf.dashkit.explorer.dateUtil;


/**
 * Multiplier used to convert Samples Mart timestamps (UTC seconds) to microsec.
 * @type {number} */
dateUtil.BQ_TIMESTAMP_MULTIPLIER = 1000000;


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
