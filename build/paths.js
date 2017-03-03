var srcRoot = 'src/';
var distRoot = 'dist/';


module.exports = {
  root: srcRoot,
  source: srcRoot + '**/*.ts',
  output: distRoot,
  dtsSrc: [
    './typings/**/*.d.ts',
    './custom_typings/**/*.d.ts'
  ]
};
