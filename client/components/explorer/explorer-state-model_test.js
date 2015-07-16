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
 * @fileoverview Tests for ExplorerStateModel, which encapsulates the list
 * and selection properties for Explorer.
 *
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerStateModel');


fdescribe('ExplorerStateModel', function() {
  var $rootScope, $state;
  var errorSvc;

  const explorer = p3rf.perfkit.explorer;
  const ExplorerStateModel = explorer.components.explorer.ExplorerStateModel;

  beforeEach(module('explorer'));

  beforeEach(inject(function(_$rootScope_, _$state_, errorService) {
    $rootScope = _$rootScope_;
    $state = _$state_;
    errorSvc = errorService;
  }));

  describe('property', function() {
    var expectedModel;
    var expectedStateName = 'widget';

    var item1 = {model: {id: '1', title: 'item 1'}};
    var item2 = {model: {id: '2', title: 'item 2'}};

    beforeEach(inject(function() {
      expectedModel = new ExplorerStateModel($state, errorSvc, expectedStateName);

      expectedModel.all[item1.model.id] = item1;
      expectedModel.all[item2.model.id] = item2;
    }));

    describe('add', function() {
      var item3 = {model: {id: '3', title: 'item 3'}};

      it('should add an item to the .all collection', function() {
        expectedModel.add(item3);

        expect(expectedModel.all[item3.model.id]).toEqual(item3);
      });

      it('should replace an item if the id already exists', function() {
        expect(Object.keys(expectedModel.all).length).toEqual(2);

        var item2a = {model: {id: item2.model.id, title: 'item 3a'}};
        expectedModel.add(item2a);

        expect(Object.keys(expectedModel.all).length).toEqual(2);
        expect(expectedModel.all[item2.model.id]).toEqual(item2a);
      });

      it('should log an error if an invalid item is provided', function() {
        spyOn(errorSvc, 'addError');

        expectedModel.add('invalid');

        expect(errorSvc.addError).toHaveBeenCalled();
      });

      it('should log an error if a NULL id is provided', function() {
        spyOn(errorSvc, 'addError');

        expectedModel.add({model: {id: null}});

        expect(errorSvc.addError).toHaveBeenCalled();
      });
    });

    describe('selectedId', function() {
      it('should return null by default', function() {
        expect(expectedModel.selectedId).toBeNull();
      });

      it('should return the state param', function() {
        var params = {};
        params[expectedStateName] = item1.model.id;

        $state.go('explorer-dashboard-edit', params);
        $rootScope.$apply();

        expect(expectedModel.selectedId).toEqual(item1.model.id);
      });
    });

    describe('selectedIdIsValid', function() {
      it('should return true if no id is provided', function() {
        expect(expectedModel.selectedId).toBeNull();
        expect(expectedModel.selectedIdIsValid).toBeFalse();
      });

      it('should return true if the id exists', function() {
        var params = {};
        params[expectedStateName] = item1.model.id;

        $state.go('explorer-dashboard-edit', params);
        $rootScope.$apply();

        expect(expectedModel.selectedIdIsValid).toBeTrue();
      });

      it('should return false if the id does not exists', function() {
        var params = {};
        params[expectedStateName] = 'invalid';

        $state.go('explorer-dashboard-edit', params);
        $rootScope.$apply();

        expect(expectedModel.selectedIdIsValid).toBeFalse();
      });
    });

    describe('selected', function() {
      it('should return null by default', function() {
        expect(expectedModel.selected).toBeNull();
      });

      it('should return null when an invalid id is provided', function() {
        var params = {};
        params[expectedStateName] = 'invalid';

        $state.go('explorer-dashboard-edit', params);
        $rootScope.$apply();

        expect(expectedModel.selected).toBeNull();
      });

      it('should return the object when a valid id is provided', function() {
        var params = {};
        params[expectedStateName] = item1.model.id;

        $state.go('explorer-dashboard-edit', params);
        $rootScope.$apply();

        expect(expectedModel.selected).toEqual(item1);
      });
    });
  });

});
