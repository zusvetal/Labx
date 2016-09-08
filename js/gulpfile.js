var gulp = require('gulp'),
        concatCss = require('gulp-concat-css'),
        rename = require('gulp-rename'),
        minifyCss = require('gulp-minify-css');

gulp.task('concatCss', function() {
  gult.src('css/*.css')
          .pipe(concatCss('bundle.min.css'))
          .pipe(minifyCss(''))
          .pipe(rename('bundle.min.css'))
          .pipe(gulp.dest('./app'));

});

gulp.task('watch',function(){
    gulp.watch('css/*.css',['concatCss'])
})