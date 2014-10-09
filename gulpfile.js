/*jshint unused:true */
'use strict';

var exec = require('child_process').exec;

var $ = require('gulp-load-plugins')();
var gulp = require('gulp');
var mergeStream = require('merge-stream');
var rimraf = require('rimraf');
var stylish = require('jshint-stylish');
var toCamelCase = require('to-camel-case');

var pkg = require('./package.json');
var bower = require('./bower.json');
var funName = toCamelCase(pkg.name);

var banner = [
  '/*!',
  ' * <%= pkg.name %>.js | MIT (c) Shinnosuke Watanabe',
  ' * <%= pkg.homepage %>',
  '*/\n'
].join('\n');

gulp.task('lint', function() {
  gulp.src(['{,src/}*.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter(stylish))
    .pipe($.jscs('.jscs.json'));
  gulp.src('*.json')
    .pipe($.jsonlint())
    .pipe($.jsonlint.reporter());
});

gulp.task('clean', rimraf.bind(null, 'dist'));

gulp.task('build', ['lint', 'clean'], function() {
  return mergeStream(
    gulp.src(['src/*.js'])
      .pipe($.header(banner + '!function() {\n', {pkg: pkg}))
      .pipe($.footer('\nwindow.<%= funName %> = <%= funName %>;\n}();\n', {
        funName: funName
      }))
      .pipe($.rename(bower.main))
      .pipe(gulp.dest('')),
    gulp.src(['src/*.js'])
      .pipe($.header(banner, {pkg: pkg}))
      .pipe($.footer('\nmodule.exports = <%= funName %>;\n', {funName: funName}))
      .pipe($.rename(pkg.main))
      .pipe(gulp.dest(''))
  );
});

gulp.task('test', ['build'], function(cb) {
  exec('node test.js', function(err, stderr, stdout) {
    console.log(stderr);
    console.log(stdout);
    cb(err);
  });
});

gulp.task('watch', function() {
  gulp.watch(['{,src/}*.js'], ['test']);
  gulp.watch(['*.json', '.jshintrc'], ['lint']);
});

gulp.task('default', ['test', 'watch']);
