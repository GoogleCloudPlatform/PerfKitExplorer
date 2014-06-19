/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Model definition for a BigQuery query against Dashkit samples
 * data.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.dashkit.explorer.models.dashkit_simple_builder.QueryConfigModel');

goog.require('p3rf.dashkit.explorer.models.dashkit_simple_builder.DateFilter');
goog.require('p3rf.dashkit.explorer.models.dashkit_simple_builder.DateFilterType');
goog.require('p3rf.dashkit.explorer.models.dashkit_simple_builder.QueryColumnModel');
goog.require('p3rf.dashkit.explorer.models.dashkit_simple_builder.QueryFilterModel');


goog.scope(function() {

var explorer = p3rf.dashkit.explorer;
var DateFilter = explorer.models.dashkit_simple_builder.DateFilter;
var DateFilterType = explorer.models.dashkit_simple_builder.DateFilterType;
var QueryColumnModel = explorer.models.dashkit_simple_builder.QueryColumnModel;
var QueryFilterModel = explorer.models.dashkit_simple_builder.QueryFilterModel;



/**
 * @constructor
 * @implements {IQueryConfigModel}
 *
 */
explorer.models.dashkit_simple_builder.QueryConfigModel = function() {
  /** @type {number} */
  this.DEFAULT_DATE_RANGE_DAYS = 14;

  /** @type {!QueryFilterModel} */
  this.filters = new QueryFilterModel();

  /** @type {!QueryColumnModel} */
  this.results = new QueryColumnModel();

  this.initializeDefaults();
};
var QueryConfigModel = explorer.models.dashkit_simple_builder.QueryConfigModel;


/**
 * Returns a label/value/text object based on a string value.
 * @param {!string} stringval
 * @return {!MetadataFilter}
 */
QueryConfigModel.getMetadataFilterFromString = function(
    stringval) {
  var SEPARATOR = ':';
  var sepIndex = stringval.indexOf(SEPARATOR);
  var rtnVal = {text: stringval};

  if (sepIndex == -1) {
    rtnVal.label = stringval;
  } else if (sepIndex == 0) {
    throw new Error('Invalid label: Cannot start with a separator.');
  } else {
    rtnVal.label = stringval.slice(0, sepIndex);
    rtnVal.value = stringval.slice(sepIndex + 1);
  }

  return rtnVal;
};


/**
 * Applies a querystring (such as a URL, or v1 filter config) to a QueryConfig.
 *
 * @param {!QueryConfigModel} config The model to apply the querystring to.
 * @param {!string} querystring A filter config in URL form.
 */
QueryConfigModel.applyQueryString = function(config, querystring) {
  var queryData = new goog.Uri.QueryData(querystring);

  var startDateParam = queryData.get('start_date');
  if (startDateParam) {
    config['filters']['start_date'] = new DateFilter(
        startDateParam, 'CUSTOM');
  }

  var endDateParam = queryData.get('end_date');
  if (endDateParam) {
    config['filters']['end_date'] = new DateFilter(
        endDateParam, 'CUSTOM');
  }

  var dateGroup = queryData.get('date_group');
  if (goog.isDef(dateGroup)) { config.results.date_group = dateGroup; }

  var productName = queryData.get('product_name');
  if (goog.isDef(productName)) { config.filters.product_name = productName; }

  var test = queryData.get('test');
  if (goog.isDef(test)) { config.filters.test = test; }

  var metric = queryData.get('metric');
  if (goog.isDef(metric)) { config.filters.metric = metric; }

  var runby = queryData.get('runby');
  if (goog.isDef(runby)) { config.filters.runby = runby; }

  var official = queryData.get('official');
  switch (official) {
    case 'all':
      config.filters.official = null;
      break;
    case 'true':
      config.filters.official = true;
      break;
    case 'false':
      config.filters.official = false;
      break;
  }

  var metadataFilters = queryData.getValues('metadata');
  if (metadataFilters.length > 0) {
    config.filters.metadata.splice(0, config.filters.metadata.length);

    for (var ctr = 0, len = metadataFilters.length; ctr < len; ctr++) {
      config.filters.metadata.push(
          QueryConfigModel.getMetadataFilterFromString(metadataFilters[ctr]));
    }
  }

  var labelColumns = queryData.getValues('labelcol');
  if (labelColumns.length > 0) {
    config.results.labels.splice(0, config.results.labels.length);

    for (var ctr = 0, len = labelColumns.length; ctr < len; ctr++) {
      config.results.labels.push({'label': labelColumns[ctr]});
    }
  }
};


/**
 * Initializes the default values for filters and results.
 */
QueryConfigModel.prototype.initializeDefaults = function() {
  this.filters.start_date.filter_type = DateFilterType.WEEK;
  this.filters.start_date.filter_value = 2;
  // TODO: Refactor date picker so that 'text' is not required in the model.
  this.filters.start_date.text = 'last 2 weeks';

  this.filters.official = null;

  this.results.date_group = 'OneGroup';
};


});  // goog.scope
