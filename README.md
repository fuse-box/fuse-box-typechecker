# fuse-box-typechecker

## (needs fuse-box 2.0.0.beta.8 ++)

### How to install
```npm install git://github.com/fuse-box/fuse-box-typechecker --save-dev```


### Output sample
![Output sample](https://github.com/fuse-box/fuse-box-typechecker/raw/master/image/sampleNew.png "Output sample")


### How to use
```javascript

var build = function () {

    const TypeCheckPlugin = require('fuse-box-typechecker').TypeCheckPlugin
    
    const {
        FuseBox,
        HTMLPlugin,
        RawPlugin,
        TypeScriptHelpers
    } = require("fsbx");


    const fuse = FuseBox.init({
        homeDir: "src",
        output: "dist/$name.js",
        plugins: [
           TypeCheckPlugin(), // se interface in the bottom for options
            HTMLPlugin(), 
            [".css", RawPlugin({extensions: ['.css']})], 
            TypeScriptHelpers()
            
            ]
    });

    fuse.bundle("vendor")
        .cache(true)
        .instructions(` 
            + aurelia-bootstrapper
            + fuse-box-aurelia-loader
            + aurelia-framework
            + aurelia-pal
            + aurelia-metadata
            + aurelia-loader-default
            + aurelia-polyfills
            + aurelia-fetch-client
            + aurelia-pal-browser
            + aurelia-animator-css
            + aurelia-logging-console 
            + aurelia-templating-binding 
            + aurelia-templating-resources 
            + aurelia-event-aggregator 
            + aurelia-history-browser 
            + aurelia-templating-router`) 


    fuse.bundle("app")
        //.watch(false).cache(false)
        .sourceMaps(true)
        .instructions(` 
            > [main.ts]
            + [**/*.{ts,html,css}]`)      

    // don't change the port (know issue with hmr)
    fuse.dev({ port: 4445, httpServer: true, root:'.' });
    fuse.run();
 }

build();

```

```

interface OptionsInterface {
    quit?: boolean;  //quits after first run
    throwOnSyntactic?: boolean; // exits with error code 1 if any error
    throwOnSemantic?: boolean; // exits with error code 1 if any error
    throwOnGlobal?: boolean; // exits with error code 1 if any error
    throwOnOptions?: boolean; // exits with error code 1 if any error
}
```


