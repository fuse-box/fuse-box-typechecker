# fuse-box-typechecker

## (needs fuse-box 2.0.0.beta.8 ++)

### How to install
```npm install git://github.com/fuse-box/fuse-box-typechecker --save-dev```


### Output sample
![Output sample](https://github.com/fuse-box/fuse-box-typechecker/raw/master/image/sampleNew.png "Output sample")


### How to use
```javascript

var TypeHelper = require('./dist/commonjs/index.js').TypeHelper

var ts = TypeHelper({
    tsConfig: './tsconfig.json'
})
ts.runSync();


```



