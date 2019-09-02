const build = target => {
    const checker = require('fuse-box-typechecker').TypeChecker({
        tsConfigOverride: {
            compilerOptions: {
                outDir: `./dist`,
                rootDir: `./src`,
                target: 'es2015',
                module: 'commonjs',
                lib: ['es2017', 'dom'],
                emitDecoratorMetadata: true,
                sourceMap: true,
                declaration: true,
                importHelpers: true,
                experimentalDecorators: true
            },
            exclude: ['dist', 'node_modules', 'src/sample', 'test', 'scripts']
        },
        basePath: `./`,
        name: `Building dist`
    });

    checker.printSettings();
    let result = checker.inspectOnly();
    checker.printOnly(result);
    console.log(result);
    if (
        result.optionsErrors.length ||
        result.globalErrors.length ||
        result.syntacticErrors.length ||
        result.semanticErrors.length
    ) {
        console.error(`  -> Errors not allowed on builds, skipping emit`);
    } else {
        console.log(`  -> Emitting js`);
        result.oldProgram.emit();
    }
};

build();
