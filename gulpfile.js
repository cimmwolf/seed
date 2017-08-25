var gulp = require('gulp');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var postCss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var imageMin = require("gulp-imagemin");
var newer = require('gulp-newer');
var php2html = require('gulp-php2html');
var polyClean = require('polyclean');
var cache = require('gulp-cached');
var flexibility = require('postcss-flexibility');
var cssNano = require('cssnano');
var postCssHtml = require('gulp-html-postcss');
var removeHtmlComments = require('gulp-remove-html-comments');

gulp.task('default', ['components', 'coffee', 'css', 'images', 'fonts', 'html'], function () {
    gulp.src('dist/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
    gulp.src('dist/css/*.css')
        .pipe(postCss([
            flexibility,
            autoprefixer,
            cssNano({safe: true})
        ]))
        .pipe(gulp.dest('dist/css'));
    gulp.src([
        'bower_components/iron-*/*.html',
        'bower_components/paper-*/*.html',
        'bower_components/google-*/*.html',
        'bower_components/gold-*/*.html',
        'bower_components/neon-*/*.html',
        'bower_components/platinum-*/*.html',
        'bower_components/polymer/*.html'
    ], {base: 'bower_components'})
        .pipe(cache('components'))
        .pipe(removeHtmlComments())
        .pipe(polyClean.cleanCss())
        .pipe(polyClean.leftAlignJs())
        .pipe(polyClean.uglifyJs())
        .pipe(gulp.dest('bower_components'));
    return gulp.src('dist/components/*-*.html')
        .pipe(removeHtmlComments())
        .pipe(polyClean.leftAlignJs())
        .pipe(polyClean.uglifyJs())
        .pipe(postCssHtml([
            flexibility,
            autoprefixer,
            cssNano({safe: true})
        ]))
        .pipe(gulp.dest('dist/components'));
});

gulp.task('coffee', function () {
    return gulp.src('src/coffee/*.coffee')
        .pipe(coffee())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('css', function () {
    return gulp.src('src/sass/*.sass')
        .pipe(sass({includePaths: ['bower_components/bootstrap-sass/assets/stylesheets']}).on('error', sass.logError))
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
        .pipe(imageMin([
            require('imagemin-jpegoptim')({max: 90}),
            imageMin.gifsicle(),
            imageMin.jpegtran({progressive: true}),
            imageMin.optipng(),
            imageMin.svgo()
        ]))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('fonts', function () {
    return gulp.src(['src/fonts/*', 'bower_components/bootstrap-sass/assets/fonts/bootstrap/*'])
        .pipe(newer('dist/fonts'))
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('components', function () {
    return gulp.src('src/components/*')
        .pipe(gulp.dest('dist/components'))
});