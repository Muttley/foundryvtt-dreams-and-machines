import {deleteAsync} from "del";

import * as sass from "sass";

import gulp from "gulp";
import gulpSass from "gulp-sass";

const sassInstance = gulpSass(sass);

const CSS_DST_PATH  = ["./system/css"];
const SCSS_SRC_PATH = ["./scss/dreams-and-machines.scss"];
const SCSS_WATCH_PATHS = ["./scss/**/*.scss"];

function cleanupCssFiles() {
	return deleteAsync(CSS_DST_PATH);
}
export const clean = cleanupCssFiles;

function compileSass() {
	return gulp.src(SCSS_SRC_PATH)
		.pipe(sassInstance.sync().on("error", sassInstance.logError))
		.pipe(gulp.dest(CSS_DST_PATH));
}
export const compile = compileSass;

export function watchScssUpdates() {
	gulp.watch(SCSS_WATCH_PATHS, compile);
}
export const watchUpdates = watchScssUpdates;
