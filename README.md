# fuse-box-typechecker
Simple helper to do typechecking

### How to install
```npm install git://github.com/fuse-box/fuse-box-typechecker --save-dev```


### How to use
```javascript

// load
var TypeHelper = require('fuse-box-typechecker').TypeHelper


// it checks entire program every time


// Sync check
var testSync = TypeHelper({
    tsConfig: './tsconfig.json',
    name: 'Test Sync'
})

testSync.runSync();



// Async check (worker)
var testAsync = TypeHelper({
    tsConfig: './tsconfig.json',
    name: 'Test async'
})

testAsync.runAsync();


// Watch folder and use worker (uses internal watcher)
var testWatch = TypeHelper({
    tsConfig: './tsconfig.json',
    name: 'Watch Async'
})

testWatch.runWatch('./src');


```

### Output sample
![Output sample](https://github.com/vegarringdal/fuse-box-typechecker/raw/master/image/sampleNew2.png "Output sample")


