/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Javascript Query Editor service.  This provides access to the
 * model for defining a Perfkit query via logical parameters (including, but not
 * limited to, filters and column settings).  It can also be used to produce
 * a SQL statement from current settings.
 *
 * An architectural overview of this and other services used to define queries,
 * charts and dashboards can be found at:
 *     http://goto.google.com/perfkit-explorer-architecture
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.widget.query.QueryEditorService');

goog.require('p3rf.perfkit.explorer.components.query_builder.Aggregation');
goog.require('p3rf.perfkit.explorer.components.query_builder.Filter');
goog.require('p3rf.perfkit.explorer.components.query_builder.FilterClause');
goog.require('p3rf.perfkit.explorer.components.query_builder.QueryBuilder');
goog.require('p3rf.perfkit.explorer.components.query_builder.QueryProperties');
goog.require('p3rf.perfkit.explorer.components.widget.query.FieldCubeDataService');
goog.require('p3rf.perfkit.explorer.dateUtil');
goog.require('p3rf.perfkit.explorer.models.dashkit_simple_builder.QueryColumnModel');
goog.require('p3rf.perfkit.explorer.models.dashkit_simple_builder.QueryDateGroupings');
goog.require('p3rf.perfkit.explorer.models.dashkit_simple_builder.QueryFilterModel');
goog.require('goog.Uri');


goog.scope(function() {
var explorer = p3rf.perfkit.explorer;
var dateUtil = explorer.dateUtil;
var Aggregation = explorer.components.query_builder.Aggregation;
var Filter = explorer.components.query_builder.Filter;
var FilterClause = explorer.components.query_builder.FilterClause;
var QueryBuilder = explorer.components.query_builder.QueryBuilder;
var QueryColumnModel = explorer.models.dashkit_simple_builder.QueryColumnModel;
var QueryDateGroupings =
    explorer.models.dashkit_simple_builder.QueryDateGroupings;
var QueryFilterModel = explorer.models.dashkit_simple_builder.QueryFilterModel;
var QueryProperties = explorer.components.query_builder.QueryProperties;
var FieldCubeDataService = (
    explorer.components.widget.query.FieldCubeDataService);



/**
 * Query service.
 *
 * @param {!FieldCubeDataService} fieldCubeDataService
 * @constructor
 * @ngInject
 */
explorer.components.widget.query.QueryEditorService = function(
    fieldCubeDataService) {
  /**
   * Service for providing field autocomplete.
   * @type {!FieldCubeDataService}
   * @expose
   */
  this.autocomplete_data = fieldCubeDataService;

  /**
   * Cache of picklists.
   *
   * @type {*}
   * @expose
   */
  this.picklists = {
    'product_name': [],
    'test': [],
    'metric': [],
    'owner': [],
    'metadata': [],
    'labels': []
  };
};
var QueryEditorService = explorer.components.widget.query.QueryEditorService;


});  // goog.scope
