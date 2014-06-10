/**
 * @fileoverview Tests for the dashboardVersion service.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.require('p3rf.dashkit.explorer.application.module');
goog.require('p3rf.dashkit.explorer.components.dashboard.DashboardVersionModel');


describe('dashboardVersionModel', function() {
  var explorer = p3rf.dashkit.explorer;
  var DashboardVersionModel =
      explorer.components.dashboard.DashboardVersionModel;

  it('should initialize the model to defaults.',
      function() {
        var model = new DashboardVersionModel();

        expect(model.version).toBe('');
        expect(model.verify).toBeNull;
        expect(model.update).toBeNull;
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
