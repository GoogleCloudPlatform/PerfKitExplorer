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
 * @fileoverview Mocks for google.visualization's objects.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.mocks.gvizMocks');

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
