var child_process = require('child_process'),
    del = require('del'),
    gulp = require('gulp');

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
    // Would be nice if we could print the files being copied here.
    gulp.src('img/**')
        .pipe(gulp.dest(BUILD_DIR + '/img'));
    gulp.src('js/**')
        .pipe(gulp.dest(BUILD_DIR + '/js'));
    return gulp.src('manifest.json')
        .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('crx', ['copy'], function() {
    // Not very gulp-ey... Wonder how we can refactor this.
    var crxCommand = 'bash crxmake.sh ' + BUILD_DIR + ' key.pem ' + EXT_NAME;
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
