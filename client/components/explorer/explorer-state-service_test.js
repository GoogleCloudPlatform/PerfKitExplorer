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
 * @fileoverview Tests for ExplorerStateService, which tracks and manages
 * the state of the Explorer page.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerStateService');
goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerStateModel');


describe('ExplorerStateService', function() {
  var scope, svc;

  const explorer = p3rf.perfkit.explorer;
  const ExplorerStateModel = explorer.components.explorer.ExplorerStateModel;

  var mockDashboards = [
    {'id': '1', 'title': 'Dashboard 1'},
    {'id': '2', 'title': 'Dashboard 2'},
    {'id': '3', 'title': 'Dashboard 3'}
  ];

  var mockWidgets = [
    {'id': '1', 'title': 'Widget 1'},
    {'id': '2', 'title': 'Widget 2'},
    {'id': '3', 'title': 'Widget 3'}
  ];

  var mockTabs = [
    {'id': '1', 'title': 'Tab 1'},
    {'id': '2', 'title': 'Tab 2'},
    {'id': '3', 'title': 'Tab 3'}
  ];

  var mockFooterTabs = [
    {'id': '1', 'title': 'Tab 1'},
    {'id': '2', 'title': 'Tab 2'},
    {'id': '3', 'title': 'Tab 3'}
  ];

  beforeEach(module('explorer'));

  beforeEach(inject(function(_explorerStateService_) {
    svc = _explorerStateService_;
  }));

  describe('should correctly initialize', function() {
    var expectedModel;

    beforeEach(inject(function() {
      expectedModel = new ExplorerStateModel();
    }));

    it('the widgets list', function() {
      expect(svc.widgets).toEqual(expectedModel);
    });

    it('the tabs list', function() {
      expect(svc.tabs).toEqual(expectedModel);
    });

    it('the footer tabs list', function() {
      expect(svc.footerTabs).toEqual(expectedModel);
    });

    it('the show footer flag', function() {
      expect(svc.footerIsVisible).toEqual(false);
    });

    it('the focus widget flag', function() {
      expect(svc.widgetIsFocused).toEqual(false);
    });
  });

});
