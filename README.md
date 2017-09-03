# fuse-box-typechecker
Simple helper to do typechecking

### How to install
```npm install git://github.com/fuse-box/fuse-box-typechecker --save-dev```


### Note
This have been tested with
 * "tslint": "^5.4.3",
 * "typescript": "^2.4.1"

So this might not work with earlier version if typescript and tslint (tsLint 3 will fail, been tested).


### How to use
```javascript

// load
var TypeHelper = require('fuse-box-typechecker').TypeHelper


// it checks entire program every time
// see interface at bottom at readmefile for all options


// Sync check
var testSync = TypeHelper({
    tsConfig: './tsconfig.json',
    basePath:'./',
    tsLint:'./tslint.json', //you do not haveto do tslint too.. just here to show how.
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
/* or with optional callback
testAsync.runAsync((errors: number) => {
    // errors > 0 => notify
});
*/ 



// Watch folder and use worker (uses internal watcher)
var testWatch = TypeHelper({
    tsConfig: './tsconfig.json',
    basePath:'./',
    name: 'Watch Async'
})

testWatch.runWatch('./src');



// as promise/async/await

var doTypeCheck = async() => {

    var checker = TypeHelper({
        tsConfig: './tsconfig.json',
        basePath: './',
        name: 'Test Sync'
    })

    let totalErrors = await checker.runPromise();
    Console.log(totalErrors)
}

doTypeCheck();



```

### Output sample
![Output sample](https://github.com/fuse-box/fuse-box-typechecker/raw/master/image/sampleNew2.png "Output sample")



```typescript
interface IOptionsInterface {
    tsConfig: string; //config file (compared to basepath './tsconfig.json')
    throwOnSyntactic?: boolean; // if you want it to throwe error
    throwOnSemantic?: boolean; // if you want it to throwe error
    throwOnGlobal?: boolean; // if you want it to throwe error
    throwOnOptions?: boolean; // if you want it to throwe error
    throwOnTsLint?:  boolean; // trhow on lint errors
    basePath: string; // base path to use
    name?: string; // name, will be displayed when it runs, useful when you have more then 1
    tsLint: string; // config file (compared to basepath './tslint.json')
    lintoptions? ILintOptions; // see below, optional
    yellowLint?: boolean; // use yellow color instead of red on TSLint errors
    yellowOnOptions?: boolean; // use yellow color instead of red on Options errors
    yellowOnGlobal?: boolean; // use yellow color instead of red on Global errors
    yellowOnSemantic?: boolean; // use yellow color instead of red on Semantic errors
    yellowOnSyntactic?: boolean; // use yellow color instead of red on Syntactic errors
}


interface ILintOptions {
    fix?: boolean; // default is false
    formatter?: string; //JSON, can not be edited
    formattersDirectory?: string; //default is null
    rulesDirectory?: string; //default is null
}
```
