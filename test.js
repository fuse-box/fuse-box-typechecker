
var path = require('path')

//get typehelper (use built source)
var TypeHelper = require('./dist/commonjs/index.js').TypeHelper

// test async worker
var checker = TypeHelper({
    tsConfig: './tsconfig.json',
    basePath:'./',
    tsLint:'./tslint.json',
    name: 'Test Sync'
})
// run
checker.runSync();
// options are 
// checker.runAsync()
// checker.runWatch('./src')
