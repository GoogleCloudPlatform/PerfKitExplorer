/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview queryResultDataService is an angular service used to fetch and
 * cache samples results from a REST service (/data/samples, backed by the GAE
 * handler p3rf.dashkit.explorer.data). It accepts a QueryConfig
 * object (provided by the QueryEditorService), and maintains a collection of
 * result sets (as google.visualization.DataTable's).
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.dashkit.explorer.components.widget.query.DataTableJson');
goog.provide('p3rf.dashkit.explorer.components.widget.query.QueryResultDataService');


goog.scope(function() {
var explorer = p3rf.dashkit.explorer;



/**
 * See module docstring for more information about purpose and usage.
 *
 * @param {!angular.$http} $http
 * @param {angular.$cacheFactory} $cacheFactory
 * @param {!angular.$q} $q
 * @param {function(new:google.visualization.DataTable, ...)} GvizDataTable
 * @constructor
 * @ngInject
 */
explorer.components.widget.query.QueryResultDataService = function(
    $http, $cacheFactory, $q, GvizDataTable) {
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
};
var QueryResultDataService = (
    explorer.components.widget.query.QueryResultDataService);


/** @typedef {*} */
explorer.components.widget.query.DataTableJson;
var DataTableJson = explorer.components.widget.query.DataTableJson;


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
  var columnIndexes = [];
  angular.forEach(data.cols, function(column, index) {
    if (goog.isArrayLike(type)) {
      var arr = /** @type {Array.<string>} */ (type);
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
  var columnIndexes = this.getColumnIndexesOfType_(data, ['date', 'datetime']);

  if (columnIndexes.length > 0) {
    angular.forEach(data.rows, function(row) {
      angular.forEach(columnIndexes, function(columnIndex) {
        var dateString = row.c[columnIndex].v;
        var date = new Date(dateString);
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
  var columns = data['cols'];

  for (var i = 0, len = columns.length; i < len; ++i) {
    var column = columns[i];

    // TODO: Tie this logic to a configuration in the underlying data.
    switch (column['id']) {
        case 'tooltip':
          column['role'] = 'tooltip';

          var xprops = column['p'];

          if (!xprops) {
            xprops = {'role': 'tooltip'};
            column['p'] = xprops;
          }

          break;
    }
  }
};


/**
 * Fetches the samples results of a datasource, creates a DataTable and caches
 * it.
 *
 * @param {DatasourceModel} datasource
 * @return {angular.$q.Promise.<google.visualization.DataTable>}
 */
QueryResultDataService.prototype.fetchResults = function(datasource) {
  var deferred = this.q_.defer();
  var cacheKey = angular.toJson(datasource);
  var cachedDataTable = this.cache_.get(cacheKey);

  if (cachedDataTable) {
    deferred.resolve(cachedDataTable);
  } else {
    var endpoint = '/data/sql';

    var postData = {'datasource': datasource};
    var promise = this.http_.post(endpoint, postData);

    promise.then(angular.bind(this, function(response) {
      if (response.data.error) {
        deferred.reject(response.data);
      } else {
        var data = response['data']['results'];
        this.parseDates_(data);

        var dataTable = new this.GvizDataTable_(data);

        this.cache_.put(cacheKey, dataTable);
        deferred.resolve(dataTable);
      }
    }));
    // Error handling
    promise.then(null, angular.bind(this, function(response) {
      deferred.reject(response);
    }));
  }
  return deferred.promise;
};

});  // goog.scope
