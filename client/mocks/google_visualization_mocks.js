/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 *
 * @fileoverview Mocks for google.visualization's objects.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

var googleVisualizationMocks = angular.module('googleVisualizationMocks', []);


var getGvizChartWrapperMock = function() {
  function GvizChartWrapper() {
  }
  GvizChartWrapper.prototype.draw = jasmine.createSpy();
  GvizChartWrapper.prototype.getChartType = jasmine.createSpy();
  GvizChartWrapper.prototype.getDataTable = jasmine.createSpy();
  GvizChartWrapper.prototype.getOptions = jasmine.createSpy();
  GvizChartWrapper.prototype.setChartType = jasmine.createSpy();
  GvizChartWrapper.prototype.setContainerId = jasmine.createSpy();
  GvizChartWrapper.prototype.setDataTable = jasmine.createSpy();
  GvizChartWrapper.prototype.setOptions = jasmine.createSpy();
  GvizChartWrapper.prototype.setView = jasmine.createSpy();

  return GvizChartWrapper;
};
googleVisualizationMocks.factory('GvizChartWrapper', getGvizChartWrapperMock);


var getGvizChartEditorMock = function() {
  function GvizChartEditor() {
  }
  GvizChartEditor.prototype.getChartWrapper = jasmine.createSpy();
  GvizChartEditor.prototype.openDialog = jasmine.createSpy();

  return GvizChartEditor;
};
googleVisualizationMocks.factory('GvizChartEditor', getGvizChartEditorMock);


var getGvizDataTableMock = function() {
  function GvizDataTable() {
  }
  GvizDataTable.prototype.getNumberOfRows = jasmine.createSpy();
  GvizDataTable.prototype.setDataTable = jasmine.createSpy();

  return GvizDataTable;
};
googleVisualizationMocks.factory('GvizDataTable', getGvizDataTableMock);


var getGvizDataViewMock = function() {
  function GvizDataView() {
  }
  GvizDataView.prototype.getFilteredRows = jasmine.createSpy();
  GvizDataView.prototype.getSortedRows = jasmine.createSpy();
  GvizDataView.prototype.setColumns = jasmine.createSpy();
  GvizDataView.prototype.setRows = jasmine.createSpy();
  GvizDataView.prototype.toJSON = jasmine.createSpy();

  return GvizDataView;
};
googleVisualizationMocks.factory('GvizDataView', getGvizDataViewMock);


var GvizEventsMock = function() {
  return {
    addListener: jasmine.createSpy(),
    removeListener: jasmine.createSpy(),
    removeAllListeners: jasmine.createSpy(),
    trigger: jasmine.createSpy()
  };
};
googleVisualizationMocks.service('gvizEvents', GvizEventsMock);
