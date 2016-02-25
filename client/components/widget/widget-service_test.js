/**
 * @copyright Copyright 2016 Google Inc. All rights reserved.
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
 * @fileoverview Tests for the widgetService service.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.provide('p3rf.perfkit.explorer.models.ChartWidgetConfig');
goog.require('p3rf.perfkit.explorer.components.widget.WidgetService');


describe('widgetService', function() {
  var explorer = p3rf.perfkit.explorer;
  var gviz = explorer.components.widget.data_viz.gviz;

  var svc, providedConfig;
  var widgetFactorySvc;

  var ChartWidgetConfig = p3rf.perfkit.explorer.models.ChartWidgetConfig;

  beforeEach(module('explorer'));

  beforeEach(inject(function(widgetService, widgetFactoryService) {
    svc = widgetService;
    widgetFactorySvc = widgetFactoryService;
  }));

  beforeEach(function() {
    providedConfig = new ChartWidgetConfig(widgetFactorySvc);
  });

  describe('constructor', function() {

    it('should provide a message template for the widget delete warning', function() {
      expect(svc.WIDGET_DELETE_WARNING).toEqual('The widget will be deleted:\n\n');
    });
  });

  describe('getDeleteWarningMessage', function() {

    it('should return a quoted widget title when one is specified', function() {
      var providedTitle = 'PROVIDED_TITLE';
      providedConfig.model.title = providedTitle;

      var actualMessage = svc.getDeleteWarningMessage(providedConfig);
      var expectedMessage = svc.WIDGET_DELETE_WARNING + '\'' + providedTitle + '\'';

      expect(actualMessage).toEqual(expectedMessage);
    });

    it('should return untitled when no title is specified ', function() {
      var actualMessage = svc.getDeleteWarningMessage(providedConfig);
      var expectedMessage = svc.WIDGET_DELETE_WARNING + 'Untitled';

      expect(actualMessage).toEqual(expectedMessage);
    });
  });
});
