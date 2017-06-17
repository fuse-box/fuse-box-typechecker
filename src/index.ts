// mostly a little from compiler API, gulp-typescript, tslint and a lot of failing :-)

import * as child from 'child_process';
import * as path from 'path';
import { OptionsInterface } from './interfaces';
import { Checker } from './checker';


export class TypeHelperClass {
    private options: OptionsInterface;
    private worker: child.ChildProcess;
    private checker: Checker;


    constructor(options: OptionsInterface) {
        this.checker = new Checker();
        this.options = options;
        this.options.name = this.options.name ? ':' + this.options.name : '';
        this.options.tsConfigObj = require(path.resolve(process.cwd(), options.tsConfig));
    }



    public runAsync() {
        let options = Object.assign(this.options, { quit: true, type: 'async' });
        this.createThread();
        this.configureWorker(options);
        this.runWorker();
    }



    public runSync() {
        let options = Object.assign(this.options, { finished: true, type: 'sync' });
        this.checker.configure(options);
        this.checker.typecheck();
    }



    private configureWorker(options: OptionsInterface) {

        this.worker.send({ type: 'configure', options: options });
    }



    private runWorker() {
        this.worker.send({ type: 'run' });
    }



    private createThread() {
        this.worker = child.fork(path.join(__dirname, 'worker.js'), [], this.options);
        this.worker.on('message', (err: any) => {
            if (err === 'error') {
                console.log('error typechecker');
                process.exit(1);
            } else {
                this.worker.kill();
            }
        });
    }

}



export const TypeHelper = (options: any) => {
    return new TypeHelperClass(options);
};

