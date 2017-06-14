'use strict';

module.exports = function(gulp, plugins, config, env, dirRoot, dirBuild){
    config.dirUiRoot = dirRoot;
    config.dirUiBuild = dirBuild || config.dirUiRoot + 'build/';

    function getUiTask(name) {
        return require(config.dirUiRoot + 'tasks/' + name)(gulp, plugins, config, env);
    }

    // DEFINE TASKS
    gulp.task('ui:hints', getUiTask('hints'));
};