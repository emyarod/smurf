'use strict';

import gulp from 'gulp';
import del from 'del';
import htmlmin from 'gulp-htmlmin';
import sass from 'gulp-sass';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import browserSync from 'browser-sync';
import nodemon from 'gulp-nodemon';

// clean out destination files and folders before rebuilding from source
gulp.task('clean', () => del(['app']));

// minify html
gulp.task('html', () => (
  gulp.src('src/**/*.html')
  .pipe(htmlmin({
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
  }))
  .pipe(gulp.dest('app'))
));

// compile and minify scss
gulp.task('sass', ['html'], () => (
  gulp.src('src/**/*.scss')
  .pipe(sass({ outputStyle: 'compressed' })
    .on('error', sass.logError))
  .pipe(gulp.dest('app'))
));

// transpile and minify js
gulp.task('js', ['sass'], () => (
  gulp.src('src/**/*.js')
  .pipe(babel())
  .pipe(uglify({
    mangle: true,
  }))
  .pipe(gulp.dest('app'))
));

// monitor for any changes and automatically restart the server
gulp.task('nodemon', ['js'], (cb) => {
  let started = false;
  return nodemon({
    script: 'app/app.js',
  }).on('start', () => {
    // to avoid nodemon being started multiple times
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('browser-sync', ['nodemon'], () => {
  browserSync.init(null, {
    proxy: 'http://localhost:5000',
    files: ['app/**/*.*'],
    browser: 'chrome',
    port: 8080,
  });
});

// gulp.task('build', ['html', 'sass', 'js']);

// run 'js' task before reloading browsers
gulp.task('watch', ['js'], browserSync.reload);

gulp.task('default', ['clean', 'browser-sync'], () => {
  // monitor for any changes and automatically refresh browser
  gulp.watch('src/**/*.*', ['watch']);
});
