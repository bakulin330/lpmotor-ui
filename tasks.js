'use strict';

module.exports = function(gulp, plugins, config, env, dirRoot, dirBuild){
    config.dirUiRoot = dirRoot;
    config.dirUiBuild = dirBuild || config.dirUiRoot + 'build/';

    function getUiTask(taskName) {
        return require(config.dirUiRoot + 'gulp_tasks/' + taskName)(gulp, plugins, config, env);
    }

    // DEFINE TASKS
    gulp.task('lpm-ui:docs', getUiTask('docs'));
    gulp.task('lpm-ui:normalize', getUiTask('normalize'));
    gulp.task('lpm-ui:typography', getUiTask('typography'));
    gulp.task('lpm-ui:button', getUiTask('button'));
    gulp.task('lpm-ui:hints', getUiTask('hints'));
    gulp.task('lpm-ui:build-all', [
        'lpm-ui:normalize'
        ,'lpm-ui:typography'
        ,'lpm-ui:button'
        ,'lpm-ui:hints'
    ], getUiTask('build-all'));

    gulp.task('lpm-ui:watch', ['lpm-ui:build-all', 'lpm-ui:docs'], function(){
        gulp.watch(config.dirUiRoot + 'src/**/*.scss', ['lpm-ui:build-all']);
        gulp.watch(config.dirUiRoot + 'src/docs/**/*.pug', ['lpm-ui:docs']);
    });
};