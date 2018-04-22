# fuse-box-typechecker
Simple helper to do typechecking
You need to install typescript to use this, I suggest installing tslint also

### How to install
```npm install fuse-box-typechecker```


## Note
This have been tested with
 * "tslint": "^5.4.3",
 * "typescript": "^2.4.1"

So this might not work with earlier version if typescript and tslint (tsLint 3 will fail, been tested).
You do not need fusebox, can be used with any project



## How to use :

--- 
### Sync check
```javascript

// load
var TypeHelper = require('fuse-box-typechecker').TypeHelper
// it checks entire program every time
// see interface at bottom at readmefile for all options


var testSync = TypeHelper({
    tsConfig: './tsconfig.json',
    basePath:'./',
    tsLint:'./tslint.json', //you do not haveto do tslint too.. just here to show how.
    name: 'Test Sync'
})

testSync.runSync();

```

--- 
### Async check (worker)
```javascript

// load
var TypeHelper = require('fuse-box-typechecker').TypeHelper
// it checks entire program every time
// see interface at bottom at readme for all options


var testAsync = TypeHelper({
    tsConfig: './tsconfig.json',
    basePath:'./',
    name: 'Test async'
})

testAsync.runAsync();

// or with optional callback
testAsync.runAsync((errors: number) => {
    //  errors > 0 => notify
});


```

---
### Async check (worker)

```javascript

// load
var TypeHelper = require('fuse-box-typechecker').TypeHelper
// it checks entire program every time
// see interface at bottom at readme for all options

// Watch folder and use worker (uses internal watcher)
var testWatch = TypeHelper({
    tsConfig: './tsconfig.json',
    basePath:'./',
    name: 'Watch Async'
})

testWatch.runWatch('./src');

```

---
### Promise/async/await
```javascript


// load
var TypeHelper = require('fuse-box-typechecker').TypeHelper
// it checks entire program every time
// see interface at bottom at readme for all options


var doTypeCheck = async() => {

    var checker = TypeHelper({
        tsConfig: './tsconfig.json',
        basePath: './',
        name: 'Test Sync'
    })

    let totalErrors = await checker.runPromise();
    console.log(totalErrors)
}

doTypeCheck();


```

### How you can add to dev bundle process in fusebox

```javascript

//load all fusebox stuff, not showing here

// get typechecker 
const typechecker = require('fuse-box-typechecker').TypeHelper({
    tsConfig: './tsconfig.json',
    name: 'src',
    basePath: './',
    tsLint: './tslint.json',
    yellowOnLint: true,
    shortenFilenames:true
});

// create thread
typechecker.createThread();


let runTypeChecker = () => {
    // same color..
    console.log(`\x1b[36m%s\x1b[0m`, `app bundled- running type check`);
    
    //call thread (both are called right away, result comes later)
    typechecker.inspectCodeWithWorker(Object.assign(typechecker.options, { quit: false, type: 'watch' }));
    typechecker.printResultWithWorker();

}





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
            runTypeChecker();
        });

    // run
    return fuse.run()
}

```


#### Sample on transpiling (not bundling) a src folder and sparky

I use this in a private project [here](https://github.com/mframejs/mframejs/blob/master/build.js) to generate the dist folder

```javascript
//get type helper
var Transpile = require('fuse-box-typechecker').TypeHelper
const { task, src } = require('fuse-box/sparky');

// configure
var transpile = Transpile({
    tsConfig: './tsconfig.build.json',
    basePath: './',
    tsLint: './tslint.json',
    name: 'build',
    shortenFilenames: true,
    yellowOnLint: true,
    emit: true,
    clearOnEmit: true
});

// start watch, will only emit when there is no errors
transpile.runSync();

task('default', () => {
    src('**/*.*', { base: 'src/mframejs' }).clean('distTS/').dest('distTS/').exec();
});

```



### Output sample
![Output sample](https://github.com/fuse-box/fuse-box-typechecker/raw/master/image/sampleNew2.png "Output sample")


### Interface

```typescript
interface ITypeCheckerOptionsInterface {
    tsConfig: string; //config file (compared to basepath './tsconfig.json')
    throwOnSyntactic?: boolean; // if you want it to throw error
    throwOnSemantic?: boolean; // if you want it to throw error
    throwOnGlobal?: boolean; // if you want it to throw error
    throwOnOptions?: boolean; // if you want it to throw error
    throwOnTsLint?:  boolean; // trhow on lint errors
    basePath: string; // base path to use
    name?: string; // name, will be displayed when it runs, useful when you have more then 1
    tsLint: string; // config file (compared to basepath './tslint.json')
    lintoptions? ILintOptions; // see below, optional
    yellowOnLint?: boolean; // use yellow color instead of red on TSLint errors
    yellowOnOptions?: boolean; // use yellow color instead of red on Options errors
    yellowOnGlobal?: boolean; // use yellow color instead of red on Global errors
    yellowOnSemantic?: boolean; // use yellow color instead of red on Semantic errors
    yellowOnSyntactic?: boolean; // use yellow color instead of red on Syntactic errors
    shortenFilenames?: boolean; // use shortened filenames in order to make output less noisy
    
    // when not using with fusebox or just typechecking (remember to install typescript and tslint)
    emit?: boolean;// emit files according to tsconfig file
    clearOnEmit? : boolean // output folder on emit
}

// Note
// - The throwOnError options just exits node process with error 1, not 0 (success), to make something like travis to react.


interface ILintOptions {
    fix?: boolean; // default is false
    formatter?: string; //JSON, can not be edited
    formattersDirectory?: string; //default is null
    rulesDirectory?: string; //default is null
}
```
