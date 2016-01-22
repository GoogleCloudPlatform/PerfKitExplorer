var gulp = require('gulp');

try {
  var gulpUtil = require('gulp-util');
  var closureCompiler = require('gulp-closure-compiler');
  var minifyHtml = require('gulp-minify-html');
  var ngHtml2Js = require('gulp-ng-html2js');
  var concat = require('gulp-concat');
  var uglify = require('gulp-uglify');
  var flatten = require('gulp-flatten');
} catch (e) {
  console.log(e.stack);
  console.error('Required module not found. Please re-run "npm install".');
  process.exit(1);
}


var jsSourceFiles = [
      'client/**/*.js', '!client/**/*_test.js', '!client/karma.conf.js',
      '!client/externs.js', '!client/externs/**/*.js',
      'lib/closure-library/closure/goog/**/*.js',
      '!lib/closure-library/closure/goog/**/*_test.js'];

gulp.task('default', ['prod']);

gulp.task('third_party', function() {
  gulp.src('third_party/py/**/*.*')
    .pipe(gulp.dest('deploy/server/third_party'));

  gulp.src('bower_components/jquery/dist/jquery.min.*')
      .pipe(gulp.dest('deploy/client/third_party/jquery'));

  /** Angular */
  gulp.src('bower_components/angular/angular.*')
    .pipe(gulp.dest('deploy/client/third_party/angular'));

  gulp.src('bower_components/angular-animate/angular-animate.*')
    .pipe(gulp.dest('deploy/client/third_party/angular'));

  gulp.src('bower_components/angular-aria/angular-aria.*')
    .pipe(gulp.dest('deploy/client/third_party/angular'));

  gulp.src('bower_components/angular-mocks/angular-mocks.*')
    .pipe(gulp.dest('deploy/client/third_party/angular'));

  gulp.src('bower_components/angular-material/angular-material.*')
    .pipe(gulp.dest('deploy/client/third_party/angular-material'));

  gulp.src('bower_components/angular-sanitize/angular-sanitize.*')
    .pipe(gulp.dest('deploy/client/third_party/angular'));

  /** Angular UI */
  gulp.src('bower_components/angular-bootstrap/ui-bootstrap-tpls*.js')
      .pipe(gulp.dest('deploy/client/third_party/bootstrap-ui'));

  gulp.src('bower_components/bootstrap-css-only/css/bootstrap.min.css')
      .pipe(gulp.dest('deploy/client/third_party/bootstrap-ui/css'));

  gulp.src('bower_components/bootstrap-css-only/fonts/*.*')
      .pipe(gulp.dest('deploy/client/third_party/bootstrap-ui/fonts'));

  gulp.src('bower_components/angular-ui-router/release/angular-ui-router*.js')
      .pipe(gulp.dest('deploy/client/third_party/angular-ui-router'));

  gulp.src('bower_components/angular-ui-grid/ui-grid.*')
      .pipe(gulp.dest('deploy/client/third_party/ui-grid'));

  /** Angular Markdown */
  gulp.src('bower_components/showdown/dist/**/*.js')
      .pipe(gulp.dest('deploy/client/third_party/showdown'));

  gulp.src('bower_components/ng-showdown/dist/**/*.js')
      .pipe(gulp.dest('deploy/client/third_party/showdown'));

  /** CodeMirror */
  gulp.src('bower_components/codemirror/lib/codemirror.*')
      .pipe(gulp.dest('deploy/client/third_party/codemirror'));

  gulp.src('bower_components/codemirror/mode/javascript/*.js')
      .pipe(gulp.dest('deploy/client/third_party/codemirror/mode/javascript'));

  gulp.src('bower_components/codemirror/mode/sql/*.js')
      .pipe(gulp.dest('deploy/client/third_party/codemirror/mode/sql'));
});

gulp.task('common', ['third_party'], function() {
  gulp.src(['*.yaml', '*.py'])
    .pipe(gulp.dest('deploy'));

  gulp.src('config/*.json')
    .pipe(gulp.dest('deploy/config'));

  gulp.src('server/**/*.py')
    .pipe(gulp.dest('deploy/server'));

  gulp.src('client/**/*.json')
    .pipe(gulp.dest('deploy/client'));

  gulp.src('client/**/*.css')
    .pipe(concat('perfkit_styles.css'))
    .pipe(gulp.dest('build'));
});

var closureCompilerConfig = {
  compilerPath: 'bin/closure-compiler.jar',
  fileName: 'build/perfkit_scripts.js',
  compilerFlags: {
    angular_pass: true,
    compilation_level: 'SIMPLE_OPTIMIZATIONS',
    formatting: 'PRETTY_PRINT',
    language_in: 'ECMASCRIPT6',
    language_out: 'ECMASCRIPT5_STRICT',
    manage_closure_dependencies: true,
    only_closure_dependencies: true,
    process_closure_primitives: true,
    warning_level: 'VERBOSE',
    jscomp_off: 'missingProperties',
    externs: [
      'client/externs.js',
      'client/externs/angular-1.4-http-promise_templated.js',
      'client/externs/angular-1.4.js',
      'client/externs/angular-1.4-q_templated.js',
      'client/externs/angular-ui-router.js',
      'client/externs/gviz-api.js',
      'client/externs/ui-bootstrap.js',
    ],
    closure_entry_point: 'p3rf.perfkit.explorer.application.module'
  }
};

var showClosureCompilerErrors = function(err) {
  // Add a line break in the compiler output so that the first
  // filename doesn't get munged with the generic error message.
  // This makes it easier for editors to jump to the right
  // location. Apply the fixup to the first line only (no /g
  // modifier).
  gulpUtil.log('***Compiler output:\n' +
      err.message.replace(/^(Command failed:)?\s*/, '$1\n'));
};

gulp.task('test', ['common'], function() {

  gulp.src(jsSourceFiles)
    .pipe(closureCompiler(closureCompilerConfig))
    .on('error', showClosureCompilerErrors)
    .pipe(gulp.dest('deploy'));

  gulp.src('server/**/*.html')
    .pipe(gulp.dest('deploy/server'));

  gulp.src('client/**/*.html')
    .pipe(ngHtml2Js({
        moduleName: 'p3rf.perfkit.explorer.templates',
        prefix: '/static/'
    }))
    .pipe(concat('perfkit_templates.js'))
    .pipe(gulp.dest('deploy/client'));
});


gulp.task('prod', ['common'], function() {

  gulp.src(jsSourceFiles)
    .pipe(closureCompiler(closureCompilerConfig))
    .on('error', showClosureCompilerErrors)
    .pipe(flatten())
    .pipe(gulp.dest('deploy/client'));

  gulp.src('server/**/*.html')
    .pipe(minifyHtml({
        empty: true,
        spare: true,
        quotes: true
    }))
    .pipe(gulp.dest('deploy/server'));

  gulp.src('client/**/*.html')
    .pipe(minifyHtml({
        empty: true,
        spare: true,
        quotes: true
    }))
    .pipe(ngHtml2Js({
        moduleName: 'p3rf.perfkit.explorer.templates',
        prefix: '/static/'
    }))
    .pipe(concat('perfkit_templates.js'))
    .pipe(uglify())
    .pipe(gulp.dest('deploy/client'));
});
