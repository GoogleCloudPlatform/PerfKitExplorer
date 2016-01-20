/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @fileoverview Tests for the dashboardService service.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.components.config.ConfigService');
goog.require('p3rf.perfkit.explorer.components.container.ContainerWidgetConfig');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardParam');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.widget.WidgetFactoryService');
goog.require('p3rf.perfkit.explorer.models.ChartWidgetConfig');
goog.require('p3rf.perfkit.explorer.models.ResultsDataStatus');
goog.require('p3rf.perfkit.explorer.models.WidgetConfig');
goog.require('p3rf.perfkit.explorer.models.WidgetType');
goog.require('p3rf.perfkit.explorer.components.widget.query.builder.QueryBuilderService');


describe('dashboardService', function() {
  const explorer = p3rf.perfkit.explorer;
  const DashboardParam = explorer.components.dashboard.DashboardParam;
  const WidgetConfig = explorer.models.WidgetConfig;
  const WidgetType = explorer.models.WidgetType;
  const ChartWidgetConfig = explorer.models.ChartWidgetConfig;
  const ContainerWidgetConfig =
      explorer.components.container.ContainerWidgetConfig;
  const QueryBuilderService =
      explorer.components.widget.query.builder.QueryBuilderService;
  const ResultsDataStatus = explorer.models.ResultsDataStatus;

  var svc, widget, container;
  var configService, containerService, explorerService, explorerStateService,
      widgetFactoryService, sidebarTabService;
  var $location, $timeout;

  beforeEach(module('explorer'));

  beforeEach(inject(function(dashboardService,
                             _explorerService_,
                             _queryBuilderService_,
                             _configService_,
                             _containerService_,
                             _explorerStateService_,
                             _sidebarTabService_,
                             _widgetFactoryService_,
                             _$location_,
                             _$timeout_,
                             _$rootScope_,
                             _$state_) {
    svc = dashboardService;
    configService = _configService_;
    containerService = _containerService_;
    explorerService = _explorerService_;
    explorerStateService = _explorerStateService_;
    sidebarTabService = _sidebarTabService_;
    queryBuilderService = _queryBuilderService_;
    widgetFactoryService = _widgetFactoryService_;
    $location = _$location_;
    $timeout = _$timeout_;
    $rootScope = _$rootScope_;
    $state = _$state_;
  }));

  // Common injection when a dashboard is present.
  describe('', function() {

    beforeEach(inject(function() {
      explorerService.newDashboard();
      $rootScope.$apply();

      container = svc.containers[0];
      widget = container.model.container.children[0];

      explorerStateService.containers.all[container.model.id] = container;
      explorerStateService.widgets.all[widget.model.id] = widget;

      explorerStateService.selectWidget(
          container.model.id, widget.model.id);
    }));

    describe('selectWidget', function() {

      beforeEach(inject(function() {
        explorerStateService.containers.all[container.model.id] = container;
        explorerStateService.widgets.all[widget.model.id] = widget;

        explorerStateService.selectWidget(
            container.model.id, widget.model.id);
      }));

      it('should update the selectedWidget.', function() {
        svc.selectWidget(widget, container);
        $rootScope.$apply();

        expect(svc.selectedWidget).toBe(widget);
      });

      it('should select the widget\'s container.', function() {
        svc.selectWidget(widget, container);
        $rootScope.$apply();

        expect(svc.selectedContainer).toBe(container);
      });

      it('should update the widget state to selected.', function() {
        svc.unselectWidget();
        $rootScope.$apply();

        expect(widget.state().selected).toBeFalsy();

        svc.selectWidget(widget, container);
        $rootScope.$apply();

        expect(widget.state().selected).toBeTruthy();
      });

      it('should update the previous widget state to unselected.', function() {
        svc.selectWidget(widget, container);
        $rootScope.$apply();

        // Deselect it
        svc.selectWidget(null);
        $rootScope.$apply();

        expect(widget.state().selected).toBeFalsy();
      });

      it('should select the first widget tab if no tab is selected',
          function() {
        sidebarTabService.selectedTab = null;

        svc.selectWidget(widget, container);
        $rootScope.$apply();

        expect(sidebarTabService.selectedTab).toBe(sidebarTabService.tabs[2]);
        expect(sidebarTabService.selectedTab.requireWidget).toBeTrue();
      });

      it('should select the first widget tab if a non-widget tab is selected',
          function() {
        sidebarTabService.selectedTab = sidebarTabService.tabs[0];
        expect(sidebarTabService.selectedTab.requireWidget).toBeFalsy();

        svc.selectWidget(widget, container);
        $rootScope.$apply();

        expect(sidebarTabService.selectedTab).toBe(sidebarTabService.tabs[2]);
        expect(sidebarTabService.selectedTab.requireWidget).toBeTrue();
      });

      it('should leave the selected tab unchanged if a widget tab is selected',
          function() {
        sidebarTabService.selectedTab = sidebarTabService.tabs[4];
        expect(sidebarTabService.selectedTab.requireWidget).toBeTrue();

        svc.selectWidget(widget, container);
        $rootScope.$apply();

        expect(sidebarTabService.selectedTab).toBe(sidebarTabService.tabs[4]);
      });
    });

    describe('selectContainer', function() {

      it('should update the selectedContainer.', function() {
        svc.selectContainer(container);
        $rootScope.$apply();

        expect(svc.selectedContainer).toBe(container);
      });

      it('should update the container state to selected.', function() {
        var container2 = containerService.insert();
        expect(container.state().selected).toBeFalsy();

        svc.selectContainer(container);
        $rootScope.$apply();

        expect(container.state().selected).toBeTruthy();
      });

      it('should update the previous container state to unselected.', function() {
        svc.selectContainer(container);
        $rootScope.$apply();

        // Deselect it
        svc.selectContainer(null);
        $rootScope.$apply();

        expect(container.state().selected).toBeFalsy();
      });
    });

    describe('refreshWidget', function() {

      beforeEach(inject(function() {
        configService.populate(configService.getConfigForTesting());
      }));
    });

    describe('addWidget', function() {
      var actualWidget;

      it('should add a new widget in the container.', function() {
        expect(container.model.container.children.length).toEqual(1);
        actualWidget = svc.addWidget(container);
        expect(actualWidget).not.toBeNull();
        expect(container.model.container.children.length).toEqual(2);
        expect(container.model.container.children[1]).toEqual(actualWidget);
      });

      it('should select the widget added.', function() {
        svc.addWidget(container);
        $rootScope.$apply();

        expect(svc.selectedWidget).not.toBeNull();
      });

      it('should select the widget\'s container.', function() {
        svc.addWidget(container);
        $rootScope.$apply();

        expect(svc.selectedContainer).not.toBeNull();
      });

      it('should increment the columns.', function() {
        expect(container.model.container.columns).toEqual(1);
        svc.addWidget(container);
        expect(container.model.container.columns).toEqual(2);
      });

      it('should set the parent reference.', function() {
        var widgetAdded = svc.addWidget(container);
        expect(widgetAdded.state().parent).toBe(container);
      });
    });

    describe('cloneWidget', function() {
      var expectedTitle = 'PROVIDED_TITLE';

      beforeEach(inject(function() {
        widget.title = expectedTitle;
      }));

      it('should create a copy of the current widget with a new id', function() {
        var sourceId = widget.model.id;
        var targetWidget = svc.cloneWidget(widget, container);

        expect(targetWidget).not.toEqual(widget);
        expect(targetWidget.model.id).not.toEqual(sourceId);
        expect(widget.model.id).toEqual(sourceId);
        expect(targetWidget.model.title).toEqual(widget.model.title);
      });
    });

    describe('removeWidget', function() {

      it('should remove the widget from the container.', function() {
        svc.removeWidget(widget, container);

        expect(container.model.container.children.indexOf(widget)).toEqual(-1);
      });
    });

    describe('addContainer', function() {
      var actualContainer;

      it('should add a new container and add a new widget.', function() {
        spyOn(svc, 'addWidget');

        expect(svc.containers.length).toEqual(1);
        actualContainer = containerService.insert();
        expect(svc.containers.length).toEqual(2);
        var newContainer = svc.containers[1];
        expect(svc.addWidget).toHaveBeenCalledWith(newContainer, false);
        expect(actualContainer).toEqual(newContainer);
      });
    });

    describe('removeContainer', function() {

      it('should remove the container from the widgets array.', function() {
        expect(svc.containers.indexOf(container)).toEqual(0);

        svc.removeContainer(container);

        expect(svc.containers.indexOf(container)).toEqual(-1);
      });
    });

    describe('moveWidgetTo', function() {
      var widget2;

      beforeEach(inject(function() {
        widget2 = svc.addWidget(container);
      }));

      describe('Previous', function() {
        it('should swap the widget with the one at the previous position.',
            function() {
              svc.moveWidgetToPrevious(widget2);

              expect(container.model.container.children.indexOf(widget)).
                  toEqual(1);
              expect(container.model.container.children.indexOf(widget2)).
                  toEqual(0);
            }
        );
      });

      describe('Next', function() {

        it('should swap the widget with the one at the next position.',
            function() {
              svc.moveWidgetToNext(widget);

              expect(container.model.container.children.indexOf(widget)).
                  toEqual(1);
              expect(container.model.container.children.indexOf(widget2)).
                  toEqual(0);
            }
        );
      });

      describe('First', function() {

        it('should move the widget to the beginning of the array.',
            function() {
              var widget3 = svc.addWidget(container);

              svc.moveWidgetToFirst(widget3);

              expect(container.model.container.children.indexOf(widget)).
                  toEqual(1);
              expect(container.model.container.children.indexOf(widget2)).
                  toEqual(2);
              expect(container.model.container.children.indexOf(widget3)).
                  toEqual(0);
            }
        );
      });

      describe('Last', function() {

        it('should move the widget to the end of the array.',
            function() {
              var widget3 = svc.addWidget(container);

              svc.moveWidgetToLast(widget);

              expect(container.model.container.children.indexOf(widget)).
                  toEqual(2);
              expect(container.model.container.children.indexOf(widget2)).
                  toEqual(0);
              expect(container.model.container.children.indexOf(widget3)).
                  toEqual(1);
            }
        );
      });

      describe('PreviousContainer', function() {
        it('should move into a new top-level container if it has siblings.',
            function() {
              svc.moveWidgetToPreviousContainer(widget);

              newContainer = widget.state().parent;
              expect(newContainer).not.toEqual(container);
              expect(svc.containers.indexOf(newContainer)).toEqual(0);
              expect(svc.containers.indexOf(container)).toEqual(1);
              expect(explorerStateService.containers.all[
                  newContainer.model.id]).toBeDefined();
              expect(newContainer.model.container.children.indexOf(widget)).
                  toEqual(0);
              expect(container.model.container.children.indexOf(widget2)).
                  toEqual(0);
            }
        );

        it('should move to the previous container if it is not already first.',
            function() {
              expect(svc.containers.indexOf(container)).toEqual(0);

              svc.moveWidgetToPreviousContainer(widget);

              expect(svc.containers.indexOf(container)).toEqual(1);
              var targetContainer = svc.containers[0];

              expect(targetContainer.model.container.children.indexOf(widget)).
                  toEqual(0);
              expect(container.model.container.children.indexOf(widget2)).
                  toEqual(0);
            }
        );

        it('should clean up a container if left empty after the widget is moved.',
            function() {
              var targetContainer = containerService.insert();
              var targetWidget = targetContainer.model.container.children[0];

              expect(svc.containers.length).toEqual(2);
              expect(container.model.container.children.length).toEqual(2);

              svc.moveWidgetToPreviousContainer(targetWidget);

              expect(svc.containers.indexOf(targetContainer)).toEqual(-1);
              expect(svc.containers.indexOf(container)).toEqual(0);
              expect(svc.containers.length).toEqual(1);
              expect(container.model.container.children.indexOf(widget)).
                  toEqual(0);
              expect(container.model.container.children.indexOf(targetWidget)).
                  toEqual(2);
            }
        );

        it('should do nothing if it is the only sibling of the first container.',
            function() {
              var container2 = containerService.insert();
              svc.removeWidget(widget2, container);
              widget2 = container2.model.container.children[0];

              expect(svc.containers.length).toEqual(2);
              expect(container.model.container.children.length).toEqual(1);
              expect(container2.model.container.children.length).toEqual(1);

              svc.moveWidgetToPreviousContainer(widget);

              expect(svc.containers.length).toEqual(2);
              expect(svc.containers.indexOf(container)).toEqual(0);
              expect(svc.containers.indexOf(container2)).toEqual(1);
              expect(container.model.container.children[0]).toEqual(widget)
              expect(container2.model.container.children[0]).toEqual(widget2)
            }
        );
      });

      describe('NextContainer', function() {

        it('should move into a new bottom-level container if it has siblings.',
            function() {
              expect(svc.containers.length).toEqual(1);
              svc.moveWidgetToNextContainer(widget2);
              container2 = widget2.state().parent;

              expect(svc.containers.length).toEqual(2);
              expect(container2).not.toEqual(container);
              expect(svc.containers.indexOf(container)).toEqual(0);
              expect(svc.containers.indexOf(container2)).toEqual(1);
              expect(explorerStateService.containers.all[
                  container2.model.id]).toBeDefined();

              expect(container.model.container.children.indexOf(widget)).
                  toEqual(0);
              expect(container2.model.container.children.indexOf(widget2)).
                  toEqual(0);
            }
        );

        it('should move to the next container if it is not already last.',
            function() {
              var container2 = containerService.insert();

              expect(svc.containers.length).toEqual(2);
              svc.moveWidgetToNextContainer(widget2);

              expect(svc.containers.length).toEqual(2);
              expect(svc.containers.indexOf(container)).toEqual(0);
              expect(svc.containers.indexOf(container2)).toEqual(1);

              expect(container.model.container.children.indexOf(widget)).
                  toEqual(0);
              expect(container2.model.container.children.indexOf(widget2)).
                  toEqual(1);
            }
        );

        it('should clean up a container if left empty after the widget is moved.',
            function() {
              var container2 = containerService.insert();
              var container3 = containerService.insert();
              widget2 = container2.model.container.children[0];

              expect(svc.containers.length).toEqual(3);
              svc.moveWidgetToNextContainer(widget2);

              expect(svc.containers.length).toEqual(2);
              expect(svc.containers.indexOf(container)).toEqual(0);
              expect(svc.containers.indexOf(container2)).toEqual(-1);
              expect(svc.containers.indexOf(container3)).toEqual(1);

              expect(container3.model.container.children.indexOf(widget2)).
                  toEqual(1);
            }
        );

        it('should do nothing if it is the only sibling of the last container.',
            function() {
              var container2 = containerService.insert();
              targetWidget = container2.model.container.children[0];

              expect(svc.containers.length).toEqual(2);
              svc.moveWidgetToNextContainer(targetWidget);

              expect(svc.containers.length).toEqual(2);
              expect(svc.containers.indexOf(container)).toEqual(0);
              expect(svc.containers.indexOf(container2)).toEqual(1);
              expect(container.model.container.children.indexOf(widget)).
                  toEqual(0);
              expect(container2.model.container.children.indexOf(targetWidget)).
                  toEqual(0);
            }
        );
      });
    });

    describe('initializeParams_', function() {
      it('should populate based on config-provided values.', function() {
        provided_params = [
          new DashboardParam('param1', 'value1'),
          new DashboardParam('param2', 'value2')
        ];

        explorerStateService.selectedDashboard = {
          'model': {
            'params': provided_params
          }
        };

        svc.initializeParams_();

        expect(svc.params).toEqual(provided_params);
      });

      it('should overwrite default values with url parms.', function() {
        expected_value = 'UPDATED_VALUE';

        provided_params = [
          new DashboardParam('param1', 'value1'),
          new DashboardParam('param2', 'value2')
        ];

        $location.search().param1 = expected_value;

        explorerStateService.selectedDashboard = {
          'model': {
            'params': provided_params
          }
        };

        svc.initializeParams_();

        expect(svc.params[0].value).toEqual(expected_value);
      });

      it('should ignore params not defined in the dashboard.', function() {
        provided_params = [
          new DashboardParam('param1', 'value1'),
          new DashboardParam('param2', 'value2')
        ];

        $location.search().param3 = 'UNSUPPORTED_VALUE';

        explorerStateService.selectedDashboard = {
          'model': {
            'params': provided_params
          }
        };

        svc.initializeParams_();

        expect(svc.params).toEqual(provided_params);
      });
    });

    describe('rewriteQuery', function() {

      var providedWidget, providedConfig, sampleDashboardValues,
          sampleWidgetValues;

      beforeEach(inject(function() {
        spyOn(queryBuilderService, 'getSql');

        providedWidget = {
          'model': {
            'datasource': {
              'custom_query': false,
              'query': '',
              'config': {
                'results': {
                  'project_id': '',
                  'dataset_name': '',
                  'table_name': '',
                  'table_partition': ''
                }
              }
            }
          }
        };

        providedConfig = providedWidget.model.datasource.config;

        configService.populate({
          'default_project': 'CONFIG_PROJECT',
          'default_dataset': 'CONFIG_DATASET',
          'default_table': 'CONFIG_TABLE',
          'table_partition': 'CONFIG_PARTITION'
        });

        sampleDashboardValues = {
          'project_id': 'DASH_PROJECT',
          'dataset_name': 'DASH_DATASET',
          'table_name': 'DASH_TABLE',
          'table_partition': 'DASH_PARTITION'
        };

        sampleWidgetValues = {
          'project_id': 'WIDGET_PROJECT',
          'dataset_name': 'WIDGET_DATASET',
          'table_name': 'WIDGET_TABLE',
          'table_partition': 'WIDGET_PARTITION'
        };
      }));

      it('should use widget values if available.', function() {
        providedConfig.results.project_id = sampleWidgetValues.project_id;
        providedConfig.results.dataset_name = sampleWidgetValues.dataset_name;
        providedConfig.results.table_name = sampleWidgetValues.table_name;
        providedConfig.results.table_partition = (
            sampleWidgetValues.table_partition);

        svc.rewriteQuery(providedWidget);

        expect(queryBuilderService.getSql).toHaveBeenCalledWith(
            providedConfig,
            sampleWidgetValues.project_id,
            sampleWidgetValues.dataset_name,
            sampleWidgetValues.table_name,
            sampleWidgetValues.table_partition,
            null);
      });

      it('should use dashboard values if absence of widget values.', function() {
        svc.current.model.project_id = sampleDashboardValues.project_id;
        svc.current.model.dataset_name = sampleDashboardValues.dataset_name;
        svc.current.model.table_name = sampleDashboardValues.table_name;
        svc.current.model.table_partition = (
            sampleDashboardValues.table_partition);

        svc.rewriteQuery(providedWidget);

        expect(queryBuilderService.getSql).toHaveBeenCalledWith(
            providedConfig,
            sampleDashboardValues.project_id,
            sampleDashboardValues.dataset_name,
            sampleDashboardValues.table_name,
            sampleDashboardValues.table_partition,
            null);
      });

      it('should use config values if absence of widget and dashboard ' +
         'values.', function() {
        svc.rewriteQuery(providedWidget);

        expect(queryBuilderService.getSql).toHaveBeenCalledWith(
            providedConfig,
            configService.default_project,
            configService.default_dataset,
            configService.default_table,
            svc.DEFAULT_TABLE_PARTITION,
            null);
      });

      it('should use a mix of scopes to populate values.', function() {
        svc.current.model.project_id = sampleDashboardValues.project_id;
        providedConfig.results.dataset_name = sampleWidgetValues.dataset_name;

        svc.rewriteQuery(providedWidget);

        expect(queryBuilderService.getSql).toHaveBeenCalledWith(
            providedConfig,
            sampleDashboardValues.project_id,
            sampleWidgetValues.dataset_name,
            configService.default_table,
            svc.DEFAULT_TABLE_PARTITION,
            null);
      });
    });
  });
});
