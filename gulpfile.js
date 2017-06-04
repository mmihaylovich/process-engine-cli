var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('build', ['compile'], function () {
  return gulp.src(['./config/**/*.json','package.json','LICENSE'])
    .pipe(gulp.dest('./built'));
});

gulp.task('compile', function (done) {
  exec('tsc', function (err, stdOut, stdErr) {
    console.log(stdOut);
    if (err){
      done(err);
    } else {
      done();
    }
  });
});
gulp.task('default', [ 'build' ]);