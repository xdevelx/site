'use strict'

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    csscomb = require('gulp-csscomb'),
    csso = require('gulp-csso'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    mqpacker = require('css-mqpacker'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore'),
    del = require('del');


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
    img: 'app/img/*.{jpg,png,gif,svg}',
    icons: 'app/img/icons/*.svg',
    fonts: 'app/fonts/**/*.{woff,woff2}'
  },
  clean: ['build/**/*']
};


// Setting up browserSync
var serverConfig = {
  server: 'dist/',
    notify: false,
    open: true,
    cors: true,
    ui: false
};

gulp.task('serve', function () {
  browserSync.init(serverConfig);

  watch([projectPath.app.style], function(event, cb) {
    gulp.start('style');
  });
  watch([projectPath.app.html], function(event, cb) {
    gulp.start('html:update');
  });
});


// Task for compiling style.scss files to the style.css
gulp.task('style', function() {
  return gulp.src(projectPath.app.style)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 3 versions']
      }),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(csscomb())
    .pipe(gulp.dest(projectPath.dist.css))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(projectPath.dist.css))
    .pipe(browserSync.reload({stream: true}));
});


// Task for beautify sass files in app dir
gulp.task('beautify', function () {
  return gulp.src(projectPath.app.style)
    .pipe(csscomb())
    .pipe(gulp.dest('app/sass/'));
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


// Copy *.html in dist and reload
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
