var gulp = require('gulp');
var sass = require('gulp-sass');
var postCss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var imageMin = require('gulp-imagemin');
var php2html = require('gulp-php2html');
var cssNano = require('cssnano');
var rimraf = require('rimraf');

gulp.task('default', ['css']);

gulp.task('improve-css', ['css'], function() {
    return gulp.src('dist/css/*.css')
        .pipe(postCss([
            autoprefixer,
            cssNano({safe: true})
        ]))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('css', function() {
    return gulp.src('src/sass/*.sass')
        .pipe(sass({includePaths: ['node_modules/bootstrap-sass/assets/stylesheets']}).on('error', sass.logError))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('html', function(cb) {
    /* global process */
    rimraf.sync('dist/pages');
    return gulp.src(['src/pages/**/*.php', '!src/pages/**/_*.php'])
        .pipe(php2html({router: 'router.php'}).on('error', function(err) {
            console.log('%s', err);
            process.exit(1);
        }))
        .pipe(gulp.dest('dist/pages'));
});

gulp.task('images', function() {
    return gulp.src('img/**/*')
        .pipe(imageMin([
            require('imagemin-jpegoptim')({max: 88})
        ]))
        .pipe(imageMin([
            imageMin.gifsicle(),
            imageMin.jpegtran({progressive: true}),
            imageMin.optipng(),
            imageMin.svgo()
        ]))
        .pipe(gulp.dest('img'));
});

gulp.task('publish', ['default', 'images', 'html', 'improve-css']);
