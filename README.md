### NB! This is readme for 3.0.0 - vNext version
See [here for v2 docs](https://github.com/fuse-box/fuse-box-typechecker/tree/dee2380a88b66704299b1c2e3345d935ca21f651)

# fuse-box-typechecker 3.0.0-vNext
Simple helper to do typechecking
You need to install typescript to use this

### How to install
```npm install fuse-box-typechecker```


## Note
This have been tested with
 * "typescript": "^3.5.3"

---

## How to load and configure
```js
// get typechecker
const checker = require('fuse-box-typechecker').TypeChecker({
    tsConfig: './tsconfig.json',
    basePath: './',
    name: 'checkerSync'
});


// to run it right away
checker.printSettings();
checker.inspectAndPrint();

// or just run watch, it will now run in own tread and wait for changes
typechecker.worker_watch('./src');


// see public function for more ways to use it

```

### public function

```ts
printSettings(): void;
inspectAndPrint(): number;
inspectOnly(oldProgram: ts.EmitAndSemanticDiagnosticsBuilderProgram): IResults;
printOnly(errors: IResults): number;
worker_watch(pathToWatch: string): void;
worker_kill(): void;
worker_inspect(): void;
worker_PrintSettings(): void;
worker_print(): void;
worker_inspectAndPrint(): void;

```


### Interface

```typescript


// options
interface ITypeCheckerOptionsInterface {
    //config file (compared to basepath './tsconfig.json')
    tsConfig: string; 
    
    
    
    // override tsconfig settings, does not override entire compilerOptions object, only parts you set
    tsConfigOverride: Object 
       
    
    // base path to use
    basePath: string; 
    
    
    // name, will be displayed when it runs, useful when you have more then 1 checker
    name?: string; 

    // throw options
    throwOnSyntactic?: boolean;
    throwOnSemantic?: boolean;
    throwOnGlobal?: boolean;
    throwOnOptions?: boolean;
       
    
    
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


export interface IResults {
    oldProgram: ts.EmitAndSemanticDiagnosticsBuilderProgram;
    optionsErrors: ts.Diagnostic[];
    globalErrors: ts.Diagnostic[];
    syntacticErrors: ts.Diagnostic[];
    semanticErrors: ts.Diagnostic[];
    elapsedInspectionTime: number;
}
```