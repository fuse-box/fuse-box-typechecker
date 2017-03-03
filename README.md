# fuse-box-typechecker

### How to install
```npm install git://github.com/fuse-box/fuse-box-typechecker --save-dev```


### Output sample
![Output sample](https://github.com/fuse-box/fuse-box-typechecker/raw/master/image/sample.png "Output sample")


### How to use
```javascript

var build = function () {

    let TypeCheckPlugin = require('fuse-box-typechecker').TypeCheckPlugin
    let fb = require("fsbx");
    let fuse = fb.FuseBox;


    let bundle = fuse.init({
        homeDir: "./src",
        outFile: "./bundle/fb-app-bundle.js",
        useCache: false,
        sourceMap: {
            bundleReference: "./fb-app-bundle.js.map",
            outFile: "./bundle/fb-app-bundle.js.map",
        },
        plugins: [
            fb.CSSPlugin(),
            fb.HTMLPlugin({
                useDefault: true
            }),
            fb.TypeScriptHelpers(),
            fb.SourceMapPlainJsPlugin(),
            TypeCheckPlugin()

        ]
    });

    // Start dev server and set it to root,need this because bundle is under folder "bundle"
    // as you see under we set entry to main.ts, here I put it inside [] because I want to control what modules get into bundle
    // never have more then 1 entry
    bundle.devServer(`
            > [main.ts]
            + [**/*.ts]
            + [**/*.html] 
            + [**/*.css]
            + bluebird
            + whatwg-fetch
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
            + aurelia-templating-router`, {
        root: './'
    });

}

build();
```




