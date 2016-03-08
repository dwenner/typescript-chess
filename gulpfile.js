'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-tsc');
var ts = require('gulp-typescript');

var path = {
    style: 'style/',
    app: 'app',
    scss: "**/*.scss",
    typescript: '*.ts',
    base: '.',
    
    
};

var tsOptions = ts.createProject('./tsconfig.json');

gulp.task('sass', function () {
    var cssPath = path.style + path.scss
    return gulp.src(cssPath)
        //.pipe(watch(cssPath))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.style));
});

gulp.task('typescript', function () {
    return gulp.src([path.typescript, 'typings/browser/**/*.ts'],{ base: path.base })
        .pipe(sourcemaps.init())
        .pipe(ts(tsOptions))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.app));
});

gulp.task('default', ['typescript','sass']);