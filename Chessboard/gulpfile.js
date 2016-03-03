'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-tsc');

var path = {
    style: './style/',
    app: 'app',
    scss: "**/*.scss",
    typescript: '*.ts'
};

var tsOptions = {
    outDir: path.app,
    sourceMap: true,
    sourceRoot: path
};

gulp.task('sass', function () {
    return gulp.src(path.style + path.scss)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.style));
});

gulp.task('typescript', function () { //typescript not quite working in gulp for now.
    return gulp.src(path.typescript)
        .pipe(typescript(tsOptions))
        .pipe(gulp.dest(path.app));
});

gulp.task('default', function () {
    gulp.watch(path.stylePath + path.scss, ['sass']);
    //gulp.watch(path.typescript, ['typescript']);
});