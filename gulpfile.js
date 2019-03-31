'use strict'


const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const connect = require('gulp-connect');
const imagemin = require('gulp-imagemin');
const spritesmith = require('gulp.spritesmith');

const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

const del = require('del');


// ==================================================
//             變數定義，引入相關套件
// ==================================================


const paths = {
    html: {
        src: './*.html',
    },
    styles: {
        src: './src/styles/index.scss',
        watch: './src/styles/**/*.scss',
        dest: 'build/css'
    },
    images: {
        src: 'src/images/*',
        dest: 'build/images'
    },
    webfonts: {

        src: './src/fonts/*',
        dest: 'build/fonts'
    },
    cssprite: {
        src: 'src/sprite/*.png',
        dest: 'build'
    },
    script: {
        src: 'src/app/index.js',
        dest: 'build.js'
    },
    venders: {
        script: {
            src: [
                'src/vender/jquery/dist/jquery-3.3.1.js',
                'src/vender/slider-pro/dist/js/jquery.sliderPro.js',
                'src/vender/magnific-popup/dist/jquery.magnific-popup.js',
            ],
            dest: 'build/js'
        },
        styles: {
            src: [
                'src/vender/slider-pro/dist/css/slider-pro.min.css',
                'src/vender/magnific-popup/dist/magnific-popup.css',
            ],
            dest: 'build/css'
        },
        images: {
            src: [
                'src/vender/**/*.gif',
                'src/vender/**/*.jpg',
                'src/vender/**/*.png',
                'src/vender/**/*.cur',
            ],
            dest: 'build/images'
        }
    }
};



const clean = () => del(['assets'])

//工作1	 管理HTML

const buildHtm1 = async function (cb) {
    console.log('bulidHtml');
    gulp.src(paths.html.src)
        .pipe(connect.reload());
    cb();
}

//WORK 2

const buildSass = async function (cb) {
    console.log('bulidSass');
    gulp.src(paths.styles.src)
        .pipe(gulpSass())
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(connect.reload());
    cb();
}

//work3
const compressImage = async function (cb) {
    console.log('compressImage');
    gulp.src(paths.images.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images.dest))
        .pipe(connect.reload());
    cb();
}

//work4
const webfont = async function (cb) {
    console.log('webfont');
    gulp.src(paths.webfonts.src)
        .pipe(gulp.dest(paths.webfonts.dest))
        .pipe(connect.reload());
    cb();
}

//work5
const CSSSprite = async function (cb) {
    console.log('CSSSprite');
    gulp.src('src/sprite/*.png').pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css'
        }))
        .pipe(gulp.dest('build/'));
    cb();
}

//work6
const buildScript = async function (cb) {
    console.log('buildScript');
    gulp.src(paths.script.src)
        .pipe(concat('app.js'))
        .pipe(gulp.dest(paths.script.dest))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.script.dest))
        .pipe(connect.reload());
    cb();
};



//work7
const venderJS = async function (cb) {
    console.log('venderJS');
    gulp.src(paths.venders.script.src)
        .pipe(concat('venders.js'))
        .pipe(gulp.dest(paths.venders.script.dest))
        .pipe(rename('venders.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.venders.script.dest))
        .pipe(connect.reload());
    cb();
};
const venderCSS = async function (cb) {
    console.log('venderCSS');
    gulp.src(paths.venders.styles.src)
        .pipe(concat('venders.src'))
        .pipe(gulp.dest(paths.venders.styles.dest))
        .pipe(rename('venders.min.CSS'))
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest(paths.venders.styles.dest))
        .pipe(connect.reload());
    cb();
};
const venderImage = async function (cb) {
    console.log('compressImage');
    gulp.src(paths.venders.images.src)
        .pipe(gulp.dest(paths.venders.images.dest))
        .pipe(connect.reload());
    cb();
};


//work8 組合工作
const buildAssets = gulp.series(buildHtm1, buildScript, buildSass, gulp.parallel(compressImage, webfont, CSSSprite));
const buildVenders = gulp.series(venderJS, gulp.parallel(venderCSS, venderImage));

//work9 Watch監看程式
const watchFiles = async function () {
    gulp.watch(paths.html.src, buildHtm1);
    gulp.watch(paths.styles.watch, buildSass);
    gulp.watch(paths.images.src, compressImage);
    gulp.watch(paths.webfonts.src, webfont);
    gulp.watch(paths.cssprite.src, CSSSprite);

    gulp.watch(paths.script.src, buildScript);

    gulp.watch(paths.venders.script.src, venderJS);
    gulp.watch(paths.venders.styles.src, venderCSS);
    gulp.watch(paths.venders.images.src, venderImage);
}

const webServer = async function () {
    console.log('start server');
    connect.server({
        livereload: true
    });
}

/*
 events: 'add', 'addDir', 'change', 'unlink', 'unlinkDir', 'ready', 'error', 'all
 */

exports.default = gulp.series(buildAssets, buildVenders, webServer, watchFiles);
// gulp.watch('src/**/*.scss', { events: 'all' }, function(cb){
//     console.log('change SASS');
//     buildSass(cb);
//     cb();
// });