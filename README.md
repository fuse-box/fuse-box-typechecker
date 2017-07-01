# fuse-box-typechecker
Simple helper to do typechecking

### How to install
```npm install git://github.com/fuse-box/fuse-box-typechecker --save-dev```


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
interface OptionsInterface {
    tsConfig: string; //config file (compared to basepath './tsconfig.json')
    throwOnSyntactic?: boolean; // if you want it to throwe error
    throwOnSemantic?: boolean; // if you want it to throwe error
    throwOnGlobal?: boolean; // if you want it to throwe error
    throwOnOptions?: boolean; // if you want it to throwe error
    throwOnTsLint?:  boolean; // trhow on lint errors
    basePath: string; //base path to use
    name?: string; // name, will be displayed when it runs, useful when you have more then 1
    tsLint:string; //config file (compared to basepath './tslint.json')
    lintoptions? Lintoptions; // se below, optional
    yellowLint?: boolean; // use yellow color instead of red on TSLint erros
    yellowOnOptions?: boolean; // use yellow color instead of red on Options erros
    yellowOnGlobal?: boolean; // use yellow color instead of red on Global erros
    yellowOnSemantic?: boolean; // use yellow color instead of red on Semantic erros
    yellowOnSyntactic?: boolean; // use yellow color instead of red on Syntactic erros
}


interface Lintoptions {
    fix?: boolean; //dedault is false
    formatter?: string; //JSON, can not be edited
    formattersDirectory?: string; //default is null
    rulesDirectory?: string; //default is null
}
```
