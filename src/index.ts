import * as child from 'child_process';
import * as path from 'path';
import {
    ILintOptions,
    ITypeCheckerOptions,
    WorkerCommand,
    TypecheckerRunType,
    IResults
} from './interfaces';

import * as ts from 'typescript';
import './register.json5';
import { getPath } from './getPath';
import { inspectCode } from './inspectCode';
import { printResult, print } from './printResult';
import { printSettings } from './printSettings';


export class TypeHelperClass {
    private options: ITypeCheckerOptions;
    private worker: child.ChildProcess;

    constructor(options: ITypeCheckerOptions) {
        this.options = options;

        // get/set base path
        this.options.basePath = options.basePath
            ? path.resolve(process.cwd(), options.basePath)
            : process.cwd();

        // get name
        this.options.name = this.options.name ? ':' + this.options.name : '';

        // shorten filenames to de-clutter output?
        this.options.shortenFilenames = !!this.options.shortenFilenames;

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
        if (options.tsConfig) {
            let tsconf = getPath(options.tsConfig, options);
            this.options.tsConfigJsonContent = require(tsconf);
        } else {
            // no settings, using default
            this.options.tsConfigJsonContent = {
                compilerOptions: {}
            };
        }

        if (options.tsConfigOverride) {
            let oldConfig = this.options.tsConfigJsonContent;
            for (let att in options.tsConfigOverride) {
                if (att === 'compilerOptions') {
                    if (oldConfig.compilerOptions) {
                        for (let attCom in (<any>options.tsConfigOverride).compilerOptions) {
                            if (attCom) {
                                oldConfig.compilerOptions[attCom] = (<any>(
                                    options.tsConfigOverride
                                )).compilerOptions[attCom];
                            }
                        }
                    } else {
                        oldConfig.compilerOptions = (<any>options.tsConfigOverride).compilerOptions;
                    }
                } else {
                    oldConfig[att] = (<any>options.tsConfigOverride)[att];
                }
            }
        }
    }

    public printSettings() {
        printSettings(this.options);
    }

    public inspectAndPrint(): number {
        const lastResult = inspectCode(this.options);
        return printResult(this.options, lastResult);
    }

    public inspectOnly(oldProgram: ts.EmitAndSemanticDiagnosticsBuilderProgram) {
        return inspectCode(this.options, oldProgram);
    }

    public printOnly(errors: IResults) {
        return printResult(this.options, errors);
    }

    public worker_watch(pathToWatch: string): void {
        this.startWorker();
        this.worker.send({
            quit: false,
            type: TypecheckerRunType.watch,
            pathToWatch: pathToWatch,
            options: this.options
        });
    }

    public worker_kill(): void {
        if (this.worker) {
            this.worker.kill();
        }
    }

    public worker_Inspect(): void {
        if (!this.worker) {
            this.startWorker();
        }

        this.worker.send({ type: WorkerCommand.inspectCode, options: this.options });
    }

    public worker_print(): void {
        if (!this.worker) {
            print('Need to inspect code before printing first');
        } else {
            this.worker.send({ type: WorkerCommand.printResult, options: this.options });
        }
    }

    public worker_inspectAndPrint(): void {
        if (!this.worker) {
            this.startWorker();
        }
        this.worker.send({ type: WorkerCommand.inspectCodeAndPrint, options: this.options });
    }

    private startWorker(): void {
        // create worker fork
        this.worker = child.fork(path.join(__dirname, 'worker.js'), []);

        // listen for worker messages
        this.worker.on('message', (msg: any) => {
            if (msg === 'error') {
                // if error then exit
                print('error typechecker');
                process.exit(1);
            } else {
                // if not error, then just kill worker
                print('killing worker');
                this.worker_kill();
            }
        });
    }
}

export const TypeChecker = (options: ITypeCheckerOptions): TypeHelperClass => {
    return new TypeHelperClass(options);
};
