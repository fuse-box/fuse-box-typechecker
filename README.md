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
    basePath:'./',
    name: 'Test Sync'
})

testSync.runSync();



// Async check (worker)
var testAsync = TypeHelper({
    tsConfig: './tsconfig.json',
    basePath:'./',
    name: 'Test async'
})

testAsync.runAsync();


// Watch folder and use worker (uses internal watcher)
var testWatch = TypeHelper({
    tsConfig: './tsconfig.json',
    basePath:'./',
    name: 'Watch Async'
})

testWatch.runWatch('./src');


```

### Output sample
![Output sample](https://github.com/fuse-box/fuse-box-typechecker/raw/master/image/sampleNew2.png "Output sample")



```typescript
interface OptionsInterface {
    tsConfig: string; //config file
    throwOnSyntactic?: boolean; // if you want it to throwe error
    throwOnSemantic?: boolean; // if you want it to throwe error
    throwOnGlobal?: boolean; // if you want it to throwe error
    throwOnOptions?: boolean; // if you want it to throwe error
    basePath: string; //base path to use
    name?: string; // name, will be displayed when it runs, useful when you have more then 1
}
```
