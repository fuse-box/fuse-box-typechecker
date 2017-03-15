// mostly a little from compiler API, gulp-typescript, tslint and a lot of failing :-)

import * as child from 'child_process';
import * as path from 'path';


export class TypeCheckPluginClass {
    private options: any;
    private firstRun: boolean;
    private slave: any;

    constructor(options: any) {
        this.options = options || {};
        this.slave = child.fork(path.join(__dirname, 'worker.js'), [], options);
        this.firstRun = true;
    }

    public init(context: any) {
        let tsConfig = context.getTypeScriptConfig();
        this.slave.send({ type: 'tsconfig', data: tsConfig });
    }


    public bundleEnd() {
        this.slave.send({ type: 'run', quit: this.options.quit});
        this.firstRun = false;
    }






}



export const TypeCheckPlugin = (options: any) => {
    return new TypeCheckPluginClass(options);
};

