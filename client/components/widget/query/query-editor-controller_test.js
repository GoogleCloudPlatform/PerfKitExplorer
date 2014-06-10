/**
 * @fileoverview Tests for the QueryEditor controller.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.dashkit.explorer.application.module');
goog.require('p3rf.dashkit.explorer.components.widget.WidgetFactoryService');
goog.require('p3rf.dashkit.explorer.components.widget.query.QueryEditorCtrl');
goog.require('p3rf.dashkit.explorer.models.ChartWidgetConfig');
goog.require('p3rf.dashkit.explorer.models.ResultsDataStatus');
goog.require('p3rf.dashkit.explorer.models.WidgetConfig');
goog.require('p3rf.dashkit.explorer.models.WidgetType');

goog.scope(function() {

describe('QueryEditorCtrl', function() {
  var explorer = p3rf.dashkit.explorer;
  var ChartWidgetConfig = explorer.models.ChartWidgetConfig;
  var WidgetConfig = explorer.models.WidgetConfig;
  var WidgetType = explorer.models.WidgetType;
  var ResultsDataStatus = explorer.models.ResultsDataStatus;
  var ctrl, scope, rootScope, dashboardService, queryEditorService, mockQuery,
      widgetFactoryService;
  var ctrlPrototype =
      explorer.components.widget.query.QueryEditorCtrl.prototype;


  var mockQuery = 'mock query';

  beforeEach(module('explorer'));
  beforeEach(module('googleVisualizationMocks'));

  beforeEach(inject(function($rootScope, $controller, _dashboardService_,
      _queryEditorService_, _widgetFactoryService_) {
        dashboardService = _dashboardService_;
        queryEditorService = _queryEditorService_;
        rootScope = $rootScope;
        scope = $rootScope.$new();
        widgetFactoryService = _widgetFactoryService_;

        ctrl = $controller(
            explorer.components.widget.query.QueryEditorCtrl,
            {$scope: scope});
      }));

  it('should initialize the appropriate scope objects.', function() {
    expect(ctrl.dashboard).toBeDefined();
    expect(ctrl.dashboard).not.toBeNull();

    expect(ctrl.query).toBeDefined();
    expect(ctrl.query).not.toBeNull();
  });

  describe('datasource', function() {

    it('should reflect the datasource of the selected widget.',
        function() {
          try {
            ctrl.supressFilterChanges = true;
            var boundWidget = new ChartWidgetConfig(widgetFactoryService);
            dashboardService.selectedWidget = boundWidget;
            rootScope.$apply();

            expect(ctrl.datasource).toEqual(boundWidget.model.datasource);
          } finally {
            ctrl.supressFilterChanges = false;
          }
        }
    );

    it('should return null if no widget is selected.',
        function() {
          expect(dashboardService.selectedWidget).toBeNull();
          expect(ctrl.datasource).toBeNull();
        }
    );
  });

});

});  // goog.scope
