/**
 * Created by rex_fzhou on 2016/8/20.
 */
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var del = require('del');
var notify = require('gulp-notify');

var cssFiles = [
    './static/assets/stylesheets/plugins/bootstrap/bootstrap.css',
    './static/assets/stylesheets/plugins/bootstrap/bootstrap-responsive.css',
    './static/assets/stylesheets/light-theme.css',
    './static/assets/stylesheets/plugins/select2/select2.min.css',
    './static/assets/stylesheets/main.css',
    './static/assets/stylesheets/user-center.css'
];
var jsFiles = [
    './static/assets/javascripts/plugins/jquery/jquery.min.js',
    './static/assets/javascripts/plugins/jquery/jquery-migrate.min.js',
    './static/assets/javascripts/plugins/bootstrap/*.js',
    './static/assets/javascripts/plugins/select2/*.js',
    './static/assets/javascripts/plugins/angular/angular.min.js',
    './static/assets/javascripts/plugins/angular/angular-route.js',
    './static/assets/javascripts/plugins/angular/angular-ui-router.min.js',
    './static/assets/javascripts/plugins/angular/ng-file-upload.min.js'
];
//执行压缩前，先删除文件夹里的内容
gulp.task('clean', function(cb) {
    del(['./static/assets/stylesheets/mini_css.css','./static/assets/javascripts/minify/*.js'], cb)
});
//压缩合并CSS文件
gulp.task('minify_css', function() {
    return gulp.src(cssFiles)      //压缩的文件
        .pipe(concat('mini_css.css'))
        .pipe(minifyCss())      //执行压缩
        .pipe(gulp.dest('static/assets/stylesheets'));   //输出文件夹
});
gulp.task('minify_js', function(){
    return gulp.src(jsFiles)
        .pipe(concat('all.js')) // 合并 JavaScript ，并设置合并后的文件名
        .pipe(gulp.dest('static/assets/javascripts/minify'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify()) // 执行 JavaScript 压缩
        .pipe(gulp.dest('static/assets/javascripts/minify'))
        .pipe(notify({ message: 'js task ok' }));
});

gulp.task('default', ['clean', 'minify_css', 'minify_js'], function () {
    // gulp.start('minifycss');
})