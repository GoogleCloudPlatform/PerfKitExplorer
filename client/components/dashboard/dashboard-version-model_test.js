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
 * @fileoverview Tests for the dashboardVersion service.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.perfkit.explorer.application.module');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardVersionModel');


describe('dashboardVersionModel', function() {
  var explorer = p3rf.perfkit.explorer;
  var DashboardVersionModel =
      explorer.components.dashboard.DashboardVersionModel;

  it('should initialize the model to defaults.',
      function() {
        var model = new DashboardVersionModel();

        expect(model.version).toBe('');
        expect(model.verify).toBeNull();
        expect(model.update).toBeNull();
      }
  );

  it('should initialize the model to provided values in the constructor.',
      function() {
        var expectedVersion = {
          version: 'TEST',
          verify: function(dashboard) { return true; },
          update: function(dashboard) { return; }};

        model = new DashboardVersionModel(
            expectedVersion.version,
            expectedVersion.verify,
            expectedVersion.update);

        expect(model.version).toEqual(expectedVersion.version);
        expect(model.verify).toEqual(expectedVersion.verify);
        expect(model.update).toEqual(expectedVersion.update);
      }
  );
});
