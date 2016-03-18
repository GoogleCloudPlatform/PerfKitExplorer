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
 * @fileoverview Model definition for a dashboard. Dashboards are
 * retrieved in the JSON format from a REST service (see DashboardDataService).
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.dashboard.DashboardInstance');
goog.provide('p3rf.perfkit.explorer.components.dashboard.DashboardModel');
goog.provide('p3rf.perfkit.explorer.components.dashboard.DashboardParam');

goog.require('p3rf.perfkit.explorer.components.container.ContainerWidgetConfig');
goog.require('p3rf.perfkit.explorer.components.container.ContainerWidgetModel');

// TODO(joemu): Factor out Bigquery config into extension model.
goog.require('p3rf.perfkit.explorer.ext.bigquery.BigqueryDatasourceModel');
goog.require('p3rf.perfkit.explorer.ext.bigquery.CurrentTimestampGranularity');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryTablePartitioning');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const ContainerWidgetConfig = explorer.components.container.ContainerWidgetConfig;
const ContainerWidgetModel = explorer.components.container.ContainerWidgetModel;
const BigqueryDatasourceModel = explorer.ext.bigquery.BigqueryDatasourceModel;
const CurrentTimestampGranularity = explorer.ext.bigquery.CurrentTimestampGranularity;
const QueryTablePartitioning = explorer.models.perfkit_simple_builder.QueryTablePartitioning;


/** @constructor */
explorer.components.dashboard.DashboardParam = function(name, value) {
  /**
   * @type {string}
   * @export
   */
  this.name = name;

  /**
   * @type {string}
   * @export
   */
  this.value = value;
};
const DashboardParam = explorer.components.dashboard.DashboardParam;


/** @constructor */
explorer.components.dashboard.DashboardModel = function() {
  /**
   * @type {?string}
   * @export
   */
  this.id = null;

  /**
   * @type {string}
   * @export
   */
  this.title = 'Untitled Dashboard';

  /**
   * @type {string}
   * @export
   */
  this.version = '';

  /**
   * @type {?string}
   * @export
   */
  this.owner = this.getDefaultOwner();

  /**
   * @type {Array.<!string>}
   * @export
   */
  this.writers = [];

  /**
   * @type {?string}
   * @export
   */
  this.type = 'dashboard';

  /**
   * Overrides the default project id that widget queries will connect to.
   * This may be further overridden by widget-level settings.
   * @type {?string}
   * @export
   */
  this.project_id = null;

  /**
   * Overrides the default dataset that widget queries will connect to.  This
   * may be overridden by widget-level settings.
   * @type {?string}
   * @export
   */
  this.dataset_name = null;

  /**
   * Overrides the default table that widget queries will connect to.  This
   * may be overridden by widget-level settings.
   * @type {?string}
   * @export
   */
  this.table_name = null;

  /**
   * Specifies the default type of partitioning used on the table.  This may
   * be overridden by widget-level seeings.  For more information, see the
   * docstring for QueryTablePartitioning.
   * @type {?QueryTablePartitioning}
   * @export
   */
  this.table_partition = QueryTablePartitioning.DEFAULT;

  /**
   * @type {!Array.<(ContainerWidgetConfig|ContainerWidgetModel)>}
   * @export
   */
  this.children = [];

  /**
   * @type {!Array.<!DashboardParam>}
   * @export
   */
  this.params = [];

  /**
   * @type {Object}
   */
  this.config = {
  };

  // TODO: Factor these and other BigQuery-related defaults into a dedicated service.
  this.config['bigQuery'] = new BigqueryDatasourceModel();
  this.config.bigQuery.optimizeCurrentTimestamp.enabled = false;
  this.config.bigQuery.optimizeCurrentTimestamp.granularity = CurrentTimestampGranularity.HOUR;
};
const DashboardModel = explorer.components.dashboard.DashboardModel;


/**
 * Returns the default owner for a dashboard.
 * @return {string} An email address if one exists, otherwise an empty string.
 */
DashboardModel.prototype.getDefaultOwner = function() {
  return goog.global['CURRENT_USER_EMAIL'];
};


/**
 * @constructor
 * @param {(Object|DashboardModel)=} opt_model JSON or WidgetModel.
 */
explorer.components.dashboard.DashboardInstance = function(opt_model) {
  /**
   * The persisted model of the dashboard. It's usually a simple JSON object
   * returned by the server but it respects the DashboardModel class
   * definition.
   *
   * Warning: Do not keep a reference on this property, it can be replaced by
   * an updated JSON at any time. Instead, keep a reference on the
   * DashboardInstance object that contains it.
   *
   * @type {!(Object|DashboardModel)}
   * @export
   */
  this.model = opt_model || new DashboardModel();
};
const DashboardInstance = explorer.components.dashboard.DashboardInstance;

});  // goog.scope
