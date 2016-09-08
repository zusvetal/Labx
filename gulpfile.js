var gulp = require('gulp'),
        concatJS = require('gulp-concat'),
        concatCSS = require('gulp-concat-css'),
        minifyCSS = require('gulp-minify-css'),
        minifyJS=require('gulp-uglify'),
        rename =  require('gulp-rename');

var path = {
    src: {
        css: 'css/*.css',
        js: ['js/blocks/*.js', 'js/formBlocks/*.js', 'js/plugins/*.js',
            'js/helpers/*.js', 'js/initialSetup/*.js']
    },
    watch: {
        css: 'css/*.css',
        js: ['js/blocks/*.js', 'js/formBlocks/*.js', 'js/plugins/*.js',
            'js/helpers/*.js', 'js/initialSetup/*.js']
    }
} 
gulp.task('css', function () {
    gulp.src(path.src.css)
            .pipe(concatCSS('bundle.css'))
            .pipe(minifyCSS())
            .pipe(rename('bundle.min.css'))
            .pipe(gulp.dest('./app'))

});
gulp.task('js', function () {
    gulp.src(path.src.js)
            .pipe(concatJS('main.js'))
            .pipe(gulp.dest('./app'))

});
gulp.task('watch', function () {
    gulp.watch(path.watch.css, function(){
        gulp.start('css')
    });
    gulp.watch(path.watch.js, function(){
        gulp.start('js')
    })
})

