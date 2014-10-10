goog.provide('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV5');

goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil');


goog.scope(function() {
  var DashboardVersionUtil = p3rf.perfkit.explorer.components.dashboard.version.DashboardVersionUtil;

  p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV4 = function() {
    this.version = 5;
  };
  var DashboardSchema = p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV5;

  DashboardSchema.prototype.verify = function(dashboard) {
    var rtnVal = goog.isDef(dashboard.contributors);

    return rtnVal;
  };

  DashboardSchema.prototype.update = function(dashboard) {
    if (!goog.isDef(dashboard.contributors)) {
      dashboard.contributors = [];
    }
  };
});
