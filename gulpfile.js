var gulp = require('gulp');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var imagemin = require("gulp-imagemin");
var newer = require('gulp-newer');
var php2html = require('gulp-php2html');
var vulcanize = require('gulp-vulcanize');
var stylemod = require('gulp-style-modules');
var polyclean = require('polyclean');
var htmlmin = require('gulp-htmlmin');
var cache = require('gulp-cached');

gulp.task('default', ['components', 'scripts', 'css', 'images', 'fonts', 'html'], function () {
    gulp.src('dist/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
    gulp.src('dist/css/*.css')
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'));
    gulp.src([
        'bower_components/app-*/*.html',
        'bower_components/iron-*/*.html',
        'bower_components/paper-*/*.html',
        'bower_components/google-*/*.html',
        'bower_components/gold-*/*.html',
        'bower_components/neon-*/*.html',
        'bower_components/platinum-*/*.html',
        'bower_components/polymer/*.html',
        'dist/components/*.html'
    ], {base: './'})
        .pipe(cache('components'))
        .pipe(polyclean.cleanCss())
        .pipe(polyclean.leftAlignJs())
        .pipe(polyclean.uglifyJs())
        .pipe(htmlmin({removeComments: true}))
        .pipe(gulp.dest('./'));
});

gulp.task('scripts', ['coffee'], function () {
    return gulp.src(['bower_components/jquery/dist/jquery.js', 'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js'])
        .pipe(gulp.dest('dist/js'));
});

gulp.task('coffee', function () {
    return gulp.src('src/coffee/*.coffee')
        .pipe(coffee())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('css', function () {
    return gulp.src(['src/sass/*.sass'])
        .pipe(sass({includePaths: ['bower_components/bootstrap-sass/assets/stylesheets']}).on('error', sass.logError))
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
        .pipe(imagemin([
            require('imagemin-jpegoptim')({max: 90}),
            imagemin.gifsicle(),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng(),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('fonts', function () {
    return gulp.src(['src/fonts/*', 'bower_components/bootstrap-sass/assets/fonts/bootstrap/*'])
        .pipe(newer('dist/fonts'))
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('components', ['style-modules', 'js-modules', 'scripts'], function () {
    return gulp.src('src/components/*')
        .pipe(vulcanize({
            inlineScripts: true,
            inlineCss: true,
            stripComments: true,
            excludes: ['bower_components/', 'dist/components/']
        }))
        .pipe(gulp.dest('dist/components'))
});

gulp.task('style-modules', function () {
    var path = require('path');
    return gulp.src('src/sass/*.module.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(stylemod({
            filename: function (file) {
                return path.basename(file.path, path.extname(file.path));
            },
            moduleId: function (file) {
                return path.basename(file.path, path.extname(file.path));
            }
        }))
        .pipe(gulp.dest('dist/css-modules'));
});

gulp.task('js-modules', function () {
    return gulp.src('src/coffee/*.module.coffee')
        .pipe(coffee())
        .pipe(gulp.dest('dist/js-modules'));
});