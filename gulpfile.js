const gulp = require('gulp');
const sass = require('gulp-sass');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

gulp.task('styles', function () {
  return gulp
    .src('./styles/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest(path.join(__dirname, 'dist/css')));
});

gulp.task('copy', function () {
  return gulp
    .src('./src/**/*.html')
    .pipe(gulp.dest(path.join(__dirname, 'dist')));
});

gulp.task('webpack', function (done) {
  // Define your webpack build configuration here
  const webpack = require('webpack');
  const webpackConfig = require('./webpack.config.js');

  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      done();
      return;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
      console.error(info.errors);
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }

    done();
  });
});

gulp.task('tslint', function () {
  // Define tslint configuration and options here
  const tslint = require('gulp-tslint');
  const tslintConfig = require('./tslint.json');

  return gulp
    .src(['./src/**/*.ts', './src/**/*.tsx'])
    .pipe(tslint(tslintConfig))
    .pipe(tslint.report());
});

gulp.task('clean', function () {
  // Define your clean logic here, for example, to delete files in the 'dist' folder
  const del = require('del');
  return del(['dist/**/*']);
});

gulp.task('build', gulp.series('clean', 'webpack', 'styles', 'copy', 'tslint'));

gulp.task('package', gulp.series('build', function () {
  // Additional tasks to run after the build is complete
  // You can add more tasks here if needed
}));

gulp.task('default', gulp.series('package'));

gulp.task('dev', gulp.series('default', function () {
  // Watch for changes and trigger the 'package' task when changes occur
  gulp.watch(['./src/**/*.*', './styles/**/*.scss'], gulp.series('package'));
}));

gulp.task('analyze-bundle', function () {
  return gulp.src('./dist/*.js').pipe(BundleAnalyzerPlugin());
});