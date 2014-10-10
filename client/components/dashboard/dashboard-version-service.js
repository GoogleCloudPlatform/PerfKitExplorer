/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Module for verifying dashboard models and updating them to the
 * latest schema.  The primary purpose right now is assigning version #'s if
 * they do not exist, and updating legacy dashboard models (anything without a
 * version #) to the latest version.
 *
 * Logically speaking, the following operations take place on when
 * DashboardVersionService.verifyAndUpdateModel(DashboardModel) is called by the
 * WidgetFactoryService when loading a dashboard's JSON model:
 *
 *   * Determine the version based on either:
 *     * DashboardModel.version if provided, or
 *     * The newest (first) DashboardVersionModel where .verify(DashboardModel)
 *           returns true;
 *
 *   * If the version is not current (or DashboardModel.version is not
 *           provided):
 *     * Run currentVersion.update(DashboardModel).  Any logic for version-
 *           specific updates can be located in this function.
 *
 * While this will be expanded to a generic schema/upgrade component, this
 * module will initially be the sole repository of all dashboard version info.
 * The current versions (at the bottom of this file as VERSIONS) are:
 *
 * v1   2013-Aug    Initial release of the dashboard explorer.  Supports widgets
 *                  with datasource and chart top-level elements.
 * v2   2014-Feb    Testing release for datasource configs.  Introduces the
 *                  datasource.custom_query and datasource.config elements.
 *                  The datasource.config element supercedes
 *                  datasource.querystring, and will replace it on .update().
 *                  The owner has now been converted from an email/string
 *                  to an object with an email and nickname property.  Existing
 *                  widgets will be set to custom_query=true to avoid accidental
 *                  overwrites of custom logic.
 * v3   2014-May    Add two new fields to datasource.config.results:
 *                  pivot (boolean): If true, the data will be pivoted.
 *                  pivot_config (PivotConfigModel): Describes the column, row and
 *                  value fields for pivot transformation.
 * v4   2014-May    Adds additional fields to datasource.config.results:
 *                  show_date (boolean): If true, the date column will be displayed.
 *                  date_group (string): Modified.  Now supports Hour, Day, Week,
 *                  Month, Year.
 *                  fields (Array.<string>): A list of fields to return.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.dashboard.DashboardVersionService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardModel');
goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV1');
goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV2');
goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV3');
goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV4');
goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV5');

goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardVersionModel');


goog.require('p3rf.perfkit.explorer.models.DatasourceModel');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.QueryConfigModel');
goog.require('p3rf.perfkit.explorer.models.perfkit_simple_builder.PivotConfigModel');

goog.scope(function() {
var explorer = p3rf.perfkit.explorer;
var DashboardModel = explorer.components.dashboard.DashboardModel;
var DashboardVersionModel = explorer.components.dashboard.DashboardVersionModel;
var DatasourceModel = explorer.models.DatasourceModel;
var QueryConfigModel = explorer.models.perfkit_simple_builder.QueryConfigModel;
var PivotConfigModel = explorer.models.perfkit_simple_builder.PivotConfigModel;
var versions = explorer.components.dashboard.versions;



/**
 * See module docstring for a description of this service.
 *
 * @param {!angular.FilterService} $filter
 * @ngInject
 * @constructor
 */
explorer.components.dashboard.DashboardVersionService = function($filter) {
  /**
   * @type {!Array.<!DashboardVersionModel>}
   * @export
   */
  this.versions = this.loadVersions();

  /**
   * @type {?DashboardVersionModel}
   * @export
   */
  this.currentVersion = this.versions[0];

  /**
   * @type {!Angular.FilterService} $filter
   */
  this.filter_ = $filter;
};
var DashboardVersionService =
    explorer.components.dashboard.DashboardVersionService;


/**
 * Verifies the version of a dashboard model, and brings it up to date if necessary.
 * @param {!DashboardModel} dashboard
 * @export
 */
DashboardVersionService.prototype.verifyAndUpdateModel = function(dashboard) {
  var version = this.getDashboardVersion(dashboard);

  // If the version is not current, run the update script to bring the version
  // current.
  if (version == this.currentVersion) {
    if (!goog.isDef(dashboard.version)) {
      dashboard.version = version.version;
    }
  } else {
    var dashboard_version_index = this.versions.indexOf(version);
    var current_version_index = this.versions.indexOf(this.currentVersion);

    for (var i = dashboard_version_index - 1; i >= current_version_index; --i) {
      var update_version = this.versions[i];
      update_version.update(dashboard);
      dashboard.version = update_version.version;
    }
  }
};


/**
 * Initializes the version list.
 */
DashboardVersionService.prototype.initVersions = function() {
  return [
    new versions.DashboardSchemaV5(),
    new versions.DashboardSchemaV4(),
    new versions.DashboardSchemaV3(),
    new versions.DashboardSchemaV2(),
    new versions.DashboardSchemaV1()
  ];
};


/**
 * @param {!DashboardModel} dashboard
 * @return {!DashboardVersionModel}
 * @export
 */
DashboardVersionService.prototype.getDashboardVersion = function(dashboard) {
  var version = null;

  // If a version # if provided, use it to validate.
  if (goog.isDef(dashboard.version) && dashboard.version != '') {
    version = this.filter_('getByProperty')(
        'version', dashboard.version.toString(), this.versions);

    if (version == null) {
      throw new Error('The model specifies v' + dashboard.version + ', which does not exist.');
    } else {
      try {
        if (version.verify(dashboard)) {
          return version;
        } else {
          console.log('The model specifies v' + dashboard.version + ', but is not valid.');
        }
      } catch (err) {
          console.log('The model specifies v' + dashboard.version + ', but is not valid.');
      }
    }
  }
  for (var i = 0, len = this.versions.length; i < len; ++i) {
    version = this.versions[i];
    try {
      if (version.verify(dashboard)) {
        return version;
      }
    } catch (err) {
      // Verification failed.
    }
  }
  throw new Error('The model does not appear to be a valid dashboard.');
};

});  // goog.scope
