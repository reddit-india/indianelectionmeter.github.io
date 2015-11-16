var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

/**
A task that spawns a local static server and opens the url in the browser
**/
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

/**
A task that watches for changes in any of the files. If there is any change, it will automatically 
reload the browser and the changes will be reflected.
**/
gulp.task('server', ['browser-sync'], function() {
	gulp.watch('./**/*')
		.on('change', function() {
			browserSync.reload()
		});
});