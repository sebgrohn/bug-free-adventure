'use strict';

const gulp = require('gulp');
const clean = require('gulp-clean');
const util = require('gulp-util');
const babel = require('gulp-babel');
const webpack = require('webpack-stream');
const screeps = require('gulp-screeps');

const gulpDotFlatten = require('./libs/gulp-dot-flatten');

const webpackConfig = require('./webpack.config');
const babelConfig = {
  presets: ['es2015', 'es2016', 'es2017'],
  // cacheDirectory: true,
};

const credentials = require('./screeps-credentials');
const buildConfig = {
  bundle: false,
};

gulp.task('clean', function() {
  return gulp.src(['dist/tmp/', 'dist/'], { read: false, allowEmpty: true })
    .pipe(clean());
});

gulp.task('compile-bundled', ['clean'], function() {
  return gulp.src('./src/main.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('dist/'));
});

gulp.task('compile-babel', ['clean'], function() {
  return gulp.src('src/**/*.js')
    .pipe(babel(babelConfig))
    .pipe(gulp.dest('dist/tmp'));
});

gulp.task('compile-flattened', ['compile-babel'], function() {
  return gulp.src('dist/tmp/**/*.js')
      .pipe(gulpDotFlatten(0))
      .pipe(gulp.dest('dist/'));
});

gulp.task('compile', [buildConfig.bundle ? 'compile-bundled' : 'compile-flattened']);

gulp.task('deploy', ['compile'], function() {
  gulp.src('dist/*.js')
    .pipe(screeps(credentials));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['compile'])
    .on('all', function(event, path, stats) {
      console.log('');
      util.log(util.colors.green(`File ${path} was ${event}ed, running tasks...`));
    })
    .on('error', function() {
      util.log(util.colors.green('Error during compile tasks: aborting'));
    });
});
