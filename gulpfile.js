'use strict';

var gulp = require('gulp'),
    plugins = {
        concat: require('gulp-concat'), // для склеивания файлов
        //replace: require('gulp-replace'),
        //path: require('path'),
        //rename: require('gulp-rename'),
        //fs: require('fs'),
        //modifyCssUrls: require('gulp-modify-css-urls'), // https://www.npmjs.com/package/gulp-modify-css-urls
        concatCss: require('gulp-concat-css'), // используем плагин для конкатенации CSS файлов
        csso: require('gulp-csso'), // Minify CSS with CSSO https://www.npmjs.com/package/gulp-csso
        prefixer: require('gulp-autoprefixer'), // используем плагин для автоматического добавления вендорных префиксов
        gutil: require('gulp-util'), // Utility functions https://www.npmjs.com/package/gulp-util
        //uglify: require('gulp-uglify'), // используем плагин для сжатия JS файлов
        //include: require('gulp-include'),
        sass: require('gulp-sass'),
        sequence: require('gulp-sequence'), // используем плагин для последовательного/параллельного выполнения задач https://www.npmjs.com/package/gulp-sequence
        pug: require('gulp-pug'),
        sassGlob: require('gulp-sass-glob')
    },
    env = {
        dirRoot: process.cwd() + '/',
        prod: (plugins.gutil.env.prod),
        minify: (plugins.gutil.env.minify)
    },
    config = {};

plugins.gutil.log('Root =', env.dirRoot);
if (env.prod) {
    plugins.gutil.log(plugins.gutil.colors.red('Production'), 'build');
} else {
    plugins.gutil.log(plugins.gutil.colors.green('Dev'), 'build');
    plugins.gutil.log('Minify is', env.minify ? plugins.gutil.colors.green('ON') : plugins.gutil.colors.gray('OFF'));
}

require('./tasks')(gulp, plugins, config, env, env.dirRoot);

// general tasks
gulp.task('build', plugins.sequence('lpm-ui:build-all'));

/* gulp.task('watch', plugins.sequence(
    'ui:build'
    //,'watch:hints'
)); */

gulp.task('default', function () {
    plugins.gutil.log('This is the default task.');
    plugins.gutil.log('Enter `gulp build` command to start building process.');
});

// --------------------------

gulp.task('x:normalize', function(){
    var isProd = env.prod;
    return gulp.src(env.dirRoot + 'src2/bootstrap/normalize/style.scss')
        .pipe(plugins.sass({
            outputStyle: isProd ? 'compressed' : 'expanded',
            sourceComments: !isProd
        }).on('error', plugins.sass.logError))
        .pipe(plugins.concatCss('normalize.css'))
        .pipe(plugins.prefixer())
        .pipe(isProd || env.minify
            ? plugins.csso()
            : plugins.gutil.noop()
        )
        .pipe(gulp.dest(env.dirRoot + 'build2'))
    ;
});

// gulp.task('x:typography', function(){
//     return gulp.src(env.dirRoot + 'src2/typography/style.scss')
//         .pipe(plugins.sass({
//             outputStyle: env.prod ? 'compressed' : 'expanded',
//             sourceComments: !env.prod
//         }).on('error', plugins.sass.logError))
//         .pipe(plugins.concatCss('typography.css'))
//         .pipe(plugins.prefixer())
//         //.pipe(cssmin())
//         .pipe(env.prod || env.minify
//             ? plugins.csso()
//             : plugins.gutil.noop()
//         )
//         .pipe(gulp.dest(env.dirRoot + 'build2'))
//         ;
// });

gulp.task('x:styles', function(){
    return gulp.src([env.dirRoot + 'src2/bootstrap/**/style.scss', '!' + env.dirRoot + 'src2/bootstrap/normalize/style.scss'])
        .pipe(plugins.sass({
            outputStyle: env.prod ? 'compressed' : 'expanded',
            sourceComments: !env.prod
        }).on('error', plugins.sass.logError))
        .pipe(plugins.concatCss('styles.css'))
        .pipe(plugins.prefixer({
            browsers: 'last 3 versions'
        }))
        //.pipe(cssmin())
        .pipe(env.prod || env.minify
            ? plugins.csso()
            : plugins.gutil.noop()
        )
        .pipe(gulp.dest(env.dirRoot + 'build2'))
        ;
});

gulp.task('x:theme', function(){
    return gulp.src([env.dirRoot + 'src2/themes/one/one.scss'])
        .pipe(plugins.sass({
            outputStyle: env.prod ? 'compressed' : 'expanded',
            sourceComments: !env.prod
        }).on('error', plugins.sass.logError))
        .pipe(plugins.concatCss('theme.css'))
        .pipe(plugins.prefixer({
            browsers: 'last 3 versions'
        }))
        //.pipe(cssmin())
        .pipe(env.prod || env.minify
            ? plugins.csso()
            : plugins.gutil.noop()
        )
        .pipe(gulp.dest(env.dirRoot + 'build2'))
        ;
});

gulp.task('x:build-all', [
    'x:normalize',
    'x:styles'
], function(){
    var isProd = true; //env.prod;
    return gulp.src([
        env.dirRoot + 'build2/normalize.css',
        env.dirRoot + 'build2/styles.css'
    ])
        .pipe(plugins.concatCss('full.css'))
        .pipe(isProd || env.minify
            ? plugins.csso()
            : plugins.gutil.noop()
        )
        .pipe(gulp.dest(env.dirRoot + 'build2/'))
    ;
});

gulp.task('x:html', function(){
    gulp.src(env.dirRoot + 'src2/**/*.pug')
        .pipe(plugins.pug({
            pretty: true
        }))
        .pipe(gulp.dest(env.dirRoot + 'build2/'))
    ;
});

gulp.task('x:watch', ['x:build-all', 'x:html'], function(){
    gulp.watch(env.dirRoot + 'src2/**/*.scss', ['x:build-all']);
    gulp.watch(env.dirRoot + 'src2/**/*.pug', ['x:html']);
});