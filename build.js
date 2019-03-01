//
// Sorry, this is a hack because this library uses an older version of itself
// to build. So since I added comments to the config files, they will break
// this build, so shimming it with this register.
// 
const fs = require('fs');
const JSON5 = require('json5');
// JSON5 has a register for the .json5 extension
// however, it does not overide .json.
// This will just override our require for *.json files and use
// JSON5 to parse.
require.extensions['.json'] = function (module, filename) {
  const content = fs.readFileSync(filename, 'utf8');
  try {
      module.exports = JSON5.parse(content);
  } catch (err) {
      err.message = filename + ': ' + err.message;
      throw err;
  }
};



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