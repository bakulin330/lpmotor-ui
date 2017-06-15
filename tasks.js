'use strict';

module.exports = function(gulp, plugins, config, env, dirRoot, dirBuild){
    config.dirUiRoot = dirRoot;
    config.dirUiBuild = dirBuild || config.dirUiRoot + 'build/';

    function getUiTask(taskName) {
        return require(config.dirUiRoot + 'gulp_tasks/' + taskName)(gulp, plugins, config, env);
    }

    // DEFINE TASKS
    gulp.task('ui:hints', getUiTask('hints'));
};