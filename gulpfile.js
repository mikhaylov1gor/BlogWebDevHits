const gulp = require('gulp');
const less = require('gulp-less');
const path = require('path');
const browserSync = require('browser-sync').create();

gulp.task('less', function () {
    return gulp.src('public/css/main.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.stream());
});


gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: './public',
        },
        port: 3000,
        notify: false,
    });

    gulp.watch('public/*.html').on('change', browserSync.reload);
    gulp.watch('public/css/*.css').on('change', browserSync.reload);
    gulp.watch('public/js/*.js').on('change', browserSync.reload);
    gulp.watch('public/templates/*.html').on('change', browserSync.reload);
});

gulp.task('watch', function () {
    gulp.watch('public/css/*.less', gulp.series('less'));
});

// Задача по умолчанию
gulp.task('default', gulp.series('less', 'serve', 'watch'));
