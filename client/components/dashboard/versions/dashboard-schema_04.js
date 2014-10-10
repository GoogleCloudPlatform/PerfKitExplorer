goog.provide('p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV4');

goog.require('p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil');


goog.scope(function() {
  var DashboardVersionUtil = p3rf.perfkit.explorer.components.dashboard.version.DashboardVersionUtil;

  p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV4 = function() {
    this.version = 4;
  };
  var DashboardSchema = p3rf.perfkit.explorer.components.dashboard.versions.DashboardSchemaV4;

  DashboardSchema.prototype.verify = function(dashboard) {
    var rtnVal = true;

    DashboardVersionService.UpdateWidget(dashboard, null, function(widget) {
      if (!goog.isDef(widget.datasource.config.results.show_date)) {
        rtnVal = false;
      };
    });

    return rtnVal;
  };

  DashboardSchema.prototype.update = function(dashboard) {
    DashboardVersionService.UpdateWidget(dashboard, null, function(widget) {
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
    });
  };
});
