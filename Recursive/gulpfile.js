var gulp = require("gulp");
var ts = require("gulp-typescript");
var watch = require("gulp-watch");
var runSequence = require("run-sequence");
var clean = require('gulp-clean');
var zip = require("gulp-zip");
var argv = require("yargs").argv;

var scriptsProj = ts.createProject('tsconfig.json');

gulp.task("scripts", function() {
	var tsResult = scriptsProj.src().pipe(ts(scriptsProj));
    return tsResult.js.pipe(gulp.dest("."));
});

gulp.task("clean", function() {
	return gulp.src(['app/**/*.js', 'app/**/*.map'], {read: false})
		.pipe(clean());
});

gulp.task("build", ["scripts"], function() {
});

gulp.task("default", ["clean", "build", "watch"], function() {
});

gulp.task("release", ["build"], function() {
    if (argv.rversion == undefined)
        throw new Error("Supply '--rversion=1.x'");

    return gulp.src(["**/*.*", "!node_modules/**"])
        .pipe(zip("Recursive-v" + argv.rversion + ".zip"))
        .pipe(gulp.dest("../Releases"));
});

gulp.task("watch", function() {
    watch(["**/*.tsx", "**/*.ts", "**/*.d.ts"], function () { runSequence("scripts"); });
});