// mostly a little from compiler API, gulp-typescript, tslint and a lot of failing :-)

import * as child from 'child_process';
import * as path from 'path';
import { ILintOptions, ITypeCheckerOptions, WorkerCommand, TypecheckerRunType, IInternalTypeCheckerOptions } from './interfaces';
import { Checker } from './checker';
import * as watch from 'watch';
import * as ts from 'typescript';
import * as chalk from 'chalk';


export class TypeHelperClass {
    private options: ITypeCheckerOptions;
    private worker: child.ChildProcess;
    private checker: Checker;
    private monitor: any;
    private watchTimeout: NodeJS.Timer;
    private isWorkerInspectPreformed: boolean;


    constructor(options: ITypeCheckerOptions) {
        this.checker = new Checker();
        this.options = options;

        // get/set base path
        this.options.basePath = options.basePath ? path.resolve(process.cwd(), options.basePath) : process.cwd();
        this.writeText(chalk.yellow(`${'\n'}Typechecker basepath: ${chalk.white(`${this.options.basePath}${'\n'}`)}`));

        // get name
        this.options.name = this.options.name ? ':' + this.options.name : '';

        // tslint options
        let lintOp = this.options.lintoptions;
        this.options.lintoptions = lintOp ? lintOp : ({} as ILintOptions);

        // fix tslint options so tslint do not complain
        this.options.lintoptions = {
            fix: this.options.lintoptions.fix || false, // <- this can be useful to have
            formatter: 'json',
            formattersDirectory: this.options.lintoptions.formattersDirectory || null,
            rulesDirectory: this.options.lintoptions.rulesDirectory || null
        };

        // get tsconfig path and options
        let tsconf = this.getPath(options.tsConfig);
        (<IInternalTypeCheckerOptions>this.options).tsConfigJsonContent = require(tsconf);
        this.writeText(chalk.yellow(`Typechecker tsconfig: ${chalk.white(`${tsconf}${'\n'}`)}`));

        // get tslint path and options
        if (options.tsLint) {
            let tsLint = this.getPath(options.tsLint);
            this.writeText(chalk.yellow(`Typechecker tsLint: ${chalk.white(`${tsLint}${'\n'}`)}`));
        }
    }



    /**
     * Runs in own thread/works and quits
     *
     */
    public runAsync(callback?: (errors: number) => void): void {

        // set options, add if it need to quit and run type
        let options: IInternalTypeCheckerOptions = Object.assign(this.options, { quit: true, type: TypecheckerRunType.async });

        // create thread
        this.createThread(callback);

        // inspect our code
        this.inspectCodeWithWorker(options);

        // call worker
        if(callback) {
            this.pushResultWithWorker();
        }else{
            this.printResultWithWorker();
        }
    }


    /**
     * Runs in sync and quits
     * Returns total errors
     */
    public runSync(): number {

        // set options, add if it need to quit and run type
        let options: IInternalTypeCheckerOptions = Object.assign(this.options, { quit: true, type: TypecheckerRunType.sync });

        // inspect our code
        this.checker.inspectCode(options);

        // print result to screen and return total errors
        return this.checker.printResult();
    }


    /**
     * Runs in sync but return promise and callbacks and quits
     *
     */
    public runPromise(): Promise<number> {

        // return promise so we can use it wrih then() or async/await
        return new Promise((resolve: Function, reject: Function) => {

            // wrap in try/catch so we can do reject if it fails
            try {

                // set options, add if it need to quit and run type
                let options: IInternalTypeCheckerOptions = Object.assign(this.options, { quit: true, type: TypecheckerRunType.promiseSync });

                // inspect our code
                this.checker.inspectCode(options);

                // print result to screen and return total errors
                let errors = this.checker.printResult();

                // return result
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

        // set options, add if it need to quit and run type
        let options: IInternalTypeCheckerOptions = Object.assign(this.options, { quit: false, type: TypecheckerRunType.watch });

        // const
        const write = this.writeText;
        const END_LINE = '\n';

        // create thread and inspect code with worker
        this.createThread();
        this.inspectCodeWithWorker(options);

        // current basepath to watch
        let basePath = this.getPath(pathToWatch);

        watch.createMonitor(basePath, (monitor: any) => {

            // tell user what path we are watching
            write(chalk.yellow(`Typechecker watching: ${chalk.white(`${basePath}${END_LINE}`)}`));

            // on created file event
            monitor.on('created', (f: any /*, stat: any*/) => {
                write(END_LINE + chalk.yellow(`File created: ${f}${END_LINE}`));
            });

            // on changed file event
            monitor.on('changed', (f: any /*, curr: any, prev: any*/) => {

                // tell user about event
                write(END_LINE + chalk.yellow(`File changed: ${chalk.white(`${f}${END_LINE}`)}`));
                write(chalk.grey(`Calling typechecker${END_LINE}`));

                // have inside timeout, so we only run once when multible files are saved
                clearTimeout(this.watchTimeout);
                this.watchTimeout = setTimeout(() => {

                    // inspect and print result
                    this.inspectCodeWithWorker(options);
                    this.printResultWithWorker();
                }, 500);

            });

            monitor.on('removed', (f: any /*, stat: any*/) => {

                // tell user about event
                write(END_LINE + chalk.yellow(`File removed: ${chalk.white(`${f}${END_LINE}`)}`));
                write(chalk.grey(`Calling typechecker${END_LINE}`));

                // have inside timeout, so we only run once when multible files are saved
                clearTimeout(this.watchTimeout);
                this.watchTimeout = setTimeout(() => {

                    // inspect and print result
                    this.inspectCodeWithWorker(options);
                    this.printResultWithWorker();
                }, 500);

            });

            // set to class so we can stop it later if error is thrown
            this.monitor = monitor;
        });

        // print result, since its our first run
        this.printResultWithWorker();

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
    private inspectCodeWithWorker(options: ITypeCheckerOptions): void {
        this.worker.send({ type: WorkerCommand.inspectCode, options: options });

        // we set this so we can stop worker print from trying to run
        this.isWorkerInspectPreformed = true;
    }



    /**
     * Tells worker to do a typecheck
     *
     */
    private printResultWithWorker(): void {

        // have we inspected code?
        if (this.isWorkerInspectPreformed) {

            // all well, lets preform printout
            this.worker.send({ type: WorkerCommand.printResult });
        } else {
            this.writeText('You can not run pront before you have inspected code first');
        }
    }


    /**
     * Tells worker to do a typecheck
     *
     */
    private pushResultWithWorker(): void {
        
        // have we inspected code?
        if (this.isWorkerInspectPreformed) {

            // all well, lets preform printout
            this.worker.send({ type: WorkerCommand.pushResult });
        } else {
            this.writeText('You can not run pront before you have inspected code first');
        }
    }


    /**
     * Creates thread/worker
     *
     */
    private createThread(callback?: (errors: number) => void): void {

        // create worker fork
        this.worker = child.fork(path.join(__dirname, 'worker.js'), []);

        // listen for worker messages
        this.worker.on('message', (msg: any) => {

            if(callback && msg && typeof msg === 'object' && msg.type === 'result') {
                callback(msg.result);
            }

            if (msg === 'error') {

                // if error then exit
                this.writeText('error typechecker');
                process.exit(1);
            } else {

                // if not error, then just kill worker
                this.writeText('killing worker');
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



    /**
     * gets path based on basepath being set
     *
     */
    private getPath(usePath: string): string {
        return this.options.basePath ? path.resolve(this.options.basePath, usePath) : path.resolve(process.cwd(), usePath);
    }


}

// return new typechecker
export const TypeHelper = (options: ITypeCheckerOptions): TypeHelperClass => {
    return new TypeHelperClass(options);
};

