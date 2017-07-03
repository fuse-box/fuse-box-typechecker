var srcRoot = 'src/';
var distRoot = 'dist/';
var distDevRoot = 'distTemp/';


module.exports = {
  root: srcRoot,
  source: srcRoot + '**/*.ts',
  output: distRoot,
  outputDev: distDevRoot,
  dtsSrc: [
    './typings/**/*.d.ts',
    './custom_typings/**/*.d.ts'
  ]
};
