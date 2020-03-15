/* eslint-disable no-console */
/* global require */
const gulp = require('gulp');
const sass = require('gulp-sass');
const postCss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const imageMin = require('gulp-imagemin');
const php2html = require('gulp-php2html');
const cssNano = require('cssnano');
const rimraf = require('rimraf');
const inject = require('gulp-inject-string');
const browserSync = require('browser-sync').create();
const fs = require('fs');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

gulp.task('improve-css', ['css'], () => {
  return gulp.src('dist/css/*.css')
      .pipe(postCss([
        autoprefixer,
        cssNano({safe: true}),
      ]))
      .pipe(gulp.dest('dist/css'));
});

gulp.task('css', () => {
  return gulp.src('src/sass/*.sass')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('dist/css'))
      .pipe(browserSync.stream());
});

gulp.task('html', () => {
  /* global process */
  rimraf.sync('dist/pages');
  return gulp.src(['src/pages/**/*.php', '!src/pages/**/_*.php'])
      .pipe(php2html({router: 'router.php'}).on('error', function(err) {
        console.log('%s', err);
        process.exit(1);
      }))
      .pipe(gulp.dest('dist/pages'));
});

gulp.task('images', () => {
  return gulp.src('img/**/*')
      .pipe(imageMin([
        require('imagemin-jpegoptim')({max: 88}),
      ]))
      .pipe(imageMin([
        imageMin.gifsicle(),
        imageMin.jpegtran({progressive: true}),
        imageMin.optipng(),
        imageMin.svgo(),
      ]))
      .pipe(gulp.dest('img'));
});

gulp.task('publish', ['default', 'images', 'html', 'improve-css'], () => {
  const pages = walk('dist/pages');
  const data = fs.readFileSync('polymer.json');
  const config = JSON.parse(data.toString());
  if (!config.fragments) {
    config.fragments = [];
  }
  pages.forEach((page) => {
    config.fragments.push(page);
  });

  config.entrypoint = 'dist/entrypoint.html';
  config.shell = 'dist/shell.js';
  fs.writeFileSync('polymer.json', JSON.stringify(config));
  fs.writeFileSync('dist/entrypoint.html', '<script type="module"></script>');
  fs.writeFileSync('dist/shell.js', '');
});

gulp.task('inject-babel', () => {
  const script = fs.readFileSync('build/es5/dist/entrypoint.html')
      .toString()
      .replace(/.*?<head>((?:.|\s)*?)<script>define.*/igm, '$1');

  return gulp.src('build/es5/dist/pages/**/*.html')
      .pipe(inject.after('<head>', script))
      .pipe(gulp.dest('build/es5/dist/pages'));
});
