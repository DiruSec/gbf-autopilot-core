const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const log = require("fancy-log");
const del = require("del");

gulp.task("clean", function() {
  return del([
    "build/**/*.js"
  ]);
});

gulp.task("build", gulp.series("clean", function() {
  return gulp.src("src/**/*.js", {base: "src"})
    .pipe(sourcemaps.init())
    .pipe(babel())
    .on("error", function(err) {
      log.error("babel", err.toString());
      this.emit("end");
    })
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("build"));
}));

gulp.task("watch", gulp.series("build", function(done) {
  gulp.watch("src/**/*.js", gulp.series("build"));
  done();
}));

gulp.task("default", gulp.series("build"));
