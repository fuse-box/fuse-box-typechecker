var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var merge = require('merge2');
var paths = require('./paths');
var runSequence = require('run-sequence');



/**
 * Create typescript project from tsconfig in "commonjs" output
 * 
 */
var tsProjectCJS = ts.createProject('./tsconfig.json', {
  typescript: require('typescript'),
  "declaration": true,
  target: 'es5',
  module: 'commonjs'
});




/**
 * Build project with current typescript project
 * 
 */
function build(tsProject, outputPath) {
  var tsResult = gulp.src(paths.dtsSrc.concat(paths.source))
    .pipe(plumber())
    .pipe(tsProject());
  return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done. 
      tsResult.dts.pipe(gulp.dest(outputPath)),
      tsResult.js.pipe(gulp.dest(outputPath))
    ])
    .pipe(gulp.dest(outputPath))
}



/**
 * Build with commonjs
 * 
 */
gulp.task('build-commonjs', function () {
  return build(tsProjectCJS, paths.output + 'commonjs');
});



/**
 * Build gulp task
 * Cleans up and rebuilds
 * 
 */
gulp.task('build', function (callback) {
  return runSequence(
    'clean', ['build-commonjs'],
    callback
  );
});

