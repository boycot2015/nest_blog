var gulp = require('gulp');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var watch = require('gulp-watch');
var bs = require('browser-sync').create();
var sass = require('gulp-sass');

// 为避免写死路径,这里我们定义路径,然后方面后面随时更改.
var path = {
    'html':'./templates/**/',//中间的**代表任意目录
    'css':'./src/css/**/',
    'js':'./src/js/',
    'images':'./src/images/',
    'css_dist':'./dist/css/',
    'js_dist':'./dist/js/',
    'images_dist':'./dist/images'
};

//定义相应任务
//定义处理HTML文件任务,HTML文件中增删改查,可以直接在浏览器中显示出来
gulp.task('html', function () {
    gulp.src(path.html+'*.html')
        .pipe(bs.stream()) //重新加载
});

// 定义css任务
gulp.task('css', function () {
    gulp.src(path.css + '*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnano())
        .pipe(rename({'suffix':'.min'}))
        .pipe(gulp.dest(path.css_dist))
        .pipe(bs.stream())
});

//定义处理js任务
gulp.task('js', function () {
    gulp.src(path.js+'*.js')
        .pipe(uglify())
        .pipe(gulp.dest(path.js_dist))
        .pipe(bs.stream())
});

//定义处理图片任务
gulp.task('images', function () {
    gulp.src(path.images+'*.*')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest(path.images_dist))
        .pipe(bs.stream())
});

//定义监听文件修改的任务
gulp.task('watch', function () {
    watch(path.html+'*.html', gulp.series('html'));
    watch(path.css+'*.scss', gulp.series('css')); //这里不能用gulp.watch(),要不然本机只能加载一次,之后就无变化
    watch(path.js+'*.js', gulp.series('js'));
    watch(path.images+'*.*', gulp.series('images'));
});

//创建服务器,浏览器立马可以看到 browser-sync
gulp.task('bs', function () {
    bs.init({
        'server': {
            'baseDir':'./',
        }
    })
});

//创建一个默认服务,可以默认执行
gulp.task('default', gulp.parallel( 'bs', 'watch','css', 'js', 'images', 'html'));
// gulp.task('default', gulp.series('bs', 'watch',gulp.parallel('css', 'js', 'images') ));