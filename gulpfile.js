var gulp = require('gulp');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var postCss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var imageMin = require("gulp-imagemin");
var newer = require('gulp-newer');
var php2html = require('gulp-php2html');
var cache = require('gulp-cached');
var flexibility = require('postcss-flexibility');
var cssNano = require('cssnano');

//Components
var postCssHtml = require('gulp-html-postcss');
var htmlMin = require('gulp-htmlmin');

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
        .pipe(htmlMin({
            removeComments: true,
            preventAttributesEscaping: true,
            collapseWhitespace: true,
            minifyJS: true,
            minifyCSS: true
        }))
        .pipe(gulp.dest('bower_components'));
    return gulp.src('dist/components/*-*.html')
        .pipe(htmlMin({
            removeComments: true,
            preventAttributesEscaping: true,
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            minifyJS: true
        }))
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

gulp.task('html', ['render-html'], function (cb) {
    var exec = require('child_process').exec;
    return exec('php typograph.php', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('render-html', ['images'], function () {
    return gulp.src(['src/pages/**/*.php'])
        .pipe(php2html().on('error', function (err) {
            console.log('%s', err);
            process.exit(1);
        }))
        .pipe(gulp.dest('dist/pages'));
});

gulp.task('images', function () {
    return gulp.src('src/img/**/*')
        .pipe(newer('dist/img'))
        .pipe(imageMin([
            require('imagemin-jpegoptim')({max: 88})
        ]))
        .pipe(imageMin([
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