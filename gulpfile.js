const path = require("path");
const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const log = require("fancy-log");
const del = require("del");

gulp.task("clean", function() {
  return del([
    "build/**/*.*",
    "!build/.gitignore"
  ]);
});

gulp.task("build", gulp.series("clean", function() {
  return gulp.src("src/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(babel({
      sourceRoot: path.resolve(__dirname, "src")
    }))
    .on("error", function(err) {
      log.error("babel", err.toString());
      this.emit("end");
    })
    .pipe(sourcemaps.write(".", {
      includeContent: false,
      sourceRoot: "../src"}
    ))
    .pipe(gulp.dest("build"));
}));

gulp.task("watch", gulp.series("build", function() {
  gulp.watch("src/**/*.js", gulp.series("build"));
}));

gulp.task("default", gulp.series("build"));
