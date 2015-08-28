/**
 * @copyright Copyright 2015 Google Inc. All rights reserved.
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
 * @fileoverview Tests for the columnStyleService service.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.ArrowFormatModel');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.BarFormatModel');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.ColumnStyleFormatModel');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.ColumnStyleFormatService');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.DateFormatModel');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.NumberFormatModel');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.PatternFormatModel');

fdescribe('columnStyleFormatService', function() {
  var explorer = p3rf.perfkit.explorer;
  var gviz = explorer.components.widget.data_viz.gviz;

  var ArrowFormatModel = gviz.column_style.ArrowFormatModel;
  var BarFormatModel = gviz.column_style.BarFormatModel;
  var DateFormatModel = gviz.column_style.DateFormatModel;
  var NumberFormatModel = gviz.column_style.NumberFormatModel;
  var PatternFormatModel = gviz.column_style.PatternFormatModel;

  var svc, providedDataTable, GvizDataTable, providedConfig,
      providedColumn1, providedColumn2;
  var dashboardSvc, widgetFactorySvc, errorSvc;

  var ChartWidgetConfig = p3rf.perfkit.explorer.models.ChartWidgetConfig;
  var ColumnStyleModel = gviz.column_style.ColumnStyleModel;

  beforeEach(module('explorer'));
  beforeEach(module('googleVisualizationMocks'));

  beforeEach(inject(function(
      columnStyleFormatService, _GvizDataTable_, _dashboardService_,
      _widgetFactoryService_, _errorService_) {
    svc = columnStyleFormatService;
    GvizDataTable = _GvizDataTable_;
    dashboardSvc = _dashboardService_;
    widgetFactorySvc = _widgetFactoryService_;
    errorSvc = _errorService_;

    errorSvc.logToConsole = false;
  }));

  beforeEach(function() {
    providedConfig = new ChartWidgetConfig(widgetFactorySvc);
    providedColumn1 = new ColumnStyleModel('timestamp', 'Quarter Ending', 'domain');
    providedColumn2 = new ColumnStyleModel('sales_amt', 'Total Sales', 'data');
    providedConfig.model.chart.columns.push(providedColumn1, providedColumn2);

    var data = {
      cols: [
        {id: 'timestamp', type: 'date'},
        {id: 'sales_amt', type: 'number'}
      ],
      rows: [
        {c: [
          {v: '2013/03/30'},
          {v: 3}
        ]}
      ]
    };

    providedDataTable = new GvizDataTable(data);
    providedConfig.state().datasource.data = providedDataTable;
  });

  describe('newModel', function() {
    describe('should return the appropriate model for', function() {
      it('ArrowFormat', function() {
        var expectedFormat = new ArrowFormatModel();
        var actualFormat = svc.newModel('ArrowFormat');

        expect(actualFormat).toEqual(expectedFormat);
      });
    });
  });
});
