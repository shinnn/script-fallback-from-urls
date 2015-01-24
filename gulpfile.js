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
var banner = require('tiny-npm-license')(pkg);
var funName = toCamelCase(pkg.name);

gulp.task('lint', function() {
  gulp.src('{,src/}*.js')
    .pipe($.jscs(pkg.jscsConfig))
    .pipe($.jshint())
    .pipe($.jshint.reporter(stylish))
    .pipe($.jshint.reporter('fail'));
  gulp.src('*.json')
    .pipe($.jsonlint())
    .pipe($.jsonlint.reporter());
});

gulp.task('clean', rimraf.bind(null, 'dist'));

gulp.task('build', ['lint', 'clean'], function() {
  return mergeStream(
    gulp.src('src/*.js')
      .pipe($.header(banner + '!function() {\n'))
      .pipe($.footer('\nwindow.' + funName + ' = ' + funName + ';\n}();\n'))
      .pipe($.rename(bower.main)),
    gulp.src('src/*.js')
      .pipe($.header(banner))
      .pipe($.footer('\nmodule.exports = ' + funName + ';\n'))
      .pipe($.rename(pkg.main))
  )
    .pipe($.size({showFiles: true}))
    .pipe(gulp.dest(''));
});

gulp.task('test', ['build'], function(cb) {
  exec('node test.js', function(err, stderr, stdout) {
    process.stdout.write(stderr);
    process.stderr.write(stdout);
    cb(err);
  });
});

gulp.task('watch', function() {
  gulp.watch('{,src/}*.js', ['test']);
  gulp.watch('{*.json,.jshintrc}', ['lint']);
});

gulp.task('default', ['test', 'watch']);
