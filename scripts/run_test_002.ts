import { TypeHelperClass } from '../src/index';
import { ITypeCheckerOptions } from '../src/interfaces';

const checker: TypeHelperClass = require('../src/index').TypeChecker(<ITypeCheckerOptions>{
    basePath: './test',
    name: 'checkerSync',
    tsConfigOverride: {
        compilerOptions: {
            rootDir: `./test`,
            baseUrl: `./test`,
            target: 'es2015',
            module: 'commonjs',
            lib: ['es2017', 'dom'],
            emitDecoratorMetadata: true,
            sourceMap: true,
            declaration: true,
            importHelpers: true,
            experimentalDecorators: true
        }
    }
});

checker.inspectAndPrint();
