const { fusebox, sparky } = require('fuse-box');
const { pluginTypeChecker } = require('../src/index');

const Context = class {
    getConfig() {
        return fusebox({
            target: 'browser',
            homeDir: '../test',
            output: `dist`,
            entry: `test.ts`,
            webIndex: {
                template: `../test/index.html`
            },
            log: false,
            cache: {
                root: '.cache',
                enabled: false
            },
            watch: { ignored: ['dist', 'dev'] },
            hmr: false,
            devServer: false,
            plugins: [
                pluginTypeChecker({
                    basePath: './test',
                    dev_print: true,
                    name: 'checkerSync',
                    tsConfigOverride: {
                        compilerOptions: {
                            rootDir: `./testfail`,
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
                })
            ]
        });
    }
};
const { task } = sparky(Context);

task('default', async ctx => {
    ctx.runServer = true;
    const fuse = ctx.getConfig();
    await fuse.runDev();
});
