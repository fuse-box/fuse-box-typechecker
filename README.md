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


### Output sample (image)
![Output sample](https://github.com/fuse-box/fuse-box-typechecker/raw/master/image/sampleNew2.png "Output sample")


---

## How to load and configure
```js
// get typechecker
const { TypeChecker } = require('fuse-box-typechecker');

const testSync = TypeChecker({
    tsConfig: './tsconfig.json',
    basePath:'./',
    tsLint:'./tslint.json', //optional
    name: 'Test Sync'
    // for more option, see ITypeCheckerOptionsInterface in bottom on readme
})

// call function
testSync.XXXXXXXX() //see public functions

```

### Public functions
```ts

/**
 * Runs in sync and quits
 * Returns total errors
 */
public runSync(): number


/**
 * Runs in own thread/works and quits
 *
 */
public runAsync(callback?: (errors: number) => void): void


/**
 * Runs in sync and quits
 * Returns result obj
 */
public runSilentSync(): IResults


/**
 * Runs in async and return promise and callbacks and quits
 *
 */
public runSilentPromise(): Promise<IResults>


/**
 * Runs in async and return promise and callbacks and quits
 *
 */
public runPromise(): Promise<number>


/**
 * Creates thread/worker, starts watch on path and runs
 *
 */
public runWatch(pathToWatch: string, callback?: Function): void


/**
 * Starts thread and wait for request to typecheck
 *
 */
public startTreadAndWait(): void


/**
 * Uses the created thread, typechecks and prints result
 * Does not quit after, needs to be killed manually
 *
 */
public useThreadAndTypecheck(): void


/**
 * Kills worker and watch if started (startTreadAndWait or watch..)
 *
 */
public killWorker(): void
```

### Interface

```typescript
interface ITypeCheckerOptionsInterface {
    tsConfig: string; //config file (compared to basepath './tsconfig.json')
    tsConfigOverride: Object // override tsconfig settings, does not override entire compilerOptions object, only parts you set
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
    clearOnEmit? : boolean; // output folder on emit
    skipTsErrors?: number[];// skip ts errors
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


# Samples

### Sync check (and quit)
```javascript

// load
const { TypeChecker } = require('fuse-box-typechecker');
// it checks entire program every time
// see interface at bottom at readmefile for all options


const testSync = TypeChecker({
    tsConfig: './tsconfig.json',
    basePath:'./',
    tsLint:'./tslint.json', //you do not haveto do tslint too.. just here to show how.
    name: 'Test Sync'
})

testSync.runSync();

```

--- 
### Async check (and quit)
```javascript

// load
const { TypeChecker } = require('fuse-box-typechecker');
// it checks entire program every time
// see interface at bottom at readme for all options


const testAsync = TypeChecker({
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
### Watch (stays alive)

```javascript

// load
const { TypeChecker } = require('fuse-box-typechecker');
// it checks entire program every time
// see interface at bottom at readme for all options

// Watch folder and use worker (uses internal watcher)
const testWatch = TypeChecker({
    tsConfig: './tsconfig.json',
    basePath:'./',
    name: 'Watch Async'
})

// add folder to watch
testWatch.runWatch('./src');

```

---
### Promise/async/await (and quit)
```javascript


// load
const { TypeChecker } = require('fuse-box-typechecker');
// it checks entire program every time
// see interface at bottom at readme for all options


const doTypeCheck = async() => {

    const checker = TypeChecker({
        tsConfig: './tsconfig.json',
        basePath: './',
        name: 'Test Sync'
    })

    let totalErrors = await checker.runPromise();
    console.log(totalErrors)
}

doTypeCheck();


```

---

### Manual thread and call update

Sample shows how to do it in fusebox

But main functions here is:
* `startTreadAndWait()`
* `useThreadAndTypecheck();`



```javascript

//load all fusebox stuff, not showing here
const { TypeChecker } = require('fuse-box-typechecker');
// get typechecker 
const typechecker = TypeChecker({
    tsConfig: './tsconfig.json',
    name: 'src',
    basePath: './',
    tsLint: './tslint.json',
    yellowOnLint: true,
    shortenFilenames:true
});

// create thread
typechecker.startTreadAndWait();


let runTypeChecker = () => {
    // same color..
    console.log(`\x1b[36m%s\x1b[0m`, `app bundled- running type check`);
    
    //use thread, tell it to typecheck and print result
    typechecker.useThreadAndTypecheck();

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
---

#### Transpiling (make dist source for package/node project)

* I use this in a private project [here](https://github.com/mframejs/mframejs/blob/master/build.js) to generate the dist folder.
* Update 2 June 2018: from version 2.10.0 this module will be using its prev. (2.9.0) version for transpiling 

```javascript
//get type helper
const { TypeChecker } = require('fuse-box-typechecker');

const transpileTo = function (outDir, moduleType) {
  var transpile = TypeChecker({
    tsConfig: './tsconfig.json',
    basePath: './',
    tsLint: './tslint.json',
    name: `building: ${moduleType}, at: ${outDir}`,
    shortenFilenames: true,
    yellowOnLint: true,
    emit: true,
    clearOnEmit: true,
    tsConfigOverride: {
      compilerOptions: {
        outDir: outDir,
        module: moduleType
      }
    }
  });
  return transpile.runSync();
};

// It will not emit code if any errors by default
var typeAndLintErrors = transpileTo('dist/commonjs/', 'commonjs');

if (!typeAndLintErrors) {

  // If commonjs had no errors then we do amd/system/es2015
  transpileTo('dist/amd/', 'amd');
  transpileTo('dist/system/', 'system');
  transpileTo('dist/es2015/', 'es2015');

}

```
---

### watch with emit code on node app

```js
//set process to current folder
process.chdir(__dirname);

//get typehelper
const { TypeChecker } = require('fuse-box-typechecker');
const spawn = require("child_process").spawn;
const path = require('path');
const npm = process.platform === "win32" ? "node.exe" : "node";

// configure
const transpiler = TypeChecker({
    tsConfig: './tsconfig.json',
    basePath: './',
    tsLint: './tslint.json',
    name: 'watch',
    shortenFilenames: true,
    yellowOnLint: true,
    emit: true,
    clearOnEmit: true
});
var childSpawn

// helper funtion
// will use callback to start and quit node app
// needed so node dont lock files for next emit/transpile
function run(type, errors) {
    const mode = "inherit";

    if (type === 'edit' || errors > 0) {
        if (childSpawn) {
            console.log('closing app')
            childSpawn.kill();
            childSpawn = null;
        }
    } else {
        function spawner(cmd, args, dirname) {
            childSpawn = spawn(cmd, args, {
                stdio: mode,
                cwd: dirname
            });
            childSpawn.on("exit", function(code) {
                if (code) {
                    console.log("\nNode app failed: " + code + '\n');
                } else {
                    console.log("\nNode app closed\n");
                }
            });
        }
        let mainPath = path.resolve(process.cwd(), './dev');
        spawner(npm, ["index"], mainPath);
    }
}


// start watch, will only emit when there is no errors
transpiler.runWatch('./src', run);

```


