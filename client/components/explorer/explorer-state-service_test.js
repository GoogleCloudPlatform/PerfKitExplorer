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
  var svc, $rootScope, $state;
  var errorSvc;

  const explorer = p3rf.perfkit.explorer;
  const ExplorerStateModel = explorer.components.explorer.ExplorerStateModel;

  beforeEach(module('explorer'));

  beforeEach(inject(function(
      _$rootScope_, _$state_, explorerStateService, errorService) {
    $rootScope = _$rootScope_;
    $state = _$state_;
    svc = explorerStateService;
    errorSvc = errorService;
  }));

  describe('should correctly initialize', function() {
    var expectedModel;

    beforeEach(inject(function() {
      expectedModel = new ExplorerStateModel();
    }));

    it('the containers list', function() {
      expect(svc.containers).toEqual(expectedModel);
    });

    it('the widgets list', function() {
      expect(svc.widgets).toEqual(expectedModel);
    });
  });

  describe('method', function() {
    var widget1, widget2, container1, container2;

    beforeEach(inject(function() {
      widget1 = {model: {id: 'w1', title: 'widget 1'}};
      widget2 = {model: {id: 'w2', title: 'widget 2'}};
      container1 = {model: {id: 'c1', title: 'container 1'}};
      container2 = {model: {id: 'c2', title: 'container 2'}};

      svc.widgets.add(widget1);
      svc.widgets.add(widget2);
      svc.containers.add(container1);
      svc.containers.add(container2);
    }));

    fdescribe('selectWidget', function() {
      it('should select items by id', function() {
        svc.selectWidget(container2.model.id, widget2.model.id);
        $rootScope.$apply();

        expect(svc.containers.selected).toEqual(container2);
        expect(svc.widgets.selected).toEqual(widget2);
      });

      it('should unselect items when NULL is passed', function() {
        svc.selectWidget(null, null);
        $rootScope.$apply();

        expect(svc.containers.selected).toBeNull();
        expect(svc.widgets.selected).toBeNull();
      });

      describe('should write to the log when providing an invalid',
          function() {
        beforeEach(inject(function() {
          spyOn(errorSvc, 'addError');
        }));

        it('containerId', function() {
          svc.selectWidget('invalid', widget1.model.id);
          expect(errorSvc.addError).toHaveBeenCalled();
        });

        it('widgetId', function() {
          svc.selectWidget(container1.model.id, 'invalid');
          expect(errorSvc.addError).toHaveBeenCalled();
        });

        it('containerId and widgetId', function() {
          svc.selectWidget('invalid', 'invalid');
          expect(errorSvc.addError.calls.count()).toEqual(2);
        });
      });
    });
  });
});
