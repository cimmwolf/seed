/* eslint-disable no-console */
const { src, dest, series, watch } = require('gulp')

const sass = require('gulp-sass')(require('sass'))
const postCss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const imageMin = require('gulp-imagemin')
const php2html = require('gulp-php2html')
const cssNano = require('cssnano')
const rimraf = require('rimraf')

function improveCss () {
  return src('dist/css/*.css')
    .pipe(postCss([
      autoprefixer,
      cssNano({ safe: true }),
    ]))
    .pipe(dest('dist/css'))
}

function css () {
  return src('src/sass/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('dist/css'))
}

function html () {
  rimraf.sync('dist/pages')
  return src(['src/pages/**/*.php', '!src/pages/**/_*.php'])
    .pipe(php2html({ router: 'router.php' }).on('error', function (err) {
      console.log('%s', err)
      process.exit(1)
    }))
    .pipe(dest('dist/pages'))
}

function images () {
  return src('img/**/*')
    .pipe(imageMin([
      imageMin.gifsicle(),
      imageMin.mozjpeg({ quality: 90, progressive: true }),
      imageMin.optipng(),
      imageMin.svgo({
        plugins: [
          { removeViewBox: false },
          { removeDimensions: true }
        ]
      })
    ]))
    .pipe(dest('img'))
}

exports.publish = series(images, html, css, improveCss)

exports.watch = function () {
  watch('src/sass/**/*.sass', css)
}
