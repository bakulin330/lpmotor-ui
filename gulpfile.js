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
        pug: require('gulp-pug')
    },
    env = {
        dirRoot: process.cwd() + '/',
        prod: (plugins.gutil.env.prod),
        minify: (plugins.gutil.env.minify),
        theme: 'one'
    },
    config = {};

plugins.gutil.log(plugins.gutil.colors.green('Theme'), '=', env.theme);
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

gulp.task('x:fonts', function(){
    return gulp.src(env.dirRoot + 'src2/themes/'+env.theme+'/fonts/**')
        .pipe(gulp.dest(env.dirRoot + 'build2/fonts'))
        ;
});

gulp.task('x:styles', function(){
    var isProd = true; // env.prod;
    return gulp.src(env.dirRoot + 'src2/themes/'+env.theme+'/theme.scss')
        .pipe(plugins.sass({
            outputStyle: isProd ? 'compressed' : 'expanded',
            sourceComments: !isProd
        }).on('error', plugins.sass.logError))
        .pipe(plugins.concatCss('full.css'))
        .pipe(plugins.prefixer({
            browsers: 'last 3 versions'
        }))
        //.pipe(cssmin())
        .pipe(isProd || env.minify
            ? plugins.csso()
            : plugins.gutil.noop()
        )
        .pipe(gulp.dest(env.dirRoot + 'build2'))
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

gulp.task('x:build-all', [
    'x:fonts',
    'x:styles',
    'x:html'
]);

gulp.task('x:watch', ['x:build-all'], function(){
    gulp.watch(env.dirRoot + 'src2/**/*.scss', ['x:styles']);
    gulp.watch(env.dirRoot + 'src2/**/*.pug', ['x:html']);
});