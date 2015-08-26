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
 * @fileoverview Tests for the containerService service.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.components.container.ContainerService');
goog.require('p3rf.perfkit.explorer.components.container.ContainerWidgetConfig');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerStateService');
goog.require('p3rf.perfkit.explorer.components.util.ArrayUtilService');


describe('containerService', function() {
  const explorer = p3rf.perfkit.explorer;
  const ArrayUtilService = explorer.components.util.ArrayUtilService;
  const ContainerService = explorer.components.container.ContainerService;
  const ContainerWidgetConfig = explorer.components.container.ContainerWidgetConfig;
  const DashboardService = explorer.components.dashboard.DashboardService;

  var dashboard;
  var svc, configService, arrayUtilService, dashboardService, explorerStateService;
  var $rootScope;

  beforeEach(module('explorer'));

  beforeEach(inject(function(containerService,
                             _arrayUtilService_,
                             _dashboardService_,
                             _explorerService_,
                             _explorerStateService_,
                             _$rootScope_) {
    svc = containerService;
    arrayUtilSvc = _arrayUtilService_;
    dashboardSvc = _dashboardService_;
    explorerSvc = _explorerService_;
    explorerStateSvc = _explorerStateService_;
    $rootScope = _$rootScope_;

    // Create an empty dashboard.
    dashboard = explorerSvc.newDashboard(false);
    $rootScope.$apply();
  }));

  describe('constructor', function() {
    describe('should contain a service reference for', function() {

      it('arrayUtilService', function() {
        expect(svc.arrayUtilSvc).toEqual(arrayUtilSvc);
      });

      it('dashboardService', function() {
        expect(svc.dashboardSvc).toEqual(dashboardSvc);
      });
    })
  });

  describe('insert', function() {
    it('should add a new container', function() {
      expect(dashboardSvc.containers.length).toBe(0);

      var actualContainer = svc.insert();

      expect(dashboardSvc.containers.length).toEqual(1);
      expect(dashboardSvc.containers[0]).toEqual(actualContainer);

      expect(explorerStateSvc.containers.all[actualContainer.model.id])
          .toBe(actualContainer);
    });
  });

  describe('insertAt', function() {
    it('should insert the container at the specified index', function() {
      var providedContainers = [];
      for (var i=0; i<5; ++i) {
        providedContainers.push(svc.insert());
      }

      var actualContainer = svc.insertAt(2);

      expect(dashboardSvc.containers.indexOf(actualContainer)).toBe(2);
      expect(dashboardSvc.containers.length).toBe(6);

      expect(explorerStateSvc.containers.all[actualContainer.model.id])
          .toBe(actualContainer);
    });
  });

  describe('insertAfter', function() {
    it('should insert the container after the provided one', function() {
      var providedContainers = [];
      for (var i=0; i<5; ++i) {
        providedContainers.push(svc.insert());
      }

      var actualContainer = svc.insertAfter(providedContainers[1]);

      expect(dashboardSvc.containers.indexOf(actualContainer)).toBe(2);
      expect(dashboardSvc.containers.length).toBe(6);

      expect(explorerStateSvc.containers.all[actualContainer.model.id])
          .toBe(actualContainer);
    });
  });

  describe('insertBefore', function() {
    it('should insert the container before the provided one', function() {
      var providedContainers = [];
      for (var i=0; i<5; ++i) {
        providedContainers.push(svc.insert());
      }

      var actualContainer = svc.insertBefore(providedContainers[2]);

      expect(dashboardSvc.containers.indexOf(actualContainer)).toBe(2);
      expect(dashboardSvc.containers.length).toBe(6);

      expect(explorerStateSvc.containers.all[actualContainer.model.id])
          .toBe(actualContainer);
    });
  });

  describe('remove', function() {
    it('should remove the container', function() {
      var providedContainers = [];
      for (var i=0; i<5; ++i) {
        providedContainers.push(svc.insert());
      }

      svc.remove(providedContainers[2]);

      expect(dashboardSvc.containers.indexOf(providedContainers[2]))
          .toBe(-1);
      expect(dashboardSvc.containers.length).toBe(4);

      expect(explorerStateSvc.containers.all[providedContainers[2]])
          .not.toBeDefined();
    });
  });

  describe('move', function() {
    var providedContainers;

    beforeEach(inject(function() {
      providedContainers = [];
      for (var i=0; i<5; ++i) {
        providedContainers.push(svc.insert());
      }
    }));

    describe('moveFirst', function() {

      it('should move the provided container to the first position', function() {
        expect(dashboardSvc.containers.indexOf(providedContainers[2])).toBe(2);
        expect(dashboardSvc.containers.length).toBe(5);

        svc.moveFirst(providedContainers[2]);

        expect(dashboardSvc.containers.indexOf(providedContainers[2])).toBe(0);
        expect(dashboardSvc.containers.length).toBe(5);
      });

      it('should move the selected container when none is provided', function() {
        expect(dashboardSvc.containers.indexOf(providedContainers[2])).toBe(2);
        expect(dashboardSvc.containers.length).toBe(5);

        dashboardSvc.selectContainer(providedContainers[2]);
        $rootScope.$apply();

        svc.moveFirst();

        expect(dashboardSvc.containers.indexOf(providedContainers[2])).toBe(0);
        expect(dashboardSvc.containers.length).toBe(5);
      });
    });

    describe('movePrevious', function() {

      it('should move the provided container to the previous position', function() {
        expect(dashboardSvc.containers.indexOf(providedContainers[2])).toBe(2);
        expect(dashboardSvc.containers.length).toBe(5);

        svc.movePrevious(providedContainers[2]);

        expect(dashboardSvc.containers.indexOf(providedContainers[2])).toBe(1);
        expect(dashboardSvc.containers.length).toBe(5);
      });

      it('should move the selected container when none is provided', function() {
        expect(dashboardSvc.containers.indexOf(providedContainers[2])).toBe(2);
        expect(dashboardSvc.containers.length).toBe(5);

        dashboardSvc.selectContainer(providedContainers[2]);
        $rootScope.$apply();

        svc.movePrevious();

        expect(dashboardSvc.containers.indexOf(providedContainers[2])).toBe(1);
        expect(dashboardSvc.containers.length).toBe(5);
      });
    });

    describe('moveNext', function() {

      it('should move the provided container to the previous position', function() {
        expect(dashboardSvc.containers.indexOf(providedContainers[2])).toBe(2);
        expect(dashboardSvc.containers.length).toBe(5);

        svc.moveNext(providedContainers[2]);

        expect(dashboardSvc.containers.indexOf(providedContainers[2])).toBe(3);
        expect(dashboardSvc.containers.length).toBe(5);
      });

      it('should move the selected container when none is provided', function() {
        expect(dashboardSvc.containers.indexOf(providedContainers[2])).toBe(2);
        expect(dashboardSvc.containers.length).toBe(5);

        dashboardSvc.selectContainer(providedContainers[2]);
        $rootScope.$apply();

        svc.moveNext();

        expect(dashboardSvc.containers.indexOf(providedContainers[2])).toBe(3);
        expect(dashboardSvc.containers.length).toBe(5);
      });
    });

    describe('moveLast', function() {

      it('should move the provided container to the previous position', function() {
        expect(dashboardSvc.containers.indexOf(providedContainers[2])).toBe(2);
        expect(dashboardSvc.containers.length).toBe(5);

        svc.moveLast(providedContainers[2]);

        expect(dashboardSvc.containers.indexOf(providedContainers[2])).toBe(4);
        expect(dashboardSvc.containers.length).toBe(5);
      });

      it('should move the selected container when none is provided', function() {
        expect(dashboardSvc.containers.indexOf(providedContainers[2])).toBe(2);
        expect(dashboardSvc.containers.length).toBe(5);

        dashboardSvc.selectContainer(providedContainers[2]);
        $rootScope.$apply();

        svc.moveLast();

        expect(dashboardSvc.containers.indexOf(providedContainers[2])).toBe(4);
        expect(dashboardSvc.containers.length).toBe(5);
      });
    });
  });
});
