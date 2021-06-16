import gulp from 'gulp';
import watch from 'gulp-watch';
import sassCompiler from 'gulp-dart-sass';
import sourcemaps from 'gulp-sourcemaps';
import tsCompiler from 'gulp-typescript';

const path = {
    style: 'style/',
    app: 'app',
    scss: "**/*.scss",
    lib: 'lib',
    typescript: '*.ts',
    base: '.',
    jQuery: 'node_modules/jquery/dist/**'
};

const tsProject = tsCompiler.createProject('./tsconfig.json');

const compileTs = () => {
    return gulp.src(path.typescript, { base: path.base })
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.app));
}

const compileSass = () => {
    const cssPath = path.style + path.scss
    return gulp.src(cssPath)
        .pipe(sourcemaps.init())
        .pipe(sassCompiler().on('error', sassCompiler.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.style));
}

const copyJquery = () => {
    return gulp.src(path.jQuery)
        .pipe(gulp.dest(path.lib, { base: path.base }));
}

const typescript = gulp.series(compileTs);
const sass = gulp.series(compileSass);
const defaultTasks = gulp.parallel(typescript, sass, copyJquery);

export {
    typescript,
    sass
}

export default defaultTasks;