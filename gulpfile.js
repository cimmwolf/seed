import php2html from 'gulp-php2html'
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin'
import gulp from 'gulp'
import cssNano from 'cssnano'
import postCss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);

import { rimrafSync } from 'rimraf'

function improveCss () {
  return gulp.src('dist/css/*.css')
    .pipe(postCss([
      autoprefixer,
      cssNano({ safe: true }),
    ]))
    .pipe(gulp.dest('dist/css'))
}

function css () {
  return gulp.src('src/sass/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'))
}

function html () {
  rimrafSync('dist/pages')
  return gulp.src(['src/pages/**/*.php', '!src/pages/**/_*.php'])
    .pipe(php2html({ router: 'router.php' }).on('error', function (err) {
      console.log('%s', err)
      process.exit(1)
    }))
    .pipe(gulp.dest('dist/pages'))
}

function images () {
  return gulp.src('img/**/*')
    .pipe(imagemin([
      gifsicle(),
      mozjpeg({ quality: 88, progressive: true }),
      optipng(),
      svgo(),
    ]))
    .pipe(gulp.dest('img'))
}

export const publish = gulp.series(images, html, css, improveCss)

export const watch = function () {
  gulp.watch('src/sass/**/*.sass', css)
}
