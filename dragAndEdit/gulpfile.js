var gulp = require('gulp'),
    rev = require('gulp-rev'), //更改版本号
    clean = require('gulp-clean'),
    revCollector = require('gulp-rev-collector'); //gulp-rev的插件，用于html模板更改引用路径

gulp.task('clean', function () {
    return gulp.src('dist/www', {
        read: false
    }).pipe(clean());
});

gulp.task('copy', ['clean'], function () {
    return gulp.src('img/*').pipe(gulp.dest('dist/www/img'));
});

gulp.task('css', ['clean'], function () {
    return gulp.src('css/*.css')
        .pipe(rev())
        .pipe(gulp.dest('dist/www/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/www/rev/css'));

});


gulp.task('script', ['clean'], function () {
    return gulp.src('js/*.js')
        .pipe(rev())
        .pipe(gulp.dest('dist/www/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/www/rev/js'));
});

gulp.task('revhtml', ['script', 'css'], function () {
    return gulp.src(['dist/www/rev/**/*.json', 'index.html'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest('dist/www/'));
});

gulp.task('default', ['clean', 'copy', 'css', 'script', 'revhtml']);