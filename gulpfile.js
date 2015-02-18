var gulp = require('gulp');

var closureCompiler = require('gulp-closure-compiler');
var minifyHtml = require('gulp-minify-html');
var ngHtml2Js = require('gulp-ng-html2js');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('default', function() {

  gulp.src([
      'client/**/*.js', '!client/**/*_test.js', '!client/karma.conf.js',
      'lib/closure-library/closure/goog/**/*.js',
      '!lib/closure-library/closure/goog/**/*_test.js'])
    .pipe(closureCompiler({
      compilerPath: 'bin/closure-compiler.jar',
      fileName: 'client/perfkit_scripts.js',
      compilerFlags: {
        angular_pass: true,
        compilation_level: 'WHITESPACE_ONLY',
        language_in: 'ECMASCRIPT5',
        manage_closure_dependencies: true,
        only_closure_dependencies: true,
        process_closure_primitives: true,
        closure_entry_point: 'p3rf.perfkit.explorer.application.module'
      }
    }))
    .pipe(gulp.dest('deploy'));

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

  gulp.src('client/**/*.json')
    .pipe(gulp.dest('deploy/client'));

});