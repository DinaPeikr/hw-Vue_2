'use strict'
/****************************************************************************************************/
//MODULES REQUIRE
/****************************************************************************************************/
import gulp from 'gulp'
import less from 'gulp-less'
import postcss from 'gulp-postcss'
import csso from 'postcss-csso'
import customProperties from 'postcss-custom-properties'
import apply from 'postcss-apply'
import postcssNesting from 'postcss-nesting'
import postcssNested from 'postcss-nested'
import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'
import mqp from 'css-mqpacker'
import gcmq from 'gulp-group-css-media-queries'
import uglify from 'gulp-uglify'
import sourcemaps from 'gulp-sourcemaps'
import newer from 'gulp-newer'
import debug from 'gulp-debug'
import gulpIf from 'gulp-if'
import imagemin from 'gulp-imagemin'
import svgmin from 'gulp-svgmin'
import svgSymbols from 'gulp-svg-symbols'
import smushit from 'gulp-smushit'
import del from 'del'
import mainBowerFiles from 'main-bower-files'
import flatten from 'gulp-flatten'
import { create } from 'browser-sync'
import remember from 'gulp-remember'
import cached from 'gulp-cached'
import babel from 'gulp-babel'
import path from 'path'
import webpack from 'webpack'
import gulpwebpack from 'webpack-stream'
import plumber from 'gulp-plumber'
import fileinclude from 'gulp-file-include'

const browserSync = create()
/****************************************************************************************************/
//DEV OR PRODUCTION
/****************************************************************************************************/
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
/*Чтобы вывести продакшен версию нужно в терминале ввести
  NODE_ENV=production gulp build
*/
/****************************************************************************************************/
//PATHS AND SETTINGS
/****************************************************************************************************/
const cms = {
  modx: {
    html: 'build/',
    css: 'build/assets/css/',
    js: 'build/assets/js/',
    img: 'build/assets/',
    libs: 'build/assets/libs/',
    fonts: 'build/assets/fonts/'
  },
  wordpress:{
    html: 'build/',
    css: 'build/css/',
    js: 'build/js/',
    img: 'build/',
    libs: 'build/libs/',
    fonts: 'build/fonts/'
  }
}
/****************************************************************************************************/
//HTML task
/****************************************************************************************************/
gulp.task('html', () => {
  return gulp.src('src/*.html', {since: gulp.lastRun('html')})
    .pipe(plumber())
    .pipe(fileinclude())
    .pipe(gulp.dest(cms.modx.html))
})

/****************************************************************************************************/
//HTML templates task
/****************************************************************************************************/
gulp.task('html:templates', () => {
  return gulp.src('src/*.html')
    .pipe(plumber())
    .pipe(fileinclude())
    .pipe(gulp.dest(cms.modx.html))
})
/****************************************************************************************************/
//PHP task
/****************************************************************************************************/
gulp.task('php', () => {
    return gulp.src('src/*.php')
        .pipe(plumber())
        .pipe(gulp.dest(cms.modx.html))
})
/****************************************************************************************************/
//LESS task
/****************************************************************************************************/
gulp.task('less', () => {
    return gulp.src('src/precss/**/*.less')
        .pipe(plumber())
        //.pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(less())
        //.pipe(gulpIf(isDevelopment, sourcemaps.write('.')))
        //.pipe(gulpIf(isDevelopment, gulp.dest(cms.modx.css)))
        .pipe(gulpIf(isDevelopment, gulp.dest('src/css')))
})

/****************************************************************************************************/
//CSS task
/****************************************************************************************************/

gulp.task('css', () => {
  let processors = [
    postcssImport({path: ['src/css']}),
    customProperties,
    apply,
    postcssNesting,
    postcssNested,
    autoprefixer({cascade: false}),
    mqp({sort: true})
  ]
  return gulp.src('src/css/styles.css')
    .pipe(plumber())
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(postcss(processors))
    //.pipe(gcmq())
    .pipe(gulpIf(!isDevelopment, postcss([csso({restructure: false, debug: true})])))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest(cms.modx.css))
})
/****************************************************************************************************/
//JS task
/****************************************************************************************************/
gulp.task('js', () => {
  return gulp.src('src/js/scripts.js')
    .pipe(plumber())
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(gulpwebpack(require('./webpack.config.js'), webpack))
    .pipe(gulpIf(!isDevelopment, uglify()))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest(cms.modx.js))
})
/****************************************************************************************************/
//LIBS task
/****************************************************************************************************/
gulp.task('libs', () => {
  return gulp.src(mainBowerFiles(
    {
      'overrides': {
        'jquery': {
          'main': 'dist/jquery.min.js'
        },
        'svg4everybody': {
          'main': 'dist/svg4everybody.min.js'
        },
        'slick-carousel': {
          'main': [
            "slick/slick.js"
          ]
        }
      }
    }
  ), {base: './src/libs'})
    .pipe(flatten({includeParents: 1}))
    .pipe(newer(cms.modx.libs))
    .pipe(gulp.dest(cms.modx.libs))
})
/****************************************************************************************************/
//MY LIBS task
/****************************************************************************************************/

gulp.task('mylibs', () => {
  return gulp.src('src/libs/mylibs/**/*.*')
    .pipe(flatten({includeParents: 1}))
    .pipe(gulp.dest(cms.modx.libs))
})
/****************************************************************************************************/
//FONTS task
/****************************************************************************************************/
gulp.task('fonts', () => {
    return gulp.src('src/fonts/**/*.*')
        .pipe(newer(cms.modx.fonts))
        .pipe(gulp.dest(cms.modx.fonts))
})
/****************************************************************************************************/
//IMG task (jpg,png,gif)
/****************************************************************************************************/
gulp.task('img', () => {
    return gulp.src(['src/img/**/*.{jpg,png,gif}', 'src/images/**/*.{jpg,png,gif}'], {base: 'src'})
        .pipe(newer(cms.modx.img))
        //.pipe(gulpIf(!isDevelopment, imagemin({progressive: true})))
         .pipe(gulpIf(!isDevelopment, smushit({verbose: true})))
        .pipe(gulpIf(isDevelopment, gulp.symlink(cms.modx.img), gulp.dest(cms.modx.img)))
})
/****************************************************************************************************/
//SVG task
/****************************************************************************************************/
gulp.task('svg', () => {
    return gulp.src('src/img/svg/**/*.svg', {base: 'src'})
        .pipe(newer(cms.modx.img))
        .pipe(gulpIf(!isDevelopment, gulp.dest(cms.modx.img), gulp.symlink(cms.modx.img)))
})
/****************************************************************************************************/
//SVG sprite icons
/****************************************************************************************************/
gulp.task('svg:icons', () => {
  return gulp.src('src/img/svg/icons/*.svg')
    .pipe(cached('svg:icons'))
    .pipe(svgmin({
      plugins: [
        {removeEditorsNSData: true},
        {removeTitle: true}
      ]
    }))
    .pipe(remember('svg:icons'))
    .pipe(svgSymbols({
      templates: [
        'default-svg'
      ]
    }))
    .pipe(svgmin({
      plugins: [
        {cleanupIDs: false}
      ]
    }))
    .pipe(gulp.dest('src/img/svg'))
})
/****************************************************************************************************/
//DEL build directory
/****************************************************************************************************/
gulp.task('clean', () => del('build'))

/****************************************************************************************************/
//Copy favicon
/****************************************************************************************************/
gulp.task('favicon', () => {
    return gulp.src('src/favicon.ico')
        .pipe(gulpIf(!isDevelopment, gulp.dest(cms.modx.html), gulp.symlink(cms.modx.html)))
})
/****************************************************************************************************/
//WATCHERS
/****************************************************************************************************/
gulp.task('watch', () => {
  gulp.watch('src/*.html', gulp.series('html')).on('unlink', function (filepath) {
    let filePathFromSrc = path.relative(path.resolve('src/'), filepath)
    let destFilePath = path.resolve(cms.modx.html, filePathFromSrc)
    del.sync(destFilePath)
  })
  gulp.watch('src/templates/*.html', gulp.series('html:templates'))
  gulp.watch(`${cms.modx.html}*.html`).on('change', browserSync.reload)
  gulp.watch('src/*.php', gulp.series('php'))
  gulp.watch('src/precss/**/*.less', gulp.series('less'))
  gulp.watch('src/css/*.css', gulp.series('css'))
  gulp.watch(`${cms.modx.css}styles.css`).on('change', browserSync.reload)
  gulp.watch('src/js/*.js', gulp.series('js'))
  gulp.watch(`${cms.modx.js}scripts.js`).on('change', browserSync.reload)
  gulp.watch('src/**/*.{jpg,png,gif}', gulp.series('img')).on('unlink', function (filepath) {
    let filePathFromSrc = path.relative(path.resolve('src/'), filepath)
    let destFilePath = path.resolve(cms.modx.img, filePathFromSrc)
    del.sync(destFilePath)
  })
  gulp.watch(['src/img/svg/*.svg', 'src/img/svg/icons/*.svg'], gulp.series('svg')).on('unlink', function (filepath) {
    let filePathFromSrc = path.relative(path.resolve('src/'), filepath)
    let destFilePath = path.resolve(cms.modx.img, filePathFromSrc)
    del.sync(destFilePath)
  })
  gulp.watch('src/img/svg/icons/*.svg', gulp.series('svg:icons')).on('unlink', function (filepath) {
    remember.forget('svg:icons', path.resolve(filepath))
    delete cached.caches['svg:icons'][path.resolve(filepath)]
  })
  gulp.watch('src/fonts/**/*.*', gulp.series('fonts')).on('unlink', function (filepath) {
    let filePathFromSrc = path.relative(path.resolve('src/fonts'), filepath)
    let destFilePath = path.resolve(cms.modx.fonts, filePathFromSrc)
    del.sync(destFilePath)
  })
})
/****************************************************************************************************/
//BROWSER-SYNC task
/****************************************************************************************************/
gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir:'./build'
    },
    open: true,
    notify: true
  })
})
/****************************************************************************************************/
//GLOBAL TASKS
/****************************************************************************************************/
gulp.task('build', gulp.series(gulp.parallel('html', 'php', 'less', 'css', 'js', 'libs', 'mylibs', 'favicon', 'fonts', 'img', 'svg:icons'), 'svg'))
gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')))
