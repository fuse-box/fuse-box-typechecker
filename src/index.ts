// mostly a little from compiler API, gulp-typescript, tslint and a lot of failing :-)

import * as child from 'child_process';
import * as path from 'path';


export class TypeCheckPluginClass {
    public options: any;
    private firstRun: boolean;
    private slave: any;
    private countBundles = 0;
    private countBundleEnd = 0;

    constructor(options: any) {
        this.options = options || {};
        this.options.bundles = this.options.bundles || [];
        this.slave = child.fork(path.join(__dirname, 'worker.js'), [], options);
        this.slave.on('message', (err: any) => {
            if (err = 'error') {
                console.log('error typechecker');
                process.exit(1);
            }
        });
        this.firstRun = true;
    }


    public init(context: any) {
        if (this.countBundles === 0) {
            let tsConfig = context.getTypeScriptConfig();
            switch (true) {
                case this.options.quit && this.firstRun:
                    this.slave.send({ type: 'tsconfig', data: tsConfig });
                    break;
                case !this.options.quit && this.firstRun:
                    this.slave.send({ type: 'tsconfig', data: tsConfig });
                    break;
                case !this.options.quit && !this.firstRun:
                    this.slave.send({ type: 'tsconfig', data: tsConfig });
                    break;
            }
        }
        this.countBundles++;
    }


    public bundleEnd() {
        this.countBundleEnd++;
        if (this.countBundleEnd = this.countBundles) {
            setTimeout(() => {
                switch (true) {
                    case this.options.quit && this.firstRun:
                        this.slave.send({ type: 'run', options: this.options });
                        this.firstRun = false;
                        break;
                    case !this.options.quit && this.firstRun:
                        this.slave.send({ type: 'run', options: this.options });
                        this.firstRun = false;
                        break;
                    case !this.options.quit && !this.firstRun:
                        this.slave.send({ type: 'run', options: this.options });
                        this.firstRun = false;
                }
            }, 100);
            this.countBundleEnd = 0;
            this.countBundles = 0;
        }
    }
}



export const TypeCheckPlugin = (options: any) => {
    return new TypeCheckPluginClass(options);
};

