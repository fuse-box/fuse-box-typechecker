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

### How you can add to dev bundle process

```javascript

//load all fusebox stuff, not showing here

// load
var TypeHelper = require('fuse-box-typechecker').TypeHelper

//create type chacker, it will display paths its using now
var typeHelper = TypeHelper({
    tsConfig: './tsconfig.json',
    basePath:'./',
    tsLint:'./tslint.json', //you do not haveto do tslint too.. just here to show how.
    name: 'App typechecker'
})




// this task will start fusebox
var buildFuse = (production) => {

    // init fusebox
    const fuse = FuseBox.init({
        homeDir: './src',
        output: './dist/$name.js',
        log: false,
        plugins: [
            autoLoadAureliaLoaders(),
            CSSPlugin(),
            HTMLPlugin(),
            RawPlugin(['.css'])
        ]
    });



    // vendor bundle
    fuse.bundle("vendor")
        .cache(true)
        .target('browser')
        .instructions(`
        + whatwg-fetch
        + something-else-u-need
        `)



    // app bundle
    let app = fuse.bundle('app')
        .instructions(`
            > [main.ts]
            + [**/*.{ts,html,css}]
        `)
        .target('browser')


    // is production build
    production ? null : app.watch()
        .cache(false)
        .sourceMaps(true)
        .completed(proc => {
            console.log(`\x1b[36m%s\x1b[0m`, `client bundled`);
            // run the type checking
            typeHelper.runSync();
        });

    // run
    return fuse.run()
}

```



### Output sample
![Output sample](https://github.com/fuse-box/fuse-box-typechecker/raw/master/image/sampleNew2.png "Output sample")



```typescript
interface ITypeCheckerOptionsInterface {
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
    shortenFilenames?: boolean; // use shortened filenames in order to make output less noisy
}


interface ILintOptions {
    fix?: boolean; // default is false
    formatter?: string; //JSON, can not be edited
    formattersDirectory?: string; //default is null
    rulesDirectory?: string; //default is null
}
```
