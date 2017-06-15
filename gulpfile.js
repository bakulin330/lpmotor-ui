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
        sequence: require('gulp-sequence') // используем плагин для последовательного/параллельного выполнения задач https://www.npmjs.com/package/gulp-sequence
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