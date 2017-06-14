'use strict';

var gulp = require('gulp'),
    sequence = require('gulp-sequence'), // используем плагин для последовательного/параллельного выполнения задач https://www.npmjs.com/package/gulp-sequence
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
        sass: require('gulp-sass')
    },
    env = {
        dirRoot : process.cwd() + '/',
        prod: (plugins.gutil.env.prod),
        minify: (plugins.gutil.env.minify)
    },
    dirRoot = process.cwd() + '/',
    buildRoot = dirRoot + 'build/';

plugins.gutil.log('Root =', dirRoot);
if (env.prod) {
    plugins.gutil.log(plugins.gutil.colors.red('Production'), 'build');
} else {
    plugins.gutil.log(plugins.gutil.colors.green('Dev'), 'build');

    if (env.minify) {
        plugins.gutil.log('Minify is', plugins.gutil.colors.green('ON'));
    } else {
        plugins.gutil.log('Minify is', plugins.gutil.colors.gray('OFF'));
    }
}

gulp.task('hints', function(){
    gulp.src('style/hints/main.scss')
        .pipe(plugins.sass({
            outputStyle: env.prod ? 'compressed' : 'expanded',
            sourceComments: !env.prod
        }).on('error', plugins.sass.logError))
        .pipe(plugins.concatCss('hints.css'))
        .pipe(plugins.prefixer())
        //.pipe(cssmin())
        .pipe(env.prod || env.minify
            ? plugins.csso()
            : plugins.gutil.noop()
        )
        .pipe(gulp.dest(buildRoot))
        ;
});

gulp.task('build', sequence(
    'hints'
));

gulp.task('run', sequence(
    'build'
    //,'watch:hints'
));

gulp.task('default', function(){

});