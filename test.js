
var TypeHelper = require('./dist/commonjs/index.js').TypeHelper
var path = require('path')

// test async worker
var testSync = TypeHelper({
    tsConfig: './tsconfig.json',
    basePath:'./',
    name: 'Test Sync'
})

testSync.runSync('./src');


// test sync worker
var testAsync = TypeHelper({
    tsConfig: './tsconfig.json',
    basePath:'./',
    name: 'Test async'
})

testAsync.runAsync();


/*var testWatch = TypeHelper({
    tsConfig: './tsconfig.json',
    name: 'Test async'
})

testWatch.runWatch('./src');*/

