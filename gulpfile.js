var gulp = require('gulp'),
	gutil = require('gulp-util'),
    exec = require('child_process').exec,           // Run child processes with exec
    browserSync = require('browser-sync').create(), // Live reload and more
	less = require('gulp-less'), 					// Compile less files
	autoprefixer = require('gulp-autoprefixer'),	// CSS browser prefixing
	minifyCSS = require('gulp-minify-css'),			// Minify CSS files
	svgstore = require('gulp-svgstore'),			// Combine svg files into one with <symbol> elements
	svgmin = require('gulp-svgmin'),				// Minify SVG with SVGO
	path = require('path');							// Generates a path build based on the base paths setted


gulp.task('default', function() {
	return gutil.log('Gulp is running!')
});


// DEFAULT STATIC SERVER AND WATCHERS
gulp.task('serve', ['svgstore','less','jekyll'], function() {
    browserSync.init({
        server: "./_site/",
        ghostMode: {
            clicks: true,
            forms: true,
            scroll: false
        }
    });

    gulp.watch('./css/less/**/*.less', ['less']);
    gulp.watch('./icons/*.svg', ['svgstore']);
    gulp.watch(['./*.html','./_includes/**/*','./css/style.css'], ['jekyll']);
    gulp.watch(['_site/css/style.css'], browserSync.reload); // Reload browser sync when the style sheet changes
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


// GENERATE A SVG FILE WITH SYMBOL ELEMENTS
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


// JEKYLL BUILD
gulp.task('jekyll', function (){
    exec('jekyll build', function(err, stdout, stderr) {
        console.log(stdout);
    });
});


gulp.task('default', ['serve']);