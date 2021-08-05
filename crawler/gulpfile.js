const gulp = require('gulp');
const {loadHomePage, homePageUrl} = require('./crawler')

gulp.task('startCrawler', function (done) {
    console.log(`start crawler`)
    loadHomePage(homePageUrl()).then(console.log).catch(error => {
        console.error(error)
    })
    done()
});

gulp.task('default', gulp.series('startCrawler'));