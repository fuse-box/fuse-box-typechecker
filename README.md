##### NB! This is readme for 3.0.0 - vNext version
See [here for v2 docs](https://github.com/fuse-box/fuse-box-typechecker/tree/dee2380a88b66704299b1c2e3345d935ca21f651)

# fuse-box-typechecker 3.0.0-vNext
Simple helper to do typechecking
You need to install newest typescript to use this.

```npm install fuse-box-typechecker@next```


### Output sample with all options enabled
![Output sample](https://github.com/fuse-box/fuse-box-typechecker/raw/master/image/sampleNew8.png "Output sample")



---

## How to load and configure

#### As plugin for fusebox v4
```js
import {pluginTypeChecker} from 'fuse-box-typechecker';


//under plugins
    plugins:[pluginTypeChecker({
        tsConfig: './src/tsconfig', // optional, uses fusebox tsconfig if else
        name: 'Superman' // optional, uses "no-name" if missing
    })]

```

#### As Standalone


```js
// get typechecker, se under options for more info
const typeChecker = require('fuse-box-typechecker').TypeChecker({
    tsConfig: './tsconfig.json',
    basePath: './',
    name: 'checkerSync'
});


// to run it right away
typeChecker.printSettings();
typeChecker.inspectAndPrint();

// or just run watch, it will now run in own tread and wait for changes
typeChecker.worker_watch('./src');


// see public functions for more ways to use it



```

Emiting code

```js
const checker = require('fuse-box-type-checker').TypeChecker({
    tsConfig: './tsconfig.json',
    tsConfigOverride:{
        "compilerOptions": {
            "outDir": "testme/"
        }
    },
    basePath: './',
    name: 'checkerEmit'
});
checker.printSettings(); // optional
let result = checker.inspectOnly();
checker.printOnly(result); // optional...
result.oldProgram.emit();
```


---

#### Public functions

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


#### Options/interface info

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
    
    // use shortened filenames in order to make output less noisy
    shortenFilenames?: boolean; 
    
    // skip ts errors
    skipTsErrors?: number[];

    // print settings
    print_summary?: boolean; //default false
    print_runtime?: boolean //default false
    printFirstRun?: boolean //default false  /plugin only
    
}

// result from inspect code, u need this to run print
export interface IResults {
    oldProgram: ts.EmitAndSemanticDiagnosticsBuilderProgram;
    optionsErrors: ts.Diagnostic[];
    globalErrors: ts.Diagnostic[];
    syntacticErrors: ts.Diagnostic[];
    semanticErrors: ts.Diagnostic[];
    elapsedInspectionTime: number;
}
```
