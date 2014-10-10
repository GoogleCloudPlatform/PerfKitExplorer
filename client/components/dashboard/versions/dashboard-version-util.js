goog.provide('p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil');

goog.scope(function() {
  p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil = function() {
  };
  var DashboardVersionUtil = p3rf.perfkit.explorer.components.dashboard.versions.DashboardVersionUtil;

  DashboardVersionUtil.UpdateContainer = function(dashboard, updateFn) {
    angular.forEach(dashboard.children, function(container) {
      updateFn(container);
    });
  };


  DashboardVersionUtil.UpdateWidget = function(dashboard, updateContainerFn, updateWidgetFn) {
    angular.forEach(dashboard.children, function(containerConfig) {
      updateContainerFn && !updateContainerFn(containerConfig.container);

      if (updateWidgetFn) {
        angular.forEach(containerConfig.container.children, function(widget) {
          updateWidgetFn(widget);
        });
      }
    });
  };


  DashboardVersionUtil.VerifyDashboard = function(dashboard, verifyContainerFn, verifyWidgetFn) {
    var container, widget = null;

    for (var i = 0, containerCount = dashboard.children.length; i < containerCount; ++i) {
      container = dashboard.children[i].container;

      if (verifyContainerFn && !verifyContainerFn(container)) {
        return false;
      }

      if (verifyWidgetFn) {
        for (var j = 0, widgetCount = container.children.length; j < widgetCount; ++j) {
          widget = container.children[i];

          if (!verifyWidgetFn(widget)) {
            return false;
          }
        }
      }
    }

    return true;
  };
});
