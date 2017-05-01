// mostly a little from compiler API, gulp-typescript, tslint and a lot of failing :-)

import * as child from 'child_process';
import * as path from 'path';


export class TypeCheckPluginClass {
    public options: any;
    private firstRun: boolean;
    private slave: any;

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
        if (this.options.bundles[0] == context.bundle.name) {
            if (this.options.quit && this.firstRun) {
                let tsConfig = context.getTypeScriptConfig();
                this.slave.send({ type: 'tsconfig', data: tsConfig });
            }

            if (!this.options.quit && this.firstRun) {
                let tsConfig = context.getTypeScriptConfig();
                this.slave.send({ type: 'tsconfig', data: tsConfig });
            }

            if (!this.options.quit && !this.firstRun) {
                let tsConfig = context.getTypeScriptConfig();
                this.slave.send({ type: 'tsconfig', data: tsConfig });
            }
        }
    }


    public bundleEnd(context: any) {
        if (this.options.bundles.length === 0) {
            console.warn("\n Typechecker \n No bundle selected, sample;\n TypeCheckPlugin({bundles:['app']})\n");
        } else {
            if (this.options.bundles[0] == context.bundle.name) {              
                switch(true){
                    case this.options.quit && this.firstRun :
                    this.slave.send({ type: 'run', options: this.options, bundle: context.bundle.name});
                    this.firstRun = false;
                    break;
                    case !this.options.quit && this.firstRun:
                    this.slave.send({ type: 'run', options: this.options, bundle: context.bundle.name });
                    this.firstRun = false;
                    break;
                    case !this.options.quit && !this.firstRun :
                    this.slave.send({ type: 'run', options: this.options, bundle: context.bundle.name });
                    this.firstRun = false;
                }
            }
        }
        
    }






}



export const TypeCheckPlugin = (options: any) => {
    return new TypeCheckPluginClass(options);
};

