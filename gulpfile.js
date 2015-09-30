var gulp = require('gulp'),
	gutil = require('gulp-util'),
	less = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
	minifyCSS = require('gulp-minify-css');

gulp.task('default', function() {
	return gutil.log('Gulp is running!')
});

gulp.task('less', function () {
	return gulp.src('./css/less/style.less')
		.pipe(less())
		.pipe(autoprefixer({
            browsers: ['last 2 versions', 'Explorer >= 9']
        }))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./css'));
});

gulp.watch('./css/less/**/*.less', ['less']);