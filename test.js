var path = require('path')

//get typehelper (use built source)
var TypeHelper = require('./dist/commonjs/index.js').TypeHelper

var checker = TypeHelper({
    tsConfig: './tsconfig.json',
    basePath: './',
    tsLint: './tslint.json',
    name: 'Test Sync'
});

var doTypeCheck = async() => {

    //let totalErrors = checker.runSync();
    let totalErrors = await checker.runPromise();
    console.log(totalErrors)
}



// options are (need to test all by them self before release)
// doTypeCheck();
// checker.runSync()
// checker.runAsync()
checker.runWatch('./src')