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
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.ColumnStyleModel');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.column_style.ColumnStyleService');
goog.provide('p3rf.perfkit.explorer.models.ChartWidgetConfig');

describe('columnStyleService', function() {
  var explorer = p3rf.perfkit.explorer;
  var gviz = explorer.components.widget.data_viz.gviz;

  var svc, providedDataTable, GvizDataTable, providedConfig,
      providedColumn1, providedColumn2;
  var dashboardSvc, widgetFactorySvc, errorSvc;

  var ChartWidgetConfig = p3rf.perfkit.explorer.models.ChartWidgetConfig;
  var ColumnStyleModel = gviz.column_style.ColumnStyleModel;

  beforeEach(module('explorer'));
  beforeEach(module('googleVisualizationMocks'));

  beforeEach(inject(function(
      columnStyleService, _GvizDataTable_, _dashboardService_,
      _widgetFactoryService_, _errorService_) {
    svc = columnStyleService;
    GvizDataTable = _GvizDataTable_;
    dashboardSvc = _dashboardService_;
    widgetFactorySvc = _widgetFactoryService_;
    errorSvc = _errorService_;

    errorSvc.logToConsole = false;
  }));

  beforeEach(function() {
    providedConfig = new ChartWidgetConfig(widgetFactorySvc);
    providedColumn1 = new ColumnStyleModel('timestamp', 'Quarter Ending');
    providedColumn2 = new ColumnStyleModel('sales_amt', 'Total Sales');
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

  describe('removeColumn', function() {

    it('should remove the provided column from the provided widget', function() {
      svc.removeColumn(providedConfig, providedColumn1);

      expect(providedConfig.model.chart.columns).toEqual([providedColumn2]);
    });
  });

  describe('getEffectiveColumns', function() {

    it('should return column styles when none are explicitly defined', function() {
      providedConfig.model.chart.columns = [];

      var actualColumns = svc.getEffectiveColumns(
          providedConfig.model.chart.columns, providedDataTable);
      var expectedColumns = [
        new ColumnStyleModel('timestamp'),
        new ColumnStyleModel('sales_amt')
      ];

      expect(actualColumns).toEqual(expectedColumns);
    });

    it('should apply column styles when defined', function() {
      var providedColumns = [
        new ColumnStyleModel('timestamp', 'Date'),
        new ColumnStyleModel('sales_amt', 'Sales')
      ];
      providedConfig.model.chart.columns = providedColumns;

      var actualColumns = svc.getEffectiveColumns(
          providedConfig.model.chart.columns, providedDataTable);

      expect(actualColumns).toEqual(providedColumns);
    });

    it('should append columns without explicit definition at the end', function() {
      providedConfig.model.chart.columns = [new ColumnStyleModel('timestamp', 'Date')];

      var actualColumns = svc.getEffectiveColumns(
          providedConfig.model.chart.columns, providedDataTable);
      var expectedColumns = [
        new ColumnStyleModel('timestamp', 'Date'),
        new ColumnStyleModel('sales_amt')
      ];
      expect(actualColumns).toEqual(expectedColumns);
    });

    it('should suppress an error when the column does not exist in the dataTable',
        function() {
      var expectedColumns = [new ColumnStyleModel('NOTFOUND')];
      providedConfig.model.chart.columns = expectedColumns;
      svc.getEffectiveColumns(
          providedConfig.model.chart.columns, providedDataTable);
    });
  });

  describe('addColumnsFromDatasource', function() {

    it('should replace the columns collection with getEffectiveColumns', function() {
      spyOn(dashboardSvc, 'refreshWidget');
      providedConfig.model.chart.columns = [new ColumnStyleModel('timestamp', 'Date')];

      svc.addColumnsFromDatasource(providedConfig);
      var expectedColumns = [
        new ColumnStyleModel('timestamp', 'Date'),
        new ColumnStyleModel('sales_amt')
      ];

      expect(providedConfig.model.chart.columns).toEqual(expectedColumns);
      expect(dashboardSvc.refreshWidget).toHaveBeenCalledWith(providedConfig);
    });
  });

  describe('applyToDataTable', function() {

    it('should replace column titles', function() {
      svc.applyToDataTable(providedConfig.model.chart.columns, providedDataTable);

      expect(providedDataTable.getColumnLabel(0)).toEqual('Quarter Ending');
      expect(providedDataTable.getColumnLabel(1)).toEqual('Total Sales');
    });

    it('should suppress an error when the column does not exist in the dataTable',
        function() {
      var expectedColumns = [new ColumnStyleModel('NOTFOUND')];
      providedConfig.model.chart.columns = expectedColumns;
      svc.applyToDataTable(providedConfig.model.chart.columns, providedDataTable);
    });

    describe('should throw an error with a missing/null parameter for', function() {
      it('columns', function() {
        var expectedError = 'applyToDataTable failed: \'columns\' is required.';

        expect(svc.applyToDataTable).toThrowError(expectedError);

        expect(function() {
          svc.applyToDataTable(null);
        }).toThrowError(expectedError);
      });

      it('dataTable', function() {
        var expectedError = 'applyToDataTable failed: \'dataTable\' is required.';

        expect(function() {
          svc.applyToDataTable(providedConfig.model.chart.columns);
        }).toThrowError(expectedError);

        expect(function() {
          svc.applyToDataTable(providedConfig.model.chart.columns, null);
        }).toThrowError(expectedError);
      });
    });
  });

  describe('getColumnIndex', function() {

    it('should return the index of a matching column name', function() {
      expect(svc.getColumnIndex('timestamp', providedDataTable)).toEqual(0);
      expect(svc.getColumnIndex('sales_amt', providedDataTable)).toEqual(1);
    });

    it('should return -1 if the column is not found', function() {
      expect(svc.getColumnIndex('UNDEFINED', providedDataTable)).toEqual(-1);
    });

    it('should raise an error if a column string is not provided', function() {
      var expectedError = 'getColumnIndex failed: \'columnId\' is a required string.';

      expect(svc.getColumnIndex).toThrowError(expectedError);

      expect(function() {
        svc.getColumnIndex(null);
      }).toThrowError(expectedError);
    });

    it('should raise an error if a dataTable is not provided', function() {
      expect(function() {
        svc.getColumnIndex('timestamp');
      }).toThrowError('getColumnIndex failed: \'dataTable\' is required.');

      expect(function() {
        svc.getColumnIndex('timestamp', null);
      }).toThrowError('getColumnIndex failed: \'dataTable\' is required.');
    });
  })
});
