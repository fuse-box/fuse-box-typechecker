const checker = require('./dist/index.js').TypeChecker({
    tsConfig: './tsconfig.json',
    basePath: './',
    name: 'checkerSync',
  /*   print_summary: true,
    print_runtime: true */
});
//checker.printSettings();
checker.inspectAndPrint();