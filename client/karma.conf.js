// Karma configuration
// Generated on Tue Jan 06 2015 17:14:05 GMT-0800 (PST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',
    frameworks: ['jasmine', 'closure'],

    files: [
      'third_party/js/jquery/jquery.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-aria/angular-aria.js',
      'node_modules/angular-animate/angular-animate.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'third_party/js/bootstrap-ui/bootstrap-ui.js',
      'third_party/js/codemirror/codemirror.js',
      'third_party/js/uiGrid/ui-grid.js',
      'node_modules/angular-material/angular-material.js',
      'third_party/js/jsapi/jsapi.js',
      // Compiled Product Code
      'deploy/client/perfkit_scripts.js',
      // Tests Code
      'test/js/globals.js',
      {pattern: 'client/**/*_test.js'},
      // Uncompiled Product Code
      {pattern: 'client/**/*!(_test).js', included: false},
      // HTML Templates
      {pattern: 'client/**/*.html'},
      // Closure Deps
      {pattern: 'lib/closure-library/closure/goog/deps.js', included: false, served: false},
      {pattern: 'lib/closure-library/closure/goog/**/*.js', included: false}
    ],

    preprocessors: {
      // HTML Templates
      'client/**/*.html': ['html2js'],
      'lib/closure-library/closure/goog/deps.js': ['closure-deps']
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/',
      prependPrefix: '/static/',
      moduleName: 'p3rf.perfkit.explorer.templates'
    },

    reporters: ['progress', 'html'],
    browsers: ['Chrome'],

    autoWatch: true,
    singleRun: false
  });
};
