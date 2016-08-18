'use strict';

import gulp from 'gulp';
import del from 'del';
import htmlmin from 'gulp-htmlmin';
import sass from 'gulp-sass';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';

// clean out destination files and folders before rebuilding from source
gulp.task('clean', () => del([
  'public/stylesheets',
  'routes',
  'views',
  './app.js',
]));

// minify html
gulp.task('html', ['clean'], () => (
  gulp.src('_src/**/*.hbs')
  .pipe(htmlmin({
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
  }))
  .pipe(gulp.dest('./'))
));

// compile and minify scss
gulp.task('sass', ['clean'], () => (
  gulp.src('_src/**/*.scss')
  .pipe(sass({ outputStyle: 'compressed' })
    .on('error', sass.logError))
  .pipe(gulp.dest('./'))
));

// transpile and minify js
gulp.task('js', ['clean'], () => (
  gulp.src('_src/**/*.js')
  .pipe(babel())
  .pipe(uglify({
    mangle: true,
  }))
  .pipe(gulp.dest('./'))
));

gulp.task('build', ['html', 'sass', 'js']);

gulp.task('default', ['build'], () => {
  // monitor for any changes and automatically rebuild
  // gulp.watch('_src/**/*.*', ['build']);
});
