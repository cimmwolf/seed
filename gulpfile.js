var gulp = require('gulp');
var sass = require('gulp-sass');
var postCss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var imageMin = require("gulp-imagemin");
var php2html = require('gulp-php2html');
var cssNano = require('cssnano');

//Components
var postCssHtml = require('gulp-html-postcss');
var htmlMin = require('gulp-htmlmin');

gulp.task('default', ['improve-css', 'html']);

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

gulp.task('html', ['render-html'], function(cb) {
    var exec = require('child_process').exec;
    return exec('php post-process.php', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('render-html', ['images'], function() {
    /* global process */
    return gulp.src(['src/pages/**/*.php'])
        .pipe(php2html().on('error', function(err) {
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


gulp.task('components', function() {
    return gulp.src('components/*-*.html')
        .pipe(htmlMin({
            removeComments: true,
            preventAttributesEscaping: true,
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            minifyJS: true
        }))
        .pipe(postCssHtml([
            autoprefixer,
            cssNano({safe: true})
        ]))
        .pipe(gulp.dest('components'));
});

gulp.task('publish', ['default', 'components', 'images'], function() {
    return gulp.src([
        'bower_components/iron-*/*.html',
        'bower_components/paper-*/*.html',
        'bower_components/google-*/*.html',
        'bower_components/gold-*/*.html',
        'bower_components/neon-*/*.html',
        'bower_components/platinum-*/*.html',
        'bower_components/polymer/*.html'
    ], {base: 'bower_components'})
        .pipe(htmlMin({
            removeComments: true,
            preventAttributesEscaping: true,
            collapseWhitespace: true,
            minifyJS: true,
            minifyCSS: true
        }))
        .pipe(gulp.dest('bower_components'));
});