(function main() {

    var gulp       = require('gulp'),
        karma      = require('gulp-karma'),
        eslint     = require('gulp-eslint'),
        uglify     = require('gulp-uglify'),
        rename     = require('gulp-rename'),
        sass       = require('gulp-sass'),
        concatCss  = require('gulp-concat-css'),
        fs         = require('fs'),
        path       = require('path'),
        yaml       = require('js-yaml'),
        browserify = require('browserify'),
        babelify   = require('babelify'),
        config     = yaml.safeLoad(fs.readFileSync('./giraffe.yml', 'utf8'));

    var compile = function(destPath, entryFile) {

        return browserify({ debug: true })
            .transform(babelify.configure({
                stage: 0
            }))
            .require(entryFile, { entry: true })
            .bundle()
            .on('error', function (model) { console.error(['Error:', model.message].join(' ')); })
            .pipe(fs.createWriteStream(destPath));

    };

    gulp.task('lint', function() {

        return gulp.src(config.js)
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failOnError());

    });

    gulp.task('compile', function() {
        return compile('dist/' + config.release, 'src/Giraffe.js');
    });

    gulp.task('vendor', function() {

        var path  = 'public/vendor/giraffe/';
        var fs    = require('fs');

        try       { fs.lstatSync(path); }
        catch (e) { fs.mkdirSync(path); }

        return compile(path + config.release, 'src/Giraffe.js');

    });

    gulp.task('sass', function () {

        return gulp.src(config.sass)
                   .pipe(sass().on('error', sass.logError))
                   .pipe(concatCss('all.css'))
                   .pipe(rename(path.basename(config.css)))
                   .pipe(gulp.dest(path.dirname(config.css)));

    });

    gulp.task('test', ['lint']);
    gulp.task('build', ['vendor', 'compile', 'minify']);
    gulp.task('default', ['test', 'build']);
    gulp.task('watch', function watch() {
        return gulp.watch([].concat(config.js, config.sass), ['vendor', 'sass']);
    });

})();