
var TypeHelper = require('./dist/commonjs/index.js').TypeHelper



// test async worker
var testSync = TypeHelper({
    tsConfig: './tsconfig.json',
    name: 'Test Sync'
})

testSync.runSync();



// test sync worker
var testAsync = TypeHelper({
    tsConfig: './tsconfig.json',
    name: 'Test async'
})

testAsync.runAsync();




