var gulp = require('gulp');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var imagemin = require("gulp-imagemin");
var newer = require('gulp-newer');
var php2html = require('gulp-php2html');

gulp.task('default', ['scripts', 'css', 'images', 'fonts', 'html']);

gulp.task('scripts', function () {
    return gulp.src('src/coffee/*.coffee')
        .pipe(concat('landing.js'))
        .pipe(coffee())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('css', function () {
    return gulp.src(['src/sass/*.sass'])
        .pipe(sass({includePaths:['bower_components/bootstrap-sass/assets/stylesheets']}).on('error', sass.logError))
        .pipe(postcss([require('postcss-flexibility'), autoprefixer({browsers: ['last 3 versions'], cascade: false})]))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('html', function () {
    return gulp.src(['src/index.php'])
        .pipe(php2html())
        .pipe(gulp.dest('./'));
});

gulp.task('images', function () {
    return gulp.src('src/img/**/*')
        .pipe(newer('dist/img'))
        .pipe(imagemin({
            progressive: true,
            use: [require('imagemin-jpegoptim')({max: 90})]
        }))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('fonts', function () {
    return gulp.src(['src/fonts/*', 'bower_components/bootstrap-sass/assets/fonts/bootstrap/*'])
        .pipe(newer('dist/fonts'))
        .pipe(gulp.dest('dist/fonts'))
});