var gulp = require('gulp'),
	gutil = require('gulp-util'),
    exec = require('child_process').exec,           // Run child processes with exec
    browserSync = require('browser-sync').create(), // Live reload and more
	less = require('gulp-less'), 					// Compile less files
	autoprefixer = require('gulp-autoprefixer'),	// CSS browser prefixing
	minifyCSS = require('gulp-minify-css'),			// Minify CSS files
	svgstore = require('gulp-svgstore'),			// Combine svg files into one with <symbol> elements
	svgmin = require('gulp-svgmin'),				// Minify SVG with SVGO
    concat = require('gulp-concat'),                // Concat specified files
    uglify = require('gulp-uglify'),                // Uglify specified files
    size = require('gulp-size'),                    // displays size of files
    shell = require('gulp-shell'),                  // inline shell commands
	path = require('path');							// Generates a path build based on the base paths setted


gulp.task('default', function() {
	return gutil.log('Gulp is running!')
    .pipe(size(true));
});

// DEFAULT STATIC SERVER AND WATCHERS
gulp.task('serve', ['svgstore','less', 'javascript', 'vendor', 'jekyll'], function() {
    browserSync.init({
        server: "./_site/"
    });
    
    gulp.watch('./css/less/**/*.less', ['less']);
    gulp.watch('./icons/*.svg', ['svgstore']);
    gulp.watch('./js/*.js', ['javascript']);
    gulp.watch('./js/lib/*.js', ['vendor']);
    gulp.watch(['./*.html','./portfolio/*.html','./_includes/**/*','./js/**/*','./img/**/*','./css/style.css'], ['jekyll']);
    gulp.watch(['_site/css/style.css','_site/*.html','_site/portfolio/*.html'], browserSync.reload); // Reload browser sync when the style sheet changes
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

// COMPILE JAVASCRIPT AND CONCAT NON VENDOR FILES
gulp.task('javascript', function () {
    return gulp.src(['./js/global.js', './js/intro.js', './js/animation.js', './js/h_shift.js', './js/grid_tilt.js'])
        .pipe(size())
        .pipe(concat({ path: 'main.min.js' }))
        .pipe(uglify())
        .pipe(gulp.dest('./js'));
});

// COMPILE LIBRARY FOLDER AND CONCAT VENDOR FILES
gulp.task('vendor', function () {
    return gulp.src(['./js/lib/jquery/jquery-2.1.3.min.js', './js/lib/jquery/jquery.ba-throttle-debounce.min.js', './js/lib/gsap/minified/TweenMax.min.js', './js/lib/gsap/minified/TimelineMax.min.js', './js/lib/gsap/minified/plugins/DrawSVGPlugin.min.js', './js/lib/scrollmagic/minified/ScrollMagic.min.js', './js/lib/scrollmagic/minified/plugins/animation.gsap.min.js', './js/lib/scrollmagic/minified/plugins/debug.addIndicators.min.js'])
    .pipe(size())
    .pipe(concat({ path: 'vendor.min.js' }))
    .pipe(uglify())
    .pipe(gulp.dest('./js/lib/'));
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


// COMPRESS IMAGES
gulp.task('images', function(){
    exec('./bash.sh', function (err, stdout, stderr) {
        console.log(stdout);
    });
});


// JEKYLL BUILD
gulp.task('jekyll', function (){
    exec('jekyll build', function(err, stdout, stderr) {
        console.log(stdout);
    });
});


gulp.task('default', ['serve']);
