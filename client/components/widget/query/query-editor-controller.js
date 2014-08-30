/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview QueryEditorController is an angular controller used to edit
 * the datasource's query of the selected widget.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.query.QueryEditorCtrl');

goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerService');
goog.require('p3rf.perfkit.explorer.components.widget.query.QueryEditorService');
goog.require('p3rf.perfkit.explorer.models.DatasourceModel');
goog.require('p3rf.perfkit.explorer.models.ResultsDataStatus');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.DateFilter');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.FieldResult');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.LabelResult');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.MetadataFilter');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryBuilderService');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryFilterModel');

goog.scope(function() {
var explorer = p3rf.perfkit.explorer;
var DashboardService = explorer.components.dashboard.DashboardService;
var DateFilter = explorer.models.perfkit_simple_builder.DateFilter;
var DateGroupings = explorer.models.perfkit_simple_builder.DateGroupings;
var ExplorerService = explorer.components.explorer.ExplorerService;
var DatasourceModel = explorer.models.DatasourceModel;
var FieldResult = explorer.models.perfkit_simple_builder.FieldResult;
var LabelResult = explorer.models.perfkit_simple_builder.LabelResult;
var MetadataFilter = explorer.models.perfkit_simple_builder.MetadataFilter;
var QueryBuilderService =
    explorer.models.perfkit_simple_builder.QueryBuilderService;
var QueryEditorService = explorer.components.widget.query.QueryEditorService;
var QueryFilterModel = explorer.models.perfkit_simple_builder.QueryFilterModel;
var ResultsDataStatus = explorer.models.ResultsDataStatus;



/**
 * See module docstring for more information about purpose and usage.
 *
 * @param {!angular.Scope} $scope
 * @param {!angular.Filter} $filter
 * @param {!ExplorerService} explorerService
 * @param {!DashboardService} dashboardService
 * @param {!QueryEditorService} queryEditorService
 * @param {!QueryBuilderService} queryBuilderService
 * @constructor
 * @ngInject
 */
explorer.components.widget.query.QueryEditorCtrl = function($scope, $filter,
    explorerService, dashboardService, queryEditorService,
    queryBuilderService) {
  /**
   * @type {!angular.Scope}
   * @private
   */
  this.scope_ = $scope;

  /**
   * @type {!angular.Filter}
   * @private
   */
  this.filter_ = $filter;

  /**
   * @type {!QueryEditorService}
   * @export
   */
  this.query = queryEditorService;

  /**
   * @type {!ExplorerService}
   * @export
   */
  this.explorer = explorerService;

  /**
   * @type {Array.<*>}
   * @export
   */
  this.fields = [];

  /**
   * @type {!DashboardService}
   * @export
   */
  this.dashboard = dashboardService;

  /**
   * @type {!QueryBuilderService}
   * @export
   */
  this.queryBuilder = queryBuilderService;

  /**
   * If true, then filter change events will not be triggered.
   * @type {boolean}
   * @export
   */
  this.supressFilterChanges = false;

  /**
   * @type {Array<*>}
   * @export
   */
  this.errors = [];

  /**
   * A shortcut property that returns the datasource of the selected widget.
   * If no widget is selected, this value is set to null.  It is monitored
   * by the $scope.$watch below.
   * @type {?DatasourceModel}
   * @export
   */
  this.datasource = null;

  if (dashboardService.selectedWidget) {
    this.datasource = dashboardService.selectedWidget.model.datasource;
  }

  $scope.$watch(
      angular.bind(this, function() {
        return dashboardService.selectedWidget;
      }),
      angular.bind(this, function() {
        if (dashboardService.selectedWidget) {
          this.datasource = dashboardService.selectedWidget.model.datasource;
          !this.supressFilterChanges && this.changeFilterDate();
        } else {
          this.datasource = null;
        }
      }));

  $scope.$watch(
      angular.bind(this, function() {
        if (this.datasource) {
          return this.datasource.config.filters.start_date.text;
        }
      }),
      angular.bind(this, function(old_val, new_val) {
        if (old_val != new_val) {
          !this.supressFilterChanges && this.changeFilterDate();
        }
      }));

  $scope.$watch(
      angular.bind(this, function() {
        if (this.datasource && this.datasource.config.filters.end_date) {
          return this.datasource.config.filters.end_date.text;
        }
      }),
      angular.bind(this, function(old_val, new_val) {
        if (old_val != new_val) {
          !this.supressFilterChanges && this.changeFilterDate();
        }
      }));

  $scope.$watch(
      angular.bind(this, function() {
        if (this.datasource) {
          return this.datasource.config.filters.product_name;
        }
      }),
      angular.bind(this, function(old_val, new_val) {
        if (old_val != new_val) {
          !this.supressFilterChanges && this.changeProduct();
        }
      }));

  $scope.$watch(
      angular.bind(this, function() {
        if (this.datasource) {
          return this.datasource.config.filters.test;
        }
      }),
      angular.bind(this, function(old_val, new_val) {
        if (old_val != new_val) {
          !this.supressFilterChanges && this.changeTest();
        }
      }));

  $scope.$watch(
      angular.bind(this, function() {
        if (this.datasource) {
          return this.datasource.config.filters.metric;
        }
      }),
      angular.bind(this, function(old_val, new_val) {
        if (old_val != new_val) {
          !this.supressFilterChanges && this.changeMetric();
        }
      }));
};
var QueryEditorCtrl = explorer.components.widget.query.QueryEditorCtrl;


/**
 * Returns true if a string is specified (non-null, unidentifier, empty, etc.),
 * and exactly matches an item in the list.
 * @param {?string} value A string that will be matched in the picklist.
 * @param {!string} picklist_name The name of the picklist that will be searched
 *     for the specified value.
 *
 * @return {bool} True if value was found in the picklist, otherwise false.
 */
QueryEditorCtrl.prototype.isPicklistValueValid = function(
    value, picklist_name) {
  if (goog.string.isEmptySafe(value)) { return false; }
  return (this.query.picklists[picklist_name].indexOf(value) > -1);
};


/**
 * Reacts to a change in the filter start/end dates.
 * This will refresh the list of Products, and trigger a change in the Product
 * (which may result in test, metric and metadata being reloaded).
 */
QueryEditorCtrl.prototype.changeFilterDate = function() {
  if (!this.datasource) { return; }

  this.refreshPicklist('product_name');
  this.changeProduct();
};


/**
 * Reacts to a change in the filter product.
 * This will refresh the list of tests, if a product is selected.  If no
 * product is selected, the test, metric and metadata picklists are cleared.
 */
QueryEditorCtrl.prototype.changeProduct = function() {
  if (!this.datasource) { return; }
  var filter = this.datasource.config.filters['product_name'];

  if (this.isPicklistValueValid(filter, 'product_name')) {
    this.refreshPicklist('test');

    this.changeTest();
  } else {
    this.query.picklists['test'] = [];
    this.query.picklists['metric'] = [];
    this.query.picklists['metadata'] = [];
    this.query.picklists['owner'] = [];
  }
};


/**
 * Reacts to a change in the filter test.
 * This will refresh the list of tests and metadata, if a test is selected.
 * If no test is selected, the metric and metadata picklists are cleared.
 */
QueryEditorCtrl.prototype.changeTest = function() {
  if (!this.datasource) { return; }
  var filter = this.datasource.config.filters['test'];

  if (this.isPicklistValueValid(filter, 'test')) {
    this.refreshPicklist('metric');
    this.refreshPicklist('owner');
    this.refreshMetadata('metadata');
  } else {
    this.query.picklists['metric'] = [];
    this.query.picklists['owner'] = [];
    this.query.picklists['metadata'] = [];
  }
};


/**
 * Reacts to a change in the filter metric.
 * This will refresh the list of metadata, if a test is selected.  If no test
 * is selected, the metadata list will be cleared.
 */
QueryEditorCtrl.prototype.changeMetric = function() {
  if (!this.datasource) { return; }
  var filter = this.datasource.config.filters['metric'];

  if (this.isPicklistValueValid(filter, 'metric')) {
    this.refreshPicklist('owner');
    this.refreshMetadata('metadata');
  } else {
    this.query.picklists['owner'] = [];
    this.query.picklists['metadata'] = [];
  }
};


/**
 * @param {string} picklist
 * @param {string} field
 * @export
 */
QueryEditorCtrl.prototype.refreshPicklist = function(picklist, field) {
  if (!this.datasource) {
    var picklist_items = this.query.picklists[picklist];
    goog.array.clear(picklist_items);
    return;
  }

  if (!field) { field = picklist; }
  var promise = this.query.autocomplete_data.list(
      field, this.datasource.config.filters);

  promise.then(angular.bind(this, function(picklist_data) {
    var picklist_items = this.query.picklists[picklist];
    goog.array.clear(picklist_items);
    goog.array.forEach(picklist_data, function(item) {
      picklist_items.push(item.name) });
  }));

  promise.then(null, angular.bind(this, function(error) {
    console.log(error);
    this.errors.push(error.message);
  }));
};


/**
 * @param {string} picklist
 * @param {string} field
 * @export
 */
QueryEditorCtrl.prototype.refreshMetadata = function(picklist, field) {
  if (!field) { field = picklist; }
  var promise = this.query.autocomplete_data.listMetadata(
      field, this.datasource.config.filters);

  promise.then(angular.bind(this, function(picklist_data) {
    var picklist_items = this.query.picklists[picklist];
    goog.array.clear(picklist_items);
    goog.array.forEach(picklist_data, function(item) {
      picklist_items.push(item) });
  }));

  promise.then(null, angular.bind(this, function(error) {
    console.log(error);
    this.errors.push(error.message);
  }));
};


/**
 * Adds an end date to the filters.
 * @export
 */
QueryEditorCtrl.prototype.addEndDate = function() {
  this.datasource.config.filters.end_date =
      new DateFilter(new Date().toISOString());
};


/**
 * Removes the end date from the filters.
 * @export
 */
QueryEditorCtrl.prototype.removeEndDate = function() {
  this.datasource.config.filters.end_date = null;
};


/**
 * Adds an end date to the filters.
 * @export
 */
QueryEditorCtrl.prototype.addOfficial = function() {
  this.datasource.config.filters.official = true;
};


/**
 * Removes the official flag from the filters.
 * @export
 */
QueryEditorCtrl.prototype.removeOfficial = function() {
  this.datasource.config.filters.official = null;
};


/**
 * Adds a new option to the metadata list.
 * @export
 */
QueryEditorCtrl.prototype.addMetadataFilter = function() {
  this.datasource.config.filters.metadata.push(new MetadataFilter());
};


/**
 * Adds a new option to the field list.
 * @export
 */
QueryEditorCtrl.prototype.addFieldColumn = function() {
  this.datasource.config.results.fields.push(new FieldResult());
};


/**
 * Adds a new option to the measure list.
 * @export
 */
QueryEditorCtrl.prototype.addMeasureColumn = function() {
  this.datasource.config.results.measures.push(new FieldResult());
};


/**
 * Adds a new option to the metadata list.
 * @expose
 */
QueryEditorCtrl.prototype.addMetadataColumn = function() {
  this.datasource.config.results.labels.push(new LabelResult());
};



});  // goog.scope
