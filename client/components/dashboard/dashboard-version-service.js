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
  this.versions = VERSIONS;

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
      throw new Error(
          'The model specifies v' + dashboard.version +
          ', which does not exist.');
    } else {
      try {
        if (version.verify(dashboard)) {
          return version;
        } else {
          console.log(
              'The model specifies v' + dashboard.version +
              ', but is not valid.');
        }
      } catch (err) {
          console.log(
              'The model specifies v' + dashboard.version +
              ', but is not valid.');
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


/**
 * Static list of version info and verification/update scripts.  See
 * DashboardVersionModel for a detailed description of version structure, or
 * this module docstring for an explanation of how they're implemented.
 *
 * @type {Array.<!DashboardVersionModel>}
 */
var VERSIONS = [
  {'version': '4',
    'verify': function(dashboard) {
      var rtnVal = true;

      var containerCtr = 0;
      while (containerCtr < dashboard.children.length) {
        var container = dashboard.children[containerCtr];

        var widgetCtr = 0;
        while (widgetCtr < container.container.children.length) {
          var widget = container.container.children[widgetCtr];

          if (!goog.isDef(widget.datasource.config.results.show_date)) {
            rtnVal = false;
            break;
          }
          widgetCtr++;
        }
        containerCtr++;
      }

      return rtnVal;
    },
    'update': function(dashboard) {
      // Apply updates to each widget.
      var containerCtr = 0;
      while (containerCtr < dashboard.children.length) {
        var container = dashboard.children[containerCtr];

        var widgetCtr = 0;
        while (widgetCtr < container.container.children.length) {
          var widget = container.container.children[widgetCtr];
          if (!goog.isDef(widget.datasource.config.results.show_date)) {
            var oldGrouping = widget.datasource.config.results.date_group;
            widget.datasource.config.results.show_date = false;
            widget.datasource.config.results.date_group = '';

            switch (oldGrouping) {
              case 'Daily':
                widget.datasource.config.results.show_date = true;
                widget.datasource.config.results.date_group = 'DAY';
                break;
              case 'Weekly':
                widget.datasource.config.results.show_date = true;
                widget.datasource.config.results.date_group = 'WEEK';
                break;
            }
          }

          if (!goog.isDef(widget.datasource.config.results.fields)) {
            widget.datasource.config.results.fields = [];
          }

          if (!goog.isDef(widget.datasource.config.results.measures)) {
            widget.datasource.config.results.measures = [];
          }

          widgetCtr++;
        }
        containerCtr++;
      }
    }
  },
  {'version': '3',
    'verify': function(dashboard) {
      var rtnVal = true;

      var containerCtr = 0;
      while (containerCtr < dashboard.children.length) {
        var container = dashboard.children[containerCtr];

        var widgetCtr = 0;
        while (widgetCtr < container.container.children.length) {
          var widget = container.container.children[widgetCtr];

          if (!goog.isDef(widget.datasource.config.results.pivot_config)) {
            rtnVal = false;
            break;
          }
          widgetCtr++;
        }
        containerCtr++;
      }

      return rtnVal;
    },
    'update': function(dashboard) {
      // Apply updates to each widget.
      var containerCtr = 0;
      while (containerCtr < dashboard.children.length) {
        var container = dashboard.children[containerCtr];

        var widgetCtr = 0;
        while (widgetCtr < container.container.children.length) {
          var widget = container.container.children[widgetCtr];
          if (!goog.isDef(widget.datasource.config.results.pivot_config)) {
            widget.datasource.config.results.pivot = false;
            widget.datasource.config.results.pivot_config = new PivotConfigModel();
          }

          widgetCtr++;
        }
        containerCtr++;
      }
    }},
  {'version': '2',
    'verify': function(dashboard) {
      var rtnVal = true;

      var containerCtr = 0;
      while (containerCtr < dashboard.children.length) {
        var container = dashboard.children[containerCtr];

        var widgetCtr = 0;
        while (widgetCtr < container.container.children.length) {
          var widget = container.container.children[widgetCtr];

          if (!goog.isDef(widget.datasource.config) ||
              !goog.isDef(widget.datasource.custom_query)) {
            rtnVal = false;
            break;
          }
          widgetCtr++;
        }
        containerCtr++;
      }

      return rtnVal;
    },
    'update': function(dashboard) {
      // Apply updates to each widget.
      var containerCtr = 0;
      while (containerCtr < dashboard.children.length) {
        var container = dashboard.children[containerCtr];

        var widgetCtr = 0;
        while (widgetCtr < container.container.children.length) {
          var widget = container.container.children[widgetCtr];
          if (!goog.isDef(widget.datasource.custom_query)) {
            widget.datasource.custom_query = !goog.string.isEmptySafe(
                widget.datasource.query);
          }

          if (!widget.datasource.config) {
            widget.datasource.config = new QueryConfigModel();
          }

          // If a querystring is present, apply it to the config object.
          if (widget.datasource.querystring) {
            QueryConfigModel.applyQueryString(
                widget.datasource.config,
                widget.datasource.querystring);
            delete widget.datasource.querystring;
          }

          widgetCtr++;
        }
        containerCtr++;
      }
    }},
  {'version': '1',
    'verify': function(dashboard) {
      var rtnVal = true;

      if (!goog.isDef(dashboard.type)) { return false; }

      return rtnVal;
    }}
];

});  // goog.scope
