const { fusebox, sparky } = require('fuse-box');
const { pluginTypeChecker } = require('../src/index');

class Context {
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
                    tsConfig: './tsconfig.json'
                })
            ]
        });
    }
}
const { task } = sparky(Context);

task('default', async ctx => {
    ctx.runServer = true;
    const fuse = ctx.getConfig();
    await fuse.runDev();
});
