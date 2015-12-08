var gulp = require('gulp'),
	gutil = require('gulp-util'),
	less = require('gulp-less'), 					// Compile less files
	autoprefixer = require('gulp-autoprefixer'),	// CSS browser prefixing
	minifyCSS = require('gulp-minify-css'),			// Minify CSS files
	svgstore = require('gulp-svgstore'),			// Combine svg files into one with <symbol> elements
	svgmin = require('gulp-svgmin'),				// Minify SVG with SVGO
	path = require('path');							// Generates a path build based on the base paths setted

gulp.task('default', function() {
	return gutil.log('Gulp is running!')
});

// COMPILE LESS FILES, PREFIX AND MINIFY CSS
gulp.task('less', function () {
	return gulp.src('./css/less/style.less')
		.pipe(less())
		.pipe(autoprefixer({
            browsers: ['last 2 versions', 'Explorer >= 9']
        }))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./css'));
});

// GENERATE AN SVG FILE WITH SYMBOL ELEMENTS
// https://css-tricks.com/svg-symbol-good-choice-icons/
gulp.task('svgstore', function () {
    return gulp
        .src('./icons/*.svg')
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore())
        .pipe(gulp.dest('./_includes'));
});

gulp.watch('./icons/*.svg', ['svgstore']);
gulp.watch('./css/less/**/*.less', ['less']);