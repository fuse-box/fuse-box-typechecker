### NB! This is readme for 3.0.0 - Alpha version
See [here for v2 docs](https://github.com/fuse-box/fuse-box-typechecker/tree/dee2380a88b66704299b1c2e3345d935ca21f651)

# fuse-box-typechecker
Simple helper to do typechecking
You need to install typescript to use this, I suggest installing tslint also

### How to install
```npm install fuse-box-typechecker```


## Note
This have been tested with
 * "tslint": "^5.18.0",
 * "typescript": "^3.5.3"

So this might not work with earlier version if typescript and tslint (tsLint 3 will fail, been tested).
You do not need fusebox, can be used with any project


### Output sample (image)
![Output sample](https://github.com/fuse-box/fuse-box-typechecker/raw/master/image/sampleNew2.png "Output sample")


---

## How to load and configure
```js
// get typechecker
const checker = require('./dist/commonjs/index.js').TypeChecker({
    tsConfig: './tsconfig.json',
    basePath: './',
    tsLint: './tslint.json',
    name: 'checkerSync'
});
checker.printSettings();
checker.inspectAndPrint();

// opional just run watch

```


### Interface

```typescript
interface ITypeCheckerOptionsInterface {
    //config file (compared to basepath './tsconfig.json')
    tsConfig: string; 
    
    
    
    // override tsconfig settings, does not override entire compilerOptions object, only parts you set
    tsConfigOverride: Object 
       
    
    // base path to use
    basePath: string; 
    
    
    // name, will be displayed when it runs, useful when you have more then 1 checker
    name?: string; 
    
    
    // config file (compared to basepath './tslint.json')
    tsLint: string; 
    
    
    // see below, optional
    lintoptions? ILintOptions; 
    
    
    // use yellow color instead of red on TSLint errors
    yellowOnLint?: boolean; 
    
    
    // use yellow color instead of red on Options errors
    yellowOnOptions?: boolean; 
    
    
    // use yellow color instead of red on Global errors
    yellowOnGlobal?: boolean; 
    
    
    // use yellow color instead of red on Semantic errors
    yellowOnSemantic?: boolean; 
    
    
    // use yellow color instead of red on Syntactic errors
    yellowOnSyntactic?: boolean; 
    
    
    // use shortened filenames in order to make output less noisy
    shortenFilenames?: boolean; 
    
    // skip ts errors
    skipTsErrors?: number[];
    
    


    
}
