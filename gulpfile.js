var gulp = require('gulp'),
	gutil = require('gulp-util'),
    exec = require('child_process').exec,           // Run child processes with exec
    browserSync = require('browser-sync').create(), // Live reload and more
	less = require('gulp-less'), 					// Compile LESS files
	autoprefixer = require('gulp-autoprefixer'),	// CSS browser prefixing
	minifyCSS = require('gulp-minify-css'),			// Minify CSS files
	svgstore = require('gulp-svgstore'),			// Combine svg files into one with <symbol> elements
	svgmin = require('gulp-svgmin'),				// Minify SVG with SVGO
    concat = require('gulp-concat'),                // Concat specified files
    rename = require('gulp-rename'),                // Rename files
    uglify = require('gulp-uglify'),                // Uglify specified files
	path = require('path');							// Generates a path build based on the base paths setted


// JAVASCRIPT INCLUDES
//--------------------------------------------
var js_lib_files = [
    './js/_lib/jquery/jquery-2.1.3.min.js',
    './js/_lib/jquery/jquery.ba-throttle-debounce.min.js',
    './js/_lib/gsap/minified/TweenMax.min.js',
    './js/_lib/gsap/minified/TimelineMax.min.js',
    './js/_lib/gsap/minified/plugins/DrawSVGPlugin.min.js',
    './js/_lib/scrollmagic/minified/ScrollMagic.min.js',
    './js/_lib/scrollmagic/minified/plugins/animation.gsap.min.js',
    './js/_lib/scrollmagic/minified/plugins/debug.addIndicators.min.js'
];
var js_custom_files = [
    './js/_custom/global.js',
    './js/_custom/intro.js',
    './js/_custom/animation.js',
    './js/_custom/glitch_animation.js',
    './js/_custom/h_shift.js',
    './js/_custom/grid_tilt.js'
];


// DEFAULT GULP TASK
//--------------------------------------------
// This task runs when you type 'gulp' on the command line
gulp.task('default', function() {

    // BROWSER SYNC INIT
    browserSync.init({server: "./_site/"});

    // BROWSER SYNC JEKYLL WATCHER
    // Only watches index.html to avoid repeatedly reloading browser
    gulp.watch(['site/index.html'], browserSync.reload);

    // LESS/CSS WATCHERS
    gulp.watch('./css/_less/**/*.less', ['less']);

    // JS WATCHERS
    gulp.watch(['./js/_lib/**/*.js'], ['js-lib']);
    gulp.watch(['./js/_custom/**/*.js'], ['js-custom']);

    // SVG SPRITE WATCHER (this will trigger jekyll watcher)
    gulp.watch('./_svg_sprites/**/*.svg', ['svgstore']);

    // JEKYLL WATCHER
    gulp.watch(['./**/*.html','./*.ico','./_includes/**/*','./img/**/*'],['jekyll']);
});


// LESS/CSS
//--------------------------------------------
// Compile less, autoprefix and minify css
gulp.task('less', function () {
    return gulp.src('./css/_less/style.less')
        
        // Compile LESS
        .pipe(less())

        // Add browser specific css prefixes
        .pipe(autoprefixer({ browsers: ['last 2 versions', 'Explorer >= 9'] }))

        // Save CSS file to source folder
        .pipe(gulp.dest('./css'))

        // Minify CSS
        .pipe(minifyCSS())

        // Save minified CSS file to site folder 
        .pipe(gulp.dest('./_site/css'))

        // Update BrowserSync
        .pipe(browserSync.stream());
});


// JS
//--------------------------------------------
// Concat and minify js
gulp.task('js-lib', function () {
    return gulp.src(js_lib_files)

        // Concat all files in 'js_files' array
        .pipe(concat('lib.js'))

        // Save concated file to source
        .pipe(gulp.dest('./js'))

        // Minify concated file
        .pipe(uglify())

        // Save minified file to site
        .pipe(gulp.dest('./_site/js'))

        // Update BrowserSync
        .pipe(browserSync.stream());
});
gulp.task('js-custom', function () {
    return gulp.src(js_custom_files)

        // Concat all files in 'js_files' array
        .pipe(concat('custom.js'))

        // Save concated file to source
        .pipe(gulp.dest('./js'))

        // Minify concated file
        .pipe(uglify())

        // Save minified file to site
        .pipe(gulp.dest('./_site/js'))

        // Update BrowserSync
        .pipe(browserSync.stream());
});


// GENERATE A SVG FILE WITH SYMBOL ELEMENTS
//--------------------------------------------
// https://css-tricks.com/svg-symbol-good-choice-icons/
gulp.task('svgstore', function () {
    return gulp.src('./_svg_sprites/*.svg')

        // Minify SVG FILES
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

        // Combine Minified files into svg store
        .pipe(svgstore())

        // Rename resulting file
        .pipe(rename('svg_sprites.svg'))
    
        // Save file into source _includes
        .pipe(gulp.dest('./_includes/'));

        // Jekyll will run when the file is save to source/_includes
});


// JEKYLL BUILD
//--------------------------------------------
// Run Jekyll build through command line
gulp.task('jekyll', function (){
    exec('jekyll build', function(err, stdout, stderr) {
        console.log(stdout);
    });
});


// COMPRESS IMAGES
//--------------------------------------------
gulp.task('images', function(){
    exec('./bash.sh', function (err, stdout, stderr) {
        console.log(stdout);
    });
});


// BUILD ALL
//--------------------------------------------
gulp.task('build', ['less', 'js-lib', 'js-custom', 'svgstore'], function (){
    exec('jekyll build', function(err, stdout, stderr) {
        console.log(stdout);
    });
});