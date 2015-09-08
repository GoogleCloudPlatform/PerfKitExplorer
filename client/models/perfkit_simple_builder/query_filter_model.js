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
 * @fileoverview Model classes for query filters and constraints.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.models.perfkit_simple_builder.DateFilter');
goog.provide('p3rf.perfkit.explorer.models.perfkit_simple_builder.DateFilterType');
goog.provide('p3rf.perfkit.explorer.models.perfkit_simple_builder.MetadataFilter');
goog.provide('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryFilterModel');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;


/**
 * Describes a label/value pair used in PerfKit sample metadata.
 * @export
 */
p3rf.perfkit.explorer.models.perfkit_simple_builder.MetadataFilter = function() {
  /**
   * label matches the first part of a metadata pair for a PerfKit sample.
   * @type {!string}
   */
  this.label = '';

  /**
   * value matches the second part of a metadata pair for a PerfKit sample.
   * @type {!string}
   */
  this.value = '';

  /**
   * text is a concatenation of label and value with a separator (ex: color:blue)
   *
   * This property should be removed and encapsulated in a MetadataPicker component.
   * @type {!string}
   */
  this.text = '';
};
const MetadataFilter = p3rf.perfkit.explorer.models.perfkit_simple_builder.MetadataFilter;


/**
 * Constants describing the types of filters applied to dates.
 * @enum
 * @export
 */
p3rf.perfkit.explorer.models.perfkit_simple_builder.DateFilterType = {
  CUSTOM: 'CUSTOM',
  YEAR: 'YEAR',
  MONTH: 'MONTH',
  WEEK: 'WEEK',
  DAY: 'DAY',
  HOUR: 'HOUR',
  MINUTE: 'MINUTE',
  SECOND: 'SECOND'
};
const DateFilterType = p3rf.perfkit.explorer.models.perfkit_simple_builder.DateFilterType;



/**
 * Provides a model for describing an absolute or relative time.
 *
 * @param {?string=} opt_filterValue Sets the initial value of filter_value.  Defaults to 'CUSTOM'.
 * @param {?string=} opt_filterType Sets the initial value of filter_type.  Defaults to NULL.
 * @param {?string=} opt_specifyTime Sets the initial value of specify_time.  Defaults to false.
 * @param {?string=} opt_text Sets the initial text of the filter.  Defaults to filter_value, if provided, or ''.
 * @constructor
 */
p3rf.perfkit.explorer.models.perfkit_simple_builder.DateFilter = function(
    opt_filterValue, opt_filterType, opt_specifyTime, opt_text) {

  /**
   * filter_type specifies the type of date constraint.  See DateFilterType for options.  If 'CUSTOM' is specified,
   * then filter_value (and text) will contain an explicit date.  If 'YEAR', 'MONTH', or any other relative date
   * specifier is used, then filter_value will contain the number of (period)s, and text will contain a readable
   * version (ie: last 2 weeks).
   * @type {!DateFilterType}
   */
  this.filter_type = opt_filterType || DateFilterType.CUSTOM;

  /**
   * filter_value contains the user-specified date or range.  If filter_type is 'CUSTOM', then filter_value will be
   * a date string (and a time as well, if specify_time is provided).  If the filter_type is anything else, then
   * filter_value will be the range (ex: # of days).
   * @type {?string}
   */
  this.filter_value = opt_filterValue || null;

  /**
   * specify_time determines whether a time component should be added to the date.  It is only used when filter_type
   * is 'CUSTOM', and if not provided, 00:00 (midnight) will be assumed.
   * @type {!bool}
   */
  this.specify_time = opt_specifyTime || false;

  /**
   * text is the readable string representation of the date.  If filter_type is 'CUSTOM', it will be equivalent to
   * filter_value.  If the filter_type is anything else, it will be 'last (n) (filter_type)s'.
   *
   * This property should be removed and encapsulated within the DatePicker directive.
   * @type {!string}
   */
  this.text = opt_text || opt_filterValue || '';
};
const DateFilter = p3rf.perfkit.explorer.models.perfkit_simple_builder.DateFilter;



/**
 * Provides the filter constraints for a PerfKit samples mart query.  These are used to construct SQL statements
 * dynamically.
 *
 * @constructor
 * @ngInject
 */
p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryFilterModel = (
    function() {
  /**
   * If given, only samples where the timestamp field is greater than or equal
   * to the start date will be returned.
   * @type {p3rf.perfkit.explorer.models.perfkit_simple_builder.DateFilter}
   * @export
   */
  this.start_date = new DateFilter();

  /**
   * If given, only samples where the timestamp field is less than the end date
   * will be returned.
   * @type {?p3rf.perfkit.explorer.models.perfkit_simple_builder.DateFilter}
   * @export
   */
  this.end_date = null;

  /**
   * If given, only samples with the same 'product_name' field value will be
   * returned.
   * @type {?string}
   * @export
   */
  this.product_name = null;

  /**
   * If given, only samples with the same 'test' field value will be returned.
   * @type {?string}
   * @export
   */
  this.test = null;

  /**
   * If given, only samples with the same 'metric' field value will be returned.
   * @type {?string}
   * @export
   */
  this.metric = null;

  /**
   * If given, only samples marked with the sample 'official' field value (true
   * or false) will be returned.
   * @type {?string}
   * @export
   */
  this.official = null;

  /**
   * If given, only samples with a matching 'owner' field will be returned.
   * @type {?string}
   * @export
   */
  this.runby = null;

  /**
   * If given, only samples matching the provided label:value pairs will be
   * returned.
   * @type {Array.<!p3rf.perfkit.explorer.models.perfkit_simple_builder.MetadataFilter>}
   * @export
   */
  this.metadata = [];

  this.initializeDefaults();
});
const QueryFilterModel = (
    p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryFilterModel);


/**
 * Initialize default values.
 */
QueryFilterModel.prototype.initializeDefaults = function() {
  // TODO: Move default settings to a config-backed service.
  this.start_date.filter_type = DateFilterType.WEEK;
  this.start_date.filter_value = 2;
  // TODO: Refactor date picker so that 'text' is not required in the model.
  this.start_date.text = 'last 2 weeks';

  this.official = true;
};

});  // goog.scope
