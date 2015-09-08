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
  var dashboardSvc, widgetFactorySvc, errorSvc, chartTypeMockData;
  var $httpBackend;

  var ChartWidgetConfig = p3rf.perfkit.explorer.models.ChartWidgetConfig;
  var ColumnStyleModel = gviz.column_style.ColumnStyleModel;

  beforeEach(module('explorer'));
  beforeEach(module('chartTypeMock'));

  beforeEach(inject(function(_$httpBackend_, _chartTypeMockData_) {
    _$httpBackend_.expectGET(
        '/static/components/widget/data_viz/gviz/gviz-charts.json')
      .respond(_chartTypeMockData_);
    $httpBackend = _$httpBackend_;
  }));

  beforeEach(inject(function(
      columnStyleService, _GvizDataTable_,
      _dashboardService_, _widgetFactoryService_, _errorService_) {
    svc = columnStyleService;
    GvizDataTable = _GvizDataTable_;
    dashboardSvc = _dashboardService_;
    widgetFactorySvc = _widgetFactoryService_;
    errorSvc = _errorService_;

    $httpBackend.flush();

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

  describe('isColumnASeries', function() {
    it('should return false if the column is the first in the list', function() {
      var providedColumns = [
        new ColumnStyleModel('timestamp'),
        new ColumnStyleModel('sales_amt')
      ];
      providedConfig.model.chart.columns = providedColumns;

      expect(svc.isColumnASeries(providedConfig, providedColumns[0])).toBeFalse();
    });

    it('should return false if the column has an assigned non-series role',
        function() {
      var providedColumns = [
        new ColumnStyleModel('timestamp'),
        new ColumnStyleModel('sales_amt', null, 'annotation')
      ];
      providedConfig.model.chart.columns = providedColumns;

      expect(svc.isColumnASeries(providedConfig, providedColumns[1])).toBeFalse();
    });

    it('should return true if the column has an assigned series role and the ' +
       'chart supports series data',
        function() {
      var providedColumns = [
        new ColumnStyleModel('timestamp'),
        new ColumnStyleModel('sales_amt', null, 'data')
      ];
      providedConfig.model.chart.chartType = 'Histogram';
      providedConfig.model.chart.columns = providedColumns;

      expect(svc.isColumnASeries(providedConfig, providedColumns[1])).toBeTrue();
    });

    it('should return true for the first column if seriesStartColumnIndex is 0',
        function() {
      var providedColumns = [
        new ColumnStyleModel('timestamp'),
        new ColumnStyleModel('sales_amt', null, 'data')
      ];
      providedConfig.model.chart.chartType = 'Histogram';
      providedConfig.model.chart.columns = providedColumns;

      expect(svc.isColumnASeries(providedConfig, providedColumns[0])).toBeTrue();
    });
  });

  describe('getSeriesColumns', function() {
    it('should return data series columns', function() {
      var providedColumns = [
        new ColumnStyleModel('timestamp'),
        new ColumnStyleModel('sales_amt', null, 'data'),
        new ColumnStyleModel('sales_amt', null, 'tooltip'),
        new ColumnStyleModel('sales_amt', null, null)
      ];
      providedConfig.model.chart.chartType = 'AreaChart';
      providedConfig.model.chart.columns = providedColumns;

      var expectedColumns = [providedColumns[1], providedColumns[3]];

      expect(svc.getSeriesColumns(providedConfig)).toEqual(expectedColumns);
    });

    it('should start with the seriesStartColumnIndex column', function() {
      var providedColumns = [
        new ColumnStyleModel('timestamp'),
        new ColumnStyleModel('sales_amt', null, 'data'),
        new ColumnStyleModel('sales_amt', null, 'tooltip'),
        new ColumnStyleModel('sales_amt', null, null)
      ];
      providedConfig.model.chart.chartType = 'Histogram';
      providedConfig.model.chart.columns = providedColumns;

      var expectedColumns = [
          providedColumns[0], providedColumns[1], providedColumns[3]];

      expect(svc.getSeriesColumns(providedConfig)).toEqual(expectedColumns);
    });
  });

  describe('getEffectiveChartConfig', function() {
    beforeEach(inject(function() {
      providedConfig.model.chart.chartType = 'AreaChart';
    }));

    it('should populate series color', function() {
      var providedColumns = [
        new ColumnStyleModel('axis'),
        new ColumnStyleModel('timestamp', null, null, 'blue'),
        new ColumnStyleModel('sales_amt', null, null, 'red')
      ];
      providedConfig.model.chart.columns = providedColumns;

      var actualConfig = svc.getEffectiveChartConfig(providedConfig);
      var expectedSeries = [
        {'color': 'blue'},
        {'color': 'red'}
      ];

      expect(actualConfig.series).toEqual(expectedSeries);
    });

    it('should ignore populated series colors', function() {
      var providedColumns = [
        new ColumnStyleModel('axis'),
        new ColumnStyleModel('timestamp', null, null, 'blue'),
        new ColumnStyleModel('sales_amt', null, null, 'red')
      ];
      providedConfig.model.chart.columns = providedColumns;

      var providedSeries = [
        {'color': 'yellow'}
      ];
      providedConfig.model.chart.options.series = providedSeries;

      var actualConfig = svc.getEffectiveChartConfig(providedConfig);
      var expectedSeries = [
        {'color': 'yellow'},
        {'color': 'red'}
      ];

      expect(actualConfig.series).toEqual(expectedSeries);
    });

    it('should apply correctly when the columns have a custom order', function() {
      var providedColumns = [
        new ColumnStyleModel('axis'),
        new ColumnStyleModel('sales_amt', null, null, 'red'),
        new ColumnStyleModel('timestamp', null, null, 'blue')
      ];
      providedConfig.model.chart.columns = providedColumns;

      var actualConfig = svc.getEffectiveChartConfig(providedConfig);
      var expectedSeries = [
        {'color': 'red'},
        {'color': 'blue'}
      ];

      expect(actualConfig.series).toEqual(expectedSeries);
    });

  });

  describe('applyToDataTable', function() {

    it('should replace column titles', function() {
      var providedColumns = [
        new ColumnStyleModel('timestamp', 'Date'),
        new ColumnStyleModel('sales_amt', 'Sales')
      ];
      providedConfig.model.chart.columns = providedColumns;

      svc.applyToDataTable(providedConfig.model.chart.columns, providedDataTable);

      expect(providedDataTable.getColumnLabel(0)).toEqual('Date');
      expect(providedDataTable.getColumnProperty(0, 'role')).toEqual('');

      expect(providedDataTable.getColumnLabel(1)).toEqual('Sales');
      expect(providedDataTable.getColumnProperty(1, 'role')).toEqual('');
    });

    it('should set column roles', function() {
      var providedColumns = [
        new ColumnStyleModel('timestamp', null, 'domain'),
        new ColumnStyleModel('sales_amt', null, 'data')
      ];
      providedConfig.model.chart.columns = providedColumns;

      svc.applyToDataTable(providedConfig.model.chart.columns, providedDataTable);

      expect(providedDataTable.getColumnLabel(0)).toEqual('timestamp');
      expect(providedDataTable.getColumnProperty(0, 'role')).toEqual('domain');

      expect(providedDataTable.getColumnLabel(1)).toEqual('sales_amt');
      expect(providedDataTable.getColumnProperty(1, 'role')).toEqual('data');
    });

    it('should set column titles and roles together', function() {
      svc.applyToDataTable(providedConfig.model.chart.columns, providedDataTable);

      expect(providedDataTable.getColumnLabel(0)).toEqual('Quarter Ending');
      expect(providedDataTable.getColumnProperty(0, 'role')).toEqual('domain');

      expect(providedDataTable.getColumnLabel(1)).toEqual('Total Sales');
      expect(providedDataTable.getColumnProperty(1, 'role')).toEqual('data');
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
  })
});
