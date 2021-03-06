'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    csscomb = require('gulp-csscomb'),
    csso = require('gulp-csso'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore'),
    del = require('del'),
    ghPages = require('gulp-gh-pages'),
    dateFormat = require('dateformat');


// Setting path to the main files
var projectPath = {
  dist: {
    html: 'dist/',
    css: 'dist/css/',
    js: 'dist/js/',
    img: 'dist/img/',
    fonts: 'dist/fonts/'
  },
  app: {
    html: 'app/*.html',
    style: 'app/sass/**/*.scss',
    js: 'app/js/**/*.js',
    img: 'app/img/**/*.{jpg,png,gif,svg}',
    icons: 'app/img/icons/*.svg',
    fonts: 'app/fonts/**/*.{woff,woff2}'
  }
};


// Setting up browserSync
var serverConfig = {
  server: 'dist/',
  notify: false,
  open: true
};

var buildDate = dateFormat(new Date(), 'yyyy-mm-dd H:MM');

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages({'force': true, 'message': 'Build from ' + buildDate}));
});

gulp.task('serve', function () {
  browserSync.init(serverConfig);

  watch([projectPath.app.style], ['style']);
  watch([projectPath.app.html], ['html:update']);
});


// Task for compiling style.scss files to the style.css
gulp.task('style', function() {
  return gulp.src(projectPath.app.style)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
    .pipe(gulp.dest(projectPath.dist.css))
    .pipe(csso())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(projectPath.dist.css))
    .pipe(browserSync.reload({stream: true}));
});

// Images optimization
gulp.task('images', function() {
  return gulp.src(projectPath.app.img)
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest(projectPath.dist.img));
});


// SVG optimization and making SVG-sprite
gulp.task('symbols', function() {
  return gulp.src(projectPath.app.icons)
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg:true
    }))
    .pipe(rename('symbols.svg'))
    .pipe(gulp.dest(projectPath.dist.img));
});


// Copy *.html in /dist
gulp.task('html:copy', function() {
  return gulp.src(projectPath.app.html)
    .pipe(gulp.dest(projectPath.dist.html))
});


// Update *.html
gulp.task('html:update', ['html:copy'], function(done) {
  browserSync.reload();
  done();
});


// Clean build dir
gulp.task('clean', function() {
  return del(projectPath.dist.html);
});


// Build project
gulp.task('build', function(fn) {
  runSequence('clean', 'copy', 'style', 'images', 'symbols', fn);
});

gulp.task('copy', function() {
  return gulp.src([
      projectPath.app.html,
      projectPath.app.js,
      projectPath.app.img,
      projectPath.app.fonts
    ], {
      base: './app/'
    })
    .pipe(gulp.dest(projectPath.dist.html));
});
