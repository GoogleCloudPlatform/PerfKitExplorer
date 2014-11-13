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
 * @fileoverview Tests for the chartWrapperService service.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.ChartWrapperService');
goog.require('p3rf.perfkit.explorer.components.widget.data_viz.gviz.getGvizChartWrapper');

describe('chartWrapperService', function() {
  var svc, chartWrapperMock;

  beforeEach(module('explorer'));
  beforeEach(module('googleVisualizationMocks'));

  beforeEach(inject(function(chartWrapperService, GvizChartWrapper) {
    svc = chartWrapperService;
    chartWrapperMock = GvizChartWrapper.prototype;
  }));

  describe('create', function() {

    it('should create a ChartWrapper.', function() {
      var chartWrapper = svc.create();
      expect(chartWrapper).not.toBeNull();
    });

    it('should create a ChartWrapper with parameters provided.', function() {
      var chartType = {obj: 'chartType'};
      var gvizOptions = {obj: 'gvizOptions'};
      var dataTable = {obj: 'dataTable'};

      var chartWrapper = svc.create(chartType, gvizOptions, dataTable);

      expect(chartWrapper).not.toBeNull();
      expect(chartWrapperMock.setChartType).toHaveBeenCalledWith(chartType);
      expect(chartWrapperMock.setOptions).toHaveBeenCalledWith(gvizOptions);
      expect(chartWrapperMock.setDataTable).toHaveBeenCalledWith(dataTable);
    });
  });

  describe('getChartModel', function() {

    it('should return a ChartModel object.', function() {
      var chartType = {obj: 'chartType'};
      var gvizOptions = {obj: 'gvizOptions'};
      chartWrapperMock.getChartType.andReturn(chartType);
      chartWrapperMock.getOptions.andReturn(gvizOptions);
      var chartWrapper = svc.create();

      var model = svc.getChartModel(chartWrapper);

      expect(model).not.toBeNull();
      expect(model.chartType).toEqual(chartType);
      expect(model.options).toEqual(gvizOptions);
    });
  });
});
