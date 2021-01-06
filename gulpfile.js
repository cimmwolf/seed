/* eslint-disable no-console */
const gulp = require('gulp')
const sass = require('gulp-sass')
const postCss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const imageMin = require('gulp-imagemin')
const php2html = require('gulp-php2html')
const cssNano = require('cssnano')
const rimraf = require('rimraf')

gulp.task('improve-css', ['css'], () => {
  return gulp.src('dist/css/*.css')
    .pipe(postCss([
      autoprefixer,
      cssNano({ safe: true }),
    ]))
    .pipe(gulp.dest('dist/css'))
})

gulp.task('css', () => {
  return gulp.src('src/sass/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'))
})

gulp.task('html', () => {
  rimraf.sync('dist/pages')
  return gulp.src(['src/pages/**/*.php', '!src/pages/**/_*.php'])
    .pipe(php2html({ router: 'router.php' }).on('error', function (err) {
      console.log('%s', err)
      process.exit(1)
    }))
    .pipe(gulp.dest('dist/pages'))
})

gulp.task('images', () => {
  return gulp.src('img/**/*')
    .pipe(imageMin([
      require('imagemin-jpegoptim')({ max: 88 }),
    ]))
    .pipe(imageMin([
      imageMin.gifsicle(),
      imageMin.mozjpeg({ progressive: true }),
      imageMin.optipng(),
      imageMin.svgo(),
    ]))
    .pipe(gulp.dest('img'))
})

gulp.task('publish', ['images', 'html', 'improve-css'])

gulp.task('watch', ['css'], () => {
  gulp.watch('src/sass/**/*.sass', ['css'])
})
