const gulp = require("gulp");
const babel = require("gulp-babel");
const log = require("fancy-log");

gulp.task("build", () => {
  return gulp.src("src/**/*.js")
    .pipe(babel().on("error", (err) => {
      log.error("babel", err.toString());
    }))
    .pipe(gulp.dest("build"));
});

gulp.task("watch", () => {
  gulp.watch("src/**/*.js", ["build"]);
});

gulp.task("default", ["build"]);
