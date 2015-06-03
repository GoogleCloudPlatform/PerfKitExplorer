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
goog.require('p3rf.perfkit.explorer.components.widget.query.builder.FieldCubeDataService');
goog.require('p3rf.perfkit.explorer.dateUtil');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryColumnModel');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryDateGroupings');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryFilterModel');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.SamplesMartFields');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.SamplesMartMeasures');
goog.require('goog.Uri');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const dateUtil = explorer.dateUtil;
const Aggregation = explorer.components.query_builder.Aggregation;
const Filter = explorer.components.query_builder.Filter;
const FilterClause = explorer.components.query_builder.FilterClause;
const QueryBuilder = explorer.components.query_builder.QueryBuilder;
const QueryColumnModel = explorer.models.perfkit_simple_builder.QueryColumnModel;
const QueryDateGroupings =
    explorer.models.perfkit_simple_builder.QueryDateGroupings;
const QueryFilterModel = explorer.models.perfkit_simple_builder.QueryFilterModel;
const QueryProperties = explorer.components.query_builder.QueryProperties;
const SamplesMartFields = explorer.models.perfkit_simple_builder.SamplesMartFields;
const SamplesMartMeasures = explorer.models.perfkit_simple_builder.SamplesMartMeasures;
const FieldCubeDataService = (
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
   * @export
   */
  this.autocomplete_data = fieldCubeDataService;

  /**
   * List of available date groupings.
   * @type {!Array.<!string>}
   * @export
   */
  this.date_groupings = QueryDateGroupings;

  /**
   * List of available fields.
   * @type {!Array.<!string>}
   * @export
   */
  this.samples_mart_fields = SamplesMartFields;

  /**
   * List of available measures to use on values.
   * @type {!Array.<!string>}
   * @export
   */
  this.samples_mart_measures = SamplesMartMeasures;

  /**
   * Template URL for the popupbox directive to show picklist values.
   * @type {string}
   * @export
   */
   this.picklist_template_url = '/static/components/widget/query/builder/picklist-template.html';

  /**
   * Cache of picklists.
   *
   * @type {*}
   * @export
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
