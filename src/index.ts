// mostly a little from compiler API, gulp-typescript, tslint and a lot of failing :-)

import * as child from 'child_process';
import * as path from 'path';
import { LintOptions, TypeCheckerOptions } from './interfaces';
import { Checker } from './checker';
import * as watch from 'watch';
import * as ts from 'typescript';
import * as chalk from 'chalk';


export class TypeHelperClass {
    private options: TypeCheckerOptions;
    private worker: child.ChildProcess;
    private checker: Checker;
    private monitor: any;


    constructor(options: TypeCheckerOptions) {
        this.checker = new Checker();
        this.options = options;

        // get/set base path
        this.options.basePath = options.basePath ? path.resolve(process.cwd(), options.basePath) : null;
        this.writeText(chalk.yellow(`${'\n'}Typechecker basepath: ${chalk.white(`${this.options.basePath}${'\n'}`)}`));

        // get name
        this.options.name = this.options.name ? ':' + this.options.name : '';

        // tslint options
        let lintOp = this.options.lintOptions;
        this.options.lintOptions = lintOp ? lintOp : ({} as LintOptions);

        this.options.lintOptions = {
            fix: this.options.lintOptions.fix || null, // <- this can be useful to have
            formatter: 'json',
            formattersDirectory: this.options.lintOptions.formattersDirectory || null,
            rulesDirectory: this.options.lintOptions.rulesDirectory || null
        };

        // get tsconfig path and options
        let tsconf = this.options.basePath ? path.resolve(this.options.basePath, options.tsConfig) : path.resolve(process.cwd(), options.tsConfig);
        this.options.tsConfigObj = require(tsconf);
        this.writeText(chalk.yellow(`Typechecker tsconfig: ${chalk.white(`${tsconf}${'\n'}`)}`));

        // get tslint path and options
        if (options.tsLint) {
            let tsLint = this.options.basePath ? path.resolve(this.options.basePath, options.tsLint) : path.resolve(process.cwd(), options.tsLint);
            this.writeText(chalk.yellow(`Typechecker tsLint: ${chalk.white(`${tsLint}${'\n'}`)}`));
        }
    }



    /**
     * Runs in own thread/works and quits
     *
     */
    public runAsync(): void {
        let options = Object.assign(this.options, { quit: true, type: 'async' });
        this.createThread();
        this.configureWorker(options);
        this.runWorker();
    }


    /**
     * Runs in sync and quits
     * Returns total errors
     */
    public runSync(): number {
        let options = Object.assign(this.options, { finished: true, type: 'sync' });
        this.checker.configure(options);
        return this.checker.typecheck();
    }


    /**
     * Runs in sync but return promise and callbacks and quits
     *
     */
    public runPromise(): Promise<number> {
        return new Promise((resolve: Function, reject: Function) => {
            try {
                let options = Object.assign(this.options, { finished: true, type: 'sync' });
                this.checker.configure(options);
                let errors = this.checker.typecheck();
                resolve(errors);
            } catch (err) {
                reject(err);
            }
        });
    }



    /**
     * Creates thread/worker, starts watch on path and runs
     *
     */
    public runWatch(pathToWatch: string): void {
        let options = Object.assign(this.options, { quit: false, type: 'watch' });
        const write = this.writeText;
        const END_LINE = '\n';

        this.createThread();
        this.configureWorker(options);
        let basePath = this.options.basePath ? path.resolve(this.options.basePath, pathToWatch) : path.resolve(process.cwd(), pathToWatch);
        watch.createMonitor(basePath, (monitor: any) => {

            write(chalk.yellow(`Typechecker watching: ${chalk.white(`${basePath}${END_LINE}`)}`));

            monitor.on('created', (f: any /*, stat: any*/) => {
                write(END_LINE + chalk.yellow(`File created: ${f}${END_LINE}`));
            });

            monitor.on('changed', (f: any /*, curr: any, prev: any*/) => {
                write(END_LINE + chalk.yellow(`File changed: ${chalk.white(`${f}${END_LINE}`)}`));
                write(chalk.grey(`Calling typechecker${END_LINE}`));
                this.configureWorker(options);
                this.runWorker();
            });

            monitor.on('removed', (f: any /*, stat: any*/) => {
                write(END_LINE + chalk.yellow(`File removed: ${chalk.white(`${f}${END_LINE}`)}`));
                write(chalk.grey(`Calling typechecker${END_LINE}`));
                this.configureWorker(options);
                this.runWorker();
            });

            this.monitor = monitor;
        });
        this.runWorker();

    }


    /**
     * Kills worker and watch if started
     *
     */
    public killWorker(): void {
        if (this.worker) {
            this.worker.kill();
        }

        if (this.monitor) {
            this.monitor.stop();
        }
    }



    /**
     * Configure worker, internal function
     *
     */
    private configureWorker(options: TypeCheckerOptions): void {
        this.worker.send({ type: 'configure', options: options });
    }



    /**
     * Tells worker to do a typecheck
     *
     */
    private runWorker(): void {
        this.worker.send({ type: 'run' });
    }




    /**
     * Creates thread/worker
     *
     */
    private createThread(): void {
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



    /**
     * Helper to write to cmd
     *
     */
    private writeText(text: string): void {
        ts.sys.write(text);
    }

}



export const TypeHelper = (options: any) => {
    return new TypeHelperClass(options);
};

