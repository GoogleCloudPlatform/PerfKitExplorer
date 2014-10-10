goog.provide('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV3');

goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil');


goog.scope(function() {
  var DashboardVersionUtil = p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil;

  p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV3 = function() {
    this.version = '3';
  };
  var DashboardSchema = p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV3;

  DashboardSchema.prototype.verify = function(dashboard) {
    return DashboardVersionUtil.VerifyDashboard(dashboard, null, function(widget) {
      if (!goog.isDef(widget.datasource.config.results.pivot_config)) {
        return false;
      };

      return true;
    });
  };

  DashboardSchema.prototype.update = function(dashboard) {
    DashboardVersionUtil.UpdateWidget(dashboard, null, function(widget) {
      if (!goog.isDef(widget.datasource.config.results.pivot_config)) {
        widget.datasource.config.results.pivot = false;
        widget.datasource.config.results.pivot_config = new PivotConfigModel();
      }
    });
  };
});
