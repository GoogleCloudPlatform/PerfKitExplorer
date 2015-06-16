// Karma configuration
// Generated on Tue Jan 06 2015 17:14:05 GMT-0800 (PST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',
    frameworks: ['jasmine', 'closure', 'jasmine-matchers'],

    files: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-aria/angular-aria.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-material/angular-material.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/codemirror/lib/codemirror.js',
      'bower_components/angular-ui-grid/ui-grid.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
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

    reporters: ['nested', 'html'],
    browsers: ['Chrome'],

    autoWatch: true,
    singleRun: false
  });
};
