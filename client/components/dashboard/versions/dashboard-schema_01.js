goog.provide('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV1');

goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil');


goog.scope(function() {
  var DashboardVersionUtil = p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil;

  p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV1 = function() {
    this.version = '1';
  };
  var DashboardSchema = p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV1;

  DashboardSchema.prototype.verify = function(dashboard) {
    if (!goog.isDef(dashboard.type)) { return false; }

    return true;
  };

  DashboardSchema.prototype.update = function(dashboard) {

  };
});
