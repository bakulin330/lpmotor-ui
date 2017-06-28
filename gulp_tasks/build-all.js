'use strict';

module.exports = function (gulp, plugins, config, env) {
    return function () {
        gulp.src([
            config.dirUiBuild + 'normalize/ready.css',
            config.dirUiBuild + '*.css',
        ])
            .pipe(plugins.concatCss('full.css'))
            .pipe(env.prod || env.minify
                ? plugins.csso()
                : plugins.gutil.noop()
            )
            .pipe(gulp.dest(config.dirUiBuild + 'pack/'))
            ;
    }
};