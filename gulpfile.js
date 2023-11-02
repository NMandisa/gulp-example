const gulp = require('gulp');
const concat = require('gulp-concat');
const cleanCss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const pipeline = require('readable-stream').pipeline;
const gulpless = require('gulp-less');
const gulpautoprefixer = require('gulp-autoprefixer');
const { series, parallel } = require('gulp');

// Concat and minify CSS files
gulp.task('build-css', () => {
	return gulp.src('css/*.css')
		.pipe(concat('app.css'))
		.pipe(cleanCss())
		.pipe(gulp.dest('css/'));
});

gulp.task("session-start", (cb) => {
	return gulp.series('build-css')(cb);
});

//Creating a Style task that convert LESS to CSS
gulp.task('build-less-css', function() {
	return gulp
		.src('less/*.less')
		.pipe(gulpless())
		.pipe(gulpautoprefixer({ browsers: ['last 2 versions', '>5%'] }))
		.pipe(gulp.dest('css/'));
});


// Concat and minify libraries JS files
gulp.task('build-vendor-js', function() {
	return gulp.src(['src/libs/jquery-1.8.3.min.js',
		'src/libs/jquery-ui-1.9.2.custom.min.js',
		'src/libs/jquery_ui_touch.js',
		'src/libs/Math.js'])
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest('./js/'));
});

// Concat and minify application specific JS files
gulp.task('build-js', function() {
	return gulp.src(['js/main.js',
		'js/jquery.min.js'])
		.pipe(concat('app.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('js/'));
});

gulp.task('default', gulp.series('session-start'));
exports.build = series('build-js', parallel('build-less-css', 'build-css'));

