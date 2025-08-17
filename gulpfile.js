var gulp = require("gulp"),
  gutil = require("gulp-util"),
  exec = require("child_process").exec, // Run child processes with exec
  browserSync = require("browser-sync").create(), // Live reload and more
  less = require("gulp-less"), // Compile LESS files
  autoprefixer = require("gulp-autoprefixer"), // CSS browser prefixing
  cleanCSS = require("gulp-clean-css"), // Minify CSS files
  svgstore = require("gulp-svgstore"), // Combine svg files into one with <symbol> elements
  svgmin = require("gulp-svgmin"), // Minify SVG with SVGO
  concat = require("gulp-concat"), // Concat specified files
  rename = require("gulp-rename"), // Rename files
  uglify = require("gulp-uglify"), // Uglify specified files
  path = require("path"); // Generates a path build based on the base paths setted

// Import Gulp 4 series and parallel
const { series, parallel, watch } = require("gulp");

// JAVASCRIPT INCLUDES
//--------------------------------------------
var js_lib_files = [
  "./js/_lib/jquery/jquery-2.1.3.min.js",
  "./js/_lib/jquery/jquery.ba-throttle-debounce.min.js",
  "./js/_lib/gsap/minified/TweenMax.min.js",
  "./js/_lib/gsap/minified/TimelineMax.min.js",
  "./js/_lib/gsap/minified/plugins/DrawSVGPlugin.min.js",
  "./js/_lib/gsap/minified/plugins/ScrollToPlugin.min.js",
  "./js/_lib/scrollmagic/minified/ScrollMagic.min.js",
  "./js/_lib/scrollmagic/minified/plugins/animation.gsap.min.js",
  "./js/_lib/scrollmagic/minified/plugins/debug.addIndicators.min.js",
];
var js_custom_files = [
  "./js/_custom/global.js",
  "./js/_custom/intro.js",
  "./js/_custom/animation.js",
  "./js/_custom/h_shift.js",
  "./js/_custom/grid_tilt.js",
];

// DEFAULT GULP TASK
//--------------------------------------------
// This task runs when you type 'gulp' on the command line
gulp.task("default", function () {
  // BROWSER SYNC INIT
  browserSync.init({ server: "./_site/" });

  // BROWSER SYNC JEKYLL WATCHER
  // Only watches index.html to avoid repeatedly reloading browser
  watch(["./_site/index.html"], browserSync.reload);

  // LESS/CSS WATCHERS
  watch("./css/_less/**/*.less", gulp.series("less"));

  // JS WATCHERS
  watch(["./js/_lib/**/*.js"], gulp.series("js-lib"));
  watch(["./js/_custom/**/*.js"], gulp.series("js-custom"));

  // SVG SPRITE WATCHER (this will trigger jekyll watcher)
  watch("./_svg_sprites/**/*.svg", gulp.series("svgstore"));

  // JEKYLL WATCHER
  watch(
    [
      "./*.html",
      "./portfolio/*.html",
      "./*.ico",
      "./_includes/**/*",
      "./img/**/*",
    ],
    gulp.series("jekyll")
  );
});

// LESS/CSS
//--------------------------------------------
// Compile less, autoprefix and minify css
gulp.task("less", function () {
  return (
    gulp
      .src("./css/_less/style.less")

      // Compile LESS
      .pipe(less())

      // Add browser specific css prefixes
      .pipe(
        autoprefixer({
          overrideBrowserslist: ["last 2 versions", "Explorer >= 9"],
        })
      )

      // Save CSS file to source folder
      .pipe(gulp.dest("./css"))

      // Minify CSS
      .pipe(cleanCSS())

      // Save minified CSS file to site folder
      .pipe(gulp.dest("./_site/css"))

      // Update BrowserSync
      .pipe(browserSync.stream())
  );
});

// JS
//--------------------------------------------
// Concat and minify js
gulp.task("js-lib", function () {
  return (
    gulp
      .src(js_lib_files)

      // Concat all files in 'js_files' array
      .pipe(concat("lib.js"))

      // Save concated file to source
      .pipe(gulp.dest("./js"))

      // Minify concated file
      .pipe(uglify())

      // Save minified file to site
      .pipe(gulp.dest("./_site/js"))

      // Update BrowserSync
      .pipe(browserSync.stream())
  );
});
gulp.task("js-custom", function () {
  return (
    gulp
      .src(js_custom_files)

      // Concat all files in 'js_files' array
      .pipe(concat("custom.js"))

      // Save concated file to source
      .pipe(gulp.dest("./js"))

      // Minify concated file
      .pipe(uglify())

      // Save minified file to site
      .pipe(gulp.dest("./_site/js"))

      // Update BrowserSync
      .pipe(browserSync.stream())
  );
});

// GENERATE A SVG FILE WITH SYMBOL ELEMENTS
//--------------------------------------------
// https://css-tricks.com/svg-symbol-good-choice-icons/
gulp.task("svgstore", function () {
  return (
    gulp
      .src("./_svg_sprites/*.svg")

      // Minify SVG FILES
      .pipe(
        svgmin(function (file) {
          var prefix = path.basename(
            file.relative,
            path.extname(file.relative)
          );
          return {
            plugins: [
              {
                cleanupIDs: {
                  prefix: prefix + "-",
                  minify: true,
                },
              },
            ],
          };
        })
      )

      // Combine Minified files into svg store
      .pipe(svgstore())

      // Rename resulting file
      .pipe(rename("svg_sprites.svg"))

      // Save file into source _includes
      .pipe(gulp.dest("./_includes/"))
  );

  // Jekyll will run when the file is save to source/_includes
});

// JEKYLL BUILD
//--------------------------------------------
// Run Jekyll build through command line
gulp.task("jekyll", function () {
  exec("jekyll build", function (err, stdout, stderr) {
    console.log(stdout);
  });
});

// BUILD ALL
//--------------------------------------------
gulp.task(
  "build",
  series("less", "js-lib", "js-custom", "svgstore", function () {
    return new Promise((resolve, reject) => {
      exec("jekyll build", function (err, stdout, stderr) {
        if (err) {
          console.error(stderr);
          reject(err);
          return;
        }
        console.log(stdout);
        resolve();
      });
    });
  })
);
