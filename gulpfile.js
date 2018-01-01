const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const log = require("fancy-log");

gulp.task("build", () => {
  return gulp.src("src/**/*.js", {base: "src"})
    .pipe(sourcemaps.init())
    .pipe(babel())
    .on("error", function(err) {
      log.error("babel", err.toString());
      this.emit("end");
    })
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("build"));
});

gulp.task("watch", ["build"], () => {
  gulp.watch("src/**/*.js", ["build"]);
});

gulp.task("default", ["build"]);
