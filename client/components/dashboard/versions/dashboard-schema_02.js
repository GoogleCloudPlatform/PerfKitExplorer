goog.provide('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV2');

goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil');


goog.scope(function() {
  var DashboardVersionUtil = p3rf.perfkit.explorer.components.dashboard.version.DashboardVersionUtil;

  p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV1 = function() {
    this.version = 2;
  };
  var DashboardSchema = p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV2;

  DashboardSchema.prototype.verify = function(dashboard) {
    var rtnVal = true;

    DashboardVersionService.UpdateWidget(dashboard, null, function(widget) {
      if (!goog.isDef(widget.datasource.config) ||
          !goog.isDef(widget.datasource.custom_query)) {
        rtnVal = false;
      }
    });

    return rtnVal;
  };

  DashboardSchema.prototype.update = function(dashboard) {
    // Apply updates to each widget.
    DashboardVersionService.UpdateWidget(dashboard, null, function(widget) {
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
    });
  };
});
