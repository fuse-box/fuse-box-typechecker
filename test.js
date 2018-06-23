var path = require('path')

//get typehelper (use built source)
const { TypeChecker } = require('./dist/commonjs/index.js')









var test1 = () => {

    // sync run
    let checkerSync = TypeChecker({
        tsConfig: './tsconfig.json',
        basePath: './',
        tsLint: './tslint.json',
        name: 'checkerSync'
    });
    checkerSync.runSync()


    // promiose run
    let checkerPromise = TypeChecker({
        tsConfig: './tsconfig.json',
        basePath: './',
        tsLint: './tslint.json',
        name: 'checkerPromise'
    });

    checkerPromise.runPromise().then((err) => {
        console.log('\nErrors promise run:' + err)


        let checkerAsync = TypeChecker({
            tsConfig: './tsconfig.json',
            basePath: './',
            tsLint: './tslint.json',
            name: 'checkerAsync'
        });
        checkerAsync.runAsync((err) => {
            console.log('\nErrors async run:' + err)
        })

    });

}


var test2 = () => {

    var checkerWatch = TypeChecker({
        tsConfig: './tsconfig.json',
        basePath: './',
        tsLint: './tslint.json',
        name: 'checkerWatch'
    });

    checkerWatch.runWatch('./src')
}

// First test (sync, async, promise)
// test1();

// Second test (watch)
test2()