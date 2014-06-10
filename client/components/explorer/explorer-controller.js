/**
 * @fileoverview Controller for the explorer page as a whole.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.dashkit.explorer.components.explorer.ExplorerCtrl');

goog.require('p3rf.dashkit.explorer.components.dashboard.DashboardDataService');
goog.require('p3rf.dashkit.explorer.components.dashboard.DashboardModel');
goog.require('p3rf.dashkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.dashkit.explorer.components.explorer.ExplorerService');


goog.scope(function() {
var explorer = p3rf.dashkit.explorer;
var DashboardModel = explorer.components.dashboard.DashboardModel;
var DashboardDataService = explorer.components.dashboard.DashboardDataService;
var DashboardService = explorer.components.dashboard.DashboardService;
var ExplorerService = explorer.components.explorer.ExplorerService;



/**
 * Root controller for the Explorer page.
 *
 * @param {!angular.Scope} $scope
 * @param {!angular.Location} $location
 * @param {DashboardDataService} dashboardDataService
 * @param {DashboardService} dashboardService
 * @param {ExplorerService} explorerService
 * @constructor
 * @ngInject
 * @export
 */
explorer.components.explorer.ExplorerCtrl = function(
    $scope, $location,
    dashboardDataService, dashboardService, explorerService) {
  /**
   * @type {angular.Location}
   * @private
   */
  this.location_ = $location;

  /**
   * @type {DashboardDataService}
   * @private
   */
  this.dashboardDataService_ = dashboardDataService;

  /**
   * @type {DashboardService}
   * @export
   */
  this.dashboard = dashboardService;

  /**
   * @type {ExplorerService}
   * @export
   */
  this.explorer = explorerService;

  /**
   * Error messages raised by this controller.
   *
   * @type {Array.<string>}
   * @export
   */
  this.errors = [];

  $scope.$watch(
      angular.bind(this, function() {
        return this.dashboard.current.model.owner;
      }),
      angular.bind(this, function(owner) {
        if (!this.explorer.model.readOnly == null) {
          this.explorer.model.readOnly = (
              this.dashboard.current.model.id &&
              owner.email != CURRENT_USER_EMAIL &&
              !CURRENT_USER_ADMIN);
        }
      }));

  $scope.$watch(
      angular.bind(this, function() {
        return this.explorer.model.readOnly;
      }),
      angular.bind(this, function(readOnly) {
        if (readOnly) {
          this.location_.search('readOnly', true);
        } else {
          this.location_.search('readOnly', null);
        }
      }));

  this.initExplorer();
};
var ExplorerCtrl = explorer.components.explorer.ExplorerCtrl;


/**
 * Initializes the explorer.
 */
ExplorerCtrl.prototype.initExplorer = function() {
  this.explorer.listDashboards();
};


});  // goog.scope
