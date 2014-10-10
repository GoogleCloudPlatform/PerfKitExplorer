goog.provide('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV3');

goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil');


goog.scope(function() {
  var DashboardVersionUtil = p3rf.perfkit.explorer.components.dashboard.version.DashboardVersionUtil;

  p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV3 = function() {
    this.version = 3;
  };
  var DashboardSchema = p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV3;

  DashboardSchema.prototype.verify = function(dashboard) {
    var rtnVal = true;

    DashboardVersionService.UpdateWidget(dashboard, null, function(widget) {
      if (!goog.isDef(widget.datasource.config.results.pivot_config)) {
        rtnVal = false;
      };
    });

    return rtnVal;
  };

  DashboardSchema.prototype.update = function(dashboard) {
    DashboardVersionService.UpdateWidget(dashboard, null, function(widget) {
      if (!goog.isDef(widget.datasource.config.results.pivot_config)) {
        widget.datasource.config.results.pivot = false;
        widget.datasource.config.results.pivot_config = new PivotConfigModel();
      }
    });
  };
});
