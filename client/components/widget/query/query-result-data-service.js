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
 * @fileoverview queryResultDataService is an angular service used to fetch and
 * cache samples results from a REST service (/data/samples, backed by the GAE
 * handler p3rf.perfkit.explorer.data). It accepts a QueryConfig
 * object (provided by the QueryEditorService), and maintains a collection of
 * result sets (as google.visualization.DataTable's).
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.query.QueryResultDataService');
goog.provide('p3rf.perfkit.explorer.components.widget.query.DataTableJson');

goog.require('p3rf.perfkit.explorer.components.config.ConfigService');
goog.require('p3rf.perfkit.explorer.components.error.ErrorTypes');
goog.require('p3rf.perfkit.explorer.components.error.ErrorService');
goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerService');
goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerStateService');
goog.require('p3rf.perfkit.explorer.components.util.WorkQueueService');
goog.require('p3rf.perfkit.explorer.models.WidgetConfig');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const ConfigService = explorer.components.config.ConfigService;
const ErrorTypes = explorer.components.error.ErrorTypes;
const ErrorService = explorer.components.error.ErrorService;
const ExplorerService = explorer.components.explorer.ExplorerService;
const ExplorerStateService = explorer.components.explorer.ExplorerStateService;
const WorkQueueService = explorer.components.util.WorkQueueService;
const WidgetConfig = explorer.models.WidgetConfig;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @param {!ExplorerService} explorerService
 * @param {!ExplorerStateService} explorerStateService
 * @param {!ErrorService} errorService
 * @param {!ConfigService} configService
 * @param {!WorkQueueService} workQueueService
 * @param {!angular.$http} $http
 * @param {!angular.$filter} $filter
 * @param {angular.$cacheFactory} $cacheFactory
 * @param {!angular.$q} $q
 * @param {function(new:google.visualization.DataTable, ...)} GvizDataTable
 * @constructor
 * @ngInject
 */
explorer.components.widget.query.QueryResultDataService = function(
    explorerService, explorerStateService, errorService, configService,
    workQueueService, $http, $filter, $cacheFactory, $q, GvizDataTable) {
  /**
   * @type {!angular.$http}
   * @private
   */
  this.http_ = $http;

  /**
   * http://docs.angularjs.org/api/ng.$cacheFactory
   * @type {*}
   * @private
   */
  this.cache_ = $cacheFactory('queryResultDataServiceCache', {capacity: 10});

  /** @private @type {!ExplorerService} */
  this.explorerService_ = explorerService;

  /** @private @type {!angular.$filter} */
  this.filter_ = $filter;

  /**
   * @type {!ErrorService}
   * @private
   */
  this.errorService_ = errorService;

  /**
   * @type {!ExplorerStateService}
   * @private
   */
  this.explorerStateService_ = explorerStateService;

  /**
   * @type {!angular.$q}
   * @private
   */
  this.q_ = $q;

  /**
   * @type {function(new:google.visualization.DataTable, ...)}
   * @private
   */
  this.GvizDataTable_ = GvizDataTable;

  /**
   * @private {!WorkQueueService}
   */
  this.workQueue_ = workQueueService;
  this.workQueue_.setMaxParallelQueries(configService.max_parallel_queries);
};
const QueryResultDataService = (
    explorer.components.widget.query.QueryResultDataService);


/** @typedef {*} */
explorer.components.widget.query.DataTableJson;
const DataTableJson = explorer.components.widget.query.DataTableJson;


/**
 * Returns the indexes of the columns of a given type.
 *
 * @param {DataTableJson} data
 * @param {string|!Array.<string>} type Type(s) of the DataTable column.
 * @return {!Array.<number>}
 * @private
 */
QueryResultDataService.prototype.getColumnIndexesOfType_ = function(
    data, type) {
  let columnIndexes = [];
  angular.forEach(data.cols, function(column, index) {
    if (goog.isArrayLike(type)) {
      let arr = /** @type {Array.<string>} */ (type);
      if (goog.array.contains(arr, column.type)) {
        columnIndexes.push(index);
      }
    } else {
      if (column.type === type) {
        columnIndexes.push(index);
      }
    }
  });
  return columnIndexes;
};


/**
 * Loops over the data and converts string dates to Date objects.
 *
 * @param {DataTableJson} data
 * @private
 */
QueryResultDataService.prototype.parseDates_ = function(data) {
  let columnIndexes = this.getColumnIndexesOfType_(data, ['date', 'datetime']);

  if (columnIndexes.length > 0) {
    angular.forEach(data.rows, function(row) {
      angular.forEach(columnIndexes, function(columnIndex) {
        let dateString = row.c[columnIndex].v;
        let date = new Date(dateString);
        row.c[columnIndex].v = date;
      });
    });
  }
};


/**
 * Adds roles to DataTable columns based on a set of rules.
 *
 * @param {DataTableJson} data
 */
QueryResultDataService.prototype.applyRoles = function(data) {
  let columns = data['cols'];

  for (let i = 0, len = columns.length; i < len; ++i) {
    let column = columns[i];

    // TODO: Tie this logic to a configuration in the underlying data.
    switch (column['id']) {
        case 'tooltip':
          column['role'] = 'tooltip';

          let xprops = column['p'];

          if (!xprops) {
            xprops = {'role': 'tooltip'};
            column['p'] = xprops;
          }

          break;
    }
  }
};


/**
 * Fetches the samples results of a widget, creates a DataTable and caches
 * it.
 *
 * @param {WidgetConfig} widget
 * @return {angular.$q.Promise.<google.visualization.DataTable>}
 */
QueryResultDataService.prototype.fetchResults = function(widget) {
  let datasource = widget.model.datasource;
  let deferred = this.q_.defer();
  let cacheKey = angular.toJson(datasource);
  let cachedDataTable = this.cache_.get(cacheKey);
  let isSelected = widget.state().selected;

  if (cachedDataTable) {
    deferred.resolve(cachedDataTable);
  } else {
    let endpoint = '/data/sql';

    let postData = {
      'dashboard_id': this.explorerStateService_.selectedDashboard.model.id,
      'id': widget.model.id,
      'datasource': datasource};
    let promise = this.workQueue_.enqueue(
        () => this.http_.post(endpoint, postData),
        isSelected);

    promise.then(angular.bind(this, function(response) {
      if (response.data.error) {
        this.errorService_.addError(ErrorTypes.DANGER, response.data.error);
        deferred.reject(response.data);
      } else {
        let rows = response.data.totalRows;
        let size = response.data.totalBytesProcessed;
        let time = response.data.elapsedTime;
        let jobReference = response.data.jobReference;

        if (goog.isDefAndNotNull(jobReference)) {
          widget.state().datasource.job_id = jobReference.jobId;
        }
        widget.state().datasource.row_count = rows;
        widget.state().datasource.query_size = size;
        widget.state().datasource.query_time = time;

        if (this.explorerService_.model.logStatistics) {
          let clauses = [];
          if (goog.isDefAndNotNull(rows)) {
            clauses.push('Returned' + this.filter_('number')(rows, 0) + ' records');
          }
          if (goog.isDefAndNotNull(size)) {
            clauses.push('Processing' + this.filter_('number')(size/1000000, 2) + 'MB');
          }
          if (goog.isDefAndNotNull(time)) {
            clauses.push('In ' + this.filter_('number')(time, 2) + ' sec.');
          }
          let msg = clauses.join(' ');

          this.errorService_.addError(ErrorTypes.INFO, msg);
        }

        let data = response.data.results;
        this.parseDates_(data);

        let dataTable = new this.GvizDataTable_(data);

        this.cache_.put(cacheKey, dataTable);
        deferred.resolve(dataTable);
      }
    }));
    // Error handling
    promise.then(null, angular.bind(this, function(response) {
      this.errorService_.addError(ErrorTypes.DANGER, response.error || response.statusText);

      deferred.reject(response);
    }));
    // Progress notification
    promise.then(null, null, angular.bind(this, function(notification) {
      deferred.notify(notification);
    }));
  }
  return deferred.promise;
};

});  // goog.scope
