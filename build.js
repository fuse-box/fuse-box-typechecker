const transpiler = require('fuse-box-typechecker').TypeHelper;

const transpileTo = function (outDir, moduleType) {
  var transpile = transpiler({
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
  // skip for now : transpileTo('dist/amd/', 'amd');
  // skip for now : transpileTo('dist/system/', 'system');
  // skip for now : transpileTo('dist/es2015/', 'es2015');

}