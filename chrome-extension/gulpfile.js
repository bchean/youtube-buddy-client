var child_process = require('child_process'),
    del = require('del'),
    gulp = require('gulp'),
    mergeStreams = require('merge-stream'),
    print = require('gulp-print');

var BUILD_DIR = 'build';
var EXT_NAME = 'ytb-client';
var EXT_FILENAME = EXT_NAME + '.crx';

gulp.task('clean', function() {
    return del([
        BUILD_DIR + '/**',
        EXT_FILENAME
    ]).then(printPaths);
});

gulp.task('copy', ['clean'], function() {
    var copyImg = makeCopyStream('img/**');
    var copyJs = makeCopyStream('js/**');
    var copyManifest = makeCopyStream('manifest.json');
    return mergeStreams(copyImg, copyJs, copyManifest)
        .pipe(print(function(path){return 'Copying to ' + path;}));
});

function makeCopyStream(globWithoutDot) {
    return gulp.src('./' + globWithoutDot, {base: '.'})
        .pipe(gulp.dest(BUILD_DIR));
}

gulp.task('crx', ['copy'], function() {
    // Not very gulp-ey... Wonder how we can refactor this.
    var crxCommand = 'bash crxmake.sh ' + BUILD_DIR + ' key.pem ' + EXT_NAME;
    console.log('$ ' + crxCommand);
    console.log(child_process.execSync(crxCommand).toString().trim());
});

gulp.task('default', ['crx']);

function printPaths(paths) {
    var output = 'Affected files/directories:';
    if (paths.length) {
        output += '\n' + paths.join('\n');
    } else {
        output += ' none!';
    }
    console.log(output);
}
