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
goog.require('p3rf.perfkit.explorer.components.container.ContainerWidgetConfig');
goog.require('p3rf.perfkit.explorer.models.WidgetConfig');


describe('ExplorerStateService', function() {
  var svc, $rootScope, $state;
  var errorSvc, explorerSvc, containerSvc;

  const explorer = p3rf.perfkit.explorer;
  const ExplorerStateModel = explorer.components.explorer.ExplorerStateModel;
  const ContainerWidgetConfig = explorer.components.container.ContainerWidgetConfig;
  const WidgetConfig = explorer.models.WidgetConfig;

  beforeEach(module('explorer'));

  beforeEach(inject(function(
      _$rootScope_, _$state_, explorerStateService, errorService, explorerService, containerService) {
    $rootScope = _$rootScope_;
    $state = _$state_;
    svc = explorerStateService;
    errorSvc = errorService;
    containerSvc = containerService;
    explorerSvc = explorerService;

    explorerSvc.newDashboard(false);
  }));

  describe('should correctly initialize', function() {
    var expectedModel;

    it('the containers list', function() {
      expect(svc.containers).not.toBeNull();
    });

    it('the widgets list', function() {
      expect(svc.widgets).not.toBeNull();
    });
  });

  describe('method', function() {
    var widget1, widget2, container1, container2;

    beforeEach(inject(function() {
      container1 = containerSvc.insert(true, false);
      container2 = containerSvc.insert(true, false);

      widget1 = container1.model.container.children[0];
      widget2 = container2.model.container.children[0];
    }));

    describe('selectWidget', function() {
      it('should select items by id', function() {
        expect(svc.containers.selected).toBeNull();
        expect(svc.widgets.selected).toBeNull();

        svc.selectWidget(container2.model.id, widget2.model.id);
        $rootScope.$apply();

        expect(svc.containers.selected).toEqual(container2);
        expect(container2.state().selected).toBeTrue();
        expect(svc.widgets.selected).toEqual(widget2);
        expect(widget2.state().selected).toBeTrue();
      });

      it('should unselect items when NULL is passed', function() {
        svc.selectWidget(container1.model.id, widget1.model.id);
        $rootScope.$apply();

        svc.selectWidget(null, null);
        $rootScope.$apply();

        expect(svc.containers.selected).toBeNull();
        expect(container2.state().selected).toBeFalse();
        expect(svc.widgets.selected).toBeNull();
        expect(container2.state().selected).toBeFalse();
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
