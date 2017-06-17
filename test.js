
var TypeHelper = require('./dist/commonjs/index.js').TypeHelper

var ts = TypeHelper({
    tsConfig: './tsconfig.json'
})
ts.runSync();
