// mostly a little from compiler API, gulp-typescript, tslint and a lot of failing :-)

import * as child from 'child_process';
import * as path from 'path';
import { OptionsInterface } from './interfaces';
import { Checker } from './checker';
import * as watch from 'watch';
import * as ts from 'typescript';
import * as chalk from 'chalk';


export class TypeHelperClass {
    private options: OptionsInterface;
    private worker: child.ChildProcess;
    private checker: Checker;
    private monitor: any;


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


    public runWatch(pathToWatch: string) {
        let options = Object.assign(this.options, { quit: false, type: 'watch' });
        const write = this.writeText;
        const END_LINE = '\n';

        this.createThread();
        this.configureWorker(options);
        watch.createMonitor(path.resolve(process.cwd(), pathToWatch), (monitor: any) => {

            write(chalk.yellow(`Stating watch on path: ${chalk.white(`${path.resolve(process.cwd(), pathToWatch)}${END_LINE}`)}`));

            monitor.on('created', (f: any /*, stat: any*/) => {
                write(chalk.yellow(`File created: ${f}${END_LINE}`));
            });

            monitor.on('changed', (f: any /*, curr: any, prev: any*/) => {
                write(chalk.yellow(`File changed: ${chalk.white(`${f}${END_LINE}`)}`));
                write(chalk.grey(`Calling typechecker${END_LINE}`));
                this.configureWorker(options);
                this.runWorker();
            });

            monitor.on('removed', (f: any /*, stat: any*/) => {
                write(chalk.yellow(`File removed: ${chalk.white(`${f}${END_LINE}`)}`));
                write(chalk.grey(`Calling typechecker${END_LINE}`));
                this.configureWorker(options);
                this.runWorker();
            });

            this.monitor = monitor;
        });
        this.runWorker();

    }


    public killWorker() {
        if (this.worker) {
            this.worker.kill();
        }

        if (this.monitor) {
            this.monitor.stop();
        }
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
                console.log('killing worker');
                this.killWorker();
            }
        });
    }

    private writeText(text: string) {
        ts.sys.write(text);
    }

}



export const TypeHelper = (options: any) => {
    return new TypeHelperClass(options);
};

