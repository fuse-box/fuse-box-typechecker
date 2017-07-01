var path = require('path')

//get typehelper (use built source)
var TypeHelper = require('./dist/commonjs/index.js').TypeHelper

var doTypeCheck = async() => {

    var checker = TypeHelper({
        tsConfig: './tsconfig.json',
        basePath: './',
        tsLint: './tslint.json',
  
 
   
        name: 'Test Sync'
    })

    //let totalErrors = checker.runSync();
    let totalErrors = await checker.runPromise();
    console.log(totalErrors)
}

doTypeCheck();

// options are 
// checker.runAsync()
// checker.runWatch('./src')