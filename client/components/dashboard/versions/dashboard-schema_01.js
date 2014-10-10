goog.provide('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV1');

goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil');


goog.scope(function() {
  var DashboardVersionUtil = p3rf.perfkit.explorer.components.dashboard.version.DashboardVersionUtil;

  p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV1 = function() {
    this.version = 1;
  };
  var DashboardSchema = p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV1;

  DashboardSchema.prototype.verify = function(dashboard) {
    var rtnVal = true;

    if (!goog.isDef(dashboard.type)) { return false; }

    return rtnVal;
  };

  DashboardSchema.prototype.update = function(dashboard) {

  };
});
