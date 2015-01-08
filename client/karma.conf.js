// Karma configuration
// Generated on Tue Jan 06 2015 17:14:05 GMT-0800 (PST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',


    frameworks: ['jasmine', 'closure'],
    files: [
      'third_party/js/angularjs/angular.js',
      'third_party/js/angularjs/angular-mocks.js',
      'third_party/js/bootstrap-ui/bootstrap-ui.js',
      'third_party/js/codemirror/codemirror.js',
      'third_party/js/uiGrid/ui-grid.js',
      'third_party/js/jsapi/jsapi.js',
      'test/js/globals.js',
      // closure base
      {pattern: '../closure-library/closure/goog/base.js'},
      // included files - tests
      {pattern: 'client/**/*_test.js'},
      // these are only watched and served
      {pattern: 'client/**/*!(_test).js', included: false},
      // external deps
      {pattern: '../closure-library/closure/goog/deps.js', included: false, served: false},
      {pattern: '../closure-library/closure/goog/**/*.js', included: false}
    ],

    preprocessors: {
      'client/**/*_test.js': ['closure', 'closure-iit'],
      'client/**/*!(_test).js': ['closure'],
      '../closure-library/closure/goog/deps.js': ['closure-deps']
    },

    reporters: ['dots', 'html'],
    browsers: ['Chrome'],
    autoWatch: true,
    singleRun: false
  });

  // Load the plugin from the workspace.
  // You don't need this if you just install karma-closure through NPM.
  config.plugins.push(require('../third_party/js/karma-closure/plugin'));
};
