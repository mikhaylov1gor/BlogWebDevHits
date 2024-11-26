const gulp = require('gulp');
const less = require('gulp-less');
const path = require('path');

gulp.task('less', function () {
    return gulp.src('public/css/**/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('public/css'));
});

gulp.task('watch', function () {
    gulp.watch(['public/css/*.less', 'src/styles/*.less'], gulp.series('less'));
});

gulp.task('default', gulp.series('less', 'watch'));
