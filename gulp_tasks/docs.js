'use strict';

module.exports = function (gulp, plugins, config, env) {
    return function () {
        gulp.src(config.dirUiRoot + 'src/docs/**/*.pug')
            .pipe(plugins.pug({
                pretty: true
            }))
            .pipe(gulp.dest(config.dirUiBuild + 'pack/'))
        ;
    }
};