/***************************************************************************
* DEPENDENCIES
***************************************************************************/

var gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    plumber      = require('gulp-plumber'),
    reload       = browserSync.reload,
    rename       = require('gulp-rename'),
    rubySass     = require('gulp-ruby-sass'),
    sprite       = require('gulp.spritesmith'),
    uglify       = require('gulp-uglify'),
    sketch      = require("gulp-sketch"),
    imagemin    = require('gulp-imagemin'),
     filelog     = require('gulp-filelog')
;

/***************************************************************************
* FILE DESTINATIONS
***************************************************************************/

var paths = {
  'dest'      : './',
  'vhost'     : 'example.dev',
  'port'      : 3000,
// html
  'htmlDest'  : './www',
  'htmlFiles' : './*.html',
// images
  'imgDest'   : 'img',
  'imgDir'    : 'src/img',

// scss
  'scssDest'  : 'src/scss',
  'scssFiles' : 'src/scss/**/*.scss',
// css
  'cssDest'   : './www/css',

// scss
  srcDir  : 'src/sketch',
  dstDir : 'src/sketch/exports',

}
// Static server
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: paths.dest
    },
    startPath: paths.htmlDest
  });
});

// Reload all browsers
gulp.task('bs-reload', function() {
  browserSync.reload()
});


/***************************************************************************
* image tasks
***************************************************************************/

gulp.task('sprite', function() {
  var spriteData = gulp.src(paths.imgDir + '/sprite/*.png')
  .pipe(sprite({
    imgName: 'sprite.png',
    imgPath: '/' + paths.imgDest + '/sprite.png',
    cssName: '_module-sprite.scss'
  }));
  spriteData.img.pipe(gulp.dest(paths.imgDest));
  spriteData.css.pipe(gulp.dest(paths.scssDest + '/module'));
});



gulp.task( 'sketchExport:slices', function(){
  var srcGlob    = paths.srcDir + '/*.sketch';
  var dstGlob    = paths.dstDir;

  var sketchOptions = {
    export     : 'slices'
  };

  var imageminOptions = {
    optimizationLevel: 7
  };

  return gulp.src( srcGlob )
    .pipe(sketch( sketchOptions ))
    .pipe(imagemin( imageminOptions ))
    .pipe(gulp.dest( dstGlob ))
    .pipe(filelog());
});



/***************************************************************************
* Sass tasks
***************************************************************************/

gulp.task('rubySass', function () {
    gulp.src(paths.scssFiles)
        .pipe(plumber())
        .pipe(rubySass({
          r: 'sass-globbing',
          'sourcemap=none': true
        }))
        .pipe(autoprefixer("last 2 version"))
        .pipe(gulp.dest(paths.cssDest))
        .pipe(browserSync.reload({stream: true}));

});

/***************************************************************************
* gulp tasks
***************************************************************************/

gulp.task('watch', function() {
  //gulp.watch([paths.imgDest + '/sprite/*.png'], ['sprite']);
  gulp.watch([paths.htmlFiles], ['bs-reload']);
  /*gulp.watch([paths.jsDest], ['jsLib']);*/
  gulp.watch([paths.scssFiles], ['rubySass']);
});

gulp.task('default', [
    'browser-sync',
    'bs-reload',
    'rubySass',
    'watch'
]);


gulp.task( 'sketch', ['sketchExport:slices'] );
