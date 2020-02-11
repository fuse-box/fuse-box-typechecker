import * as child from 'child_process';
import * as path from 'path';
import { ITypeCheckerOptions, WorkerCommand, IResults, END_LINE } from './interfaces';

import * as ts from 'typescript';
import './register.json5';
import { getPath } from './getPath';
import { inspectCode } from './inspectCode';
import { printResult } from './printResult';
import { printSettings } from './printSettings';
import { Logger } from './logger';

export class TypeHelperClass {
    private options: ITypeCheckerOptions;
    private worker: child.ChildProcess;

    constructor(options: ITypeCheckerOptions) {
        this.options = options;

        // get/set base path
        if (!this.options) {
            (this.options as any) = {};
        }

        this.options.basePathSetup = options.basePath; // save original path
        this.options.basePath = options.basePath
            ? path.resolve(process.cwd(), options.basePath)
            : process.cwd();

        // get name
        this.options.name = this.options.name ? this.options.name : '';

        // shorten filenames to de-clutter output?
        this.options.shortenFilenames = this.options.shortenFilenames === false ? false : true;

        // get tsconfig path and options
        if (options.tsConfig) {
            let tsconf = getPath(options.tsConfig, options);
            this.options.tsConfigJsonContent = require(tsconf);
        } else {
            // no settings, using default
            if (!this.options.tsConfigJsonContent) {
                this.options.tsConfigJsonContent = {
                    compilerOptions: {}
                };
            }
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
        if (!errors || (errors && !errors.oldProgram)) {
            Logger.info(
                `<black><bold><bgYellow> WARNING </bgYellow></bold></black>  <yellow><bold>No old program in params, auto running inspect first</yellow></bold>`
            );
            return this.inspectAndPrint();
        } else {
            return printResult(this.options, errors);
        }
    }

    public worker_watch(pathToWatch: string): void {
        this.startWorker();
        this.worker.send({
            quit: false,
            type: WorkerCommand.watch,
            pathToWatch: pathToWatch,
            options: this.options
        });
    }

    public worker_kill(): void {
        if (this.worker) {
            this.worker.kill();
        }
    }

    public worker_inspect(): void {
        if (!this.worker) {
            this.startWorker();
        }

        this.worker.send({ type: WorkerCommand.inspectCode, options: this.options });
    }

    public worker_PrintSettings(): void {
        if (!this.worker) {
            this.startWorker();
        }

        this.worker.send({ type: WorkerCommand.printSettings, options: this.options });
    }

    public worker_print(): void {
        if (!this.worker) {
            Logger.info(
                '<black><bold><bgYellow> WARNING </bgYellow></bold></black> <yellow>Need to inspect code before printing first<yellow>'
            );
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
                Logger.echo(
                    '<black><bold><bgYellow> WARNING </bgYellow></bold></black> <yellow>- error typechecker</yellow>'
                );
                process.exit(1);
            } else {
                // if not error, then just kill worker
                Logger.echo(
                    `<black><bold><bgYellow> WARNING </bgYellow></bold></black> <yellow>`,
                    `<yellow>Typechecker(${this.options.name}) killing worker</yellow>`
                );
                this.worker_kill();
            }
        });
    }
}

export const TypeChecker = (options: ITypeCheckerOptions): TypeHelperClass => {
    return new TypeHelperClass(options);
};

export function pluginTypeChecker(opts?: any) {
    return (ctx: any) => {
        ctx.ict.on('complete', (props: any) => {
            // initial run
            if (opts) {
                opts.isPlugin = true;
                /*  
                    Disabled so alpha for v3 wont break, ctx going away
                    opts.homeDir = props.ctx.config.homeDir; 
               */
            } else {
                (<any>opts) = { isPlugin: true };
            }
            if (!opts.tsConfig && !opts.tsConfigJsonContent) {
                /* 
                    Disabled so alpha for v3 wont break
                    opts.tsConfigJsonContent = props.ctx.tsConfig && {
                    compilerOptions: props.ctx.tsConfig.jsonCompilerOptions
                }; */
                if (opts.tsConfigJsonContentPrint) {
                    console.log(JSON.stringify(opts.tsConfigJsonContent));
                }
            }

            ctx.typeChecker = TypeChecker(opts);
            if (ctx.config.env.NODE_ENV === 'production') {
                Logger.info(
                    `Typechecker (${opts.name ? opts.name : 'no-name'}):`,
                    `inspecting code, please wait...`
                );

                ctx.typeChecker.inspectAndPrint();
            } else {
                // only print text if not production run
                Logger.info(
                    `Typechecker (${opts.name ? opts.name : 'no-name'}):`,
                    `Starting thread. Will print status soon, please wait...`
                );

                if (opts.printFirstRun) {
                    ctx.typeChecker.worker_PrintSettings();
                    ctx.typeChecker.inspectAndPrint();
                }
                if (opts.dev_print) {
                    ctx.typeChecker.inspectAndPrint();
                } else {
                    ctx.typeChecker.worker_inspectAndPrint(); // do 1 check so it uses less time next time, we do not print by default
                }
            }
            return props;
        });
        ctx.ict.on('rebundle_complete', (props: any) => {
            Logger.info(
                `Typechecker (${opts.name ? opts.name : 'no-name'}):`,
                `Calling thread for new report, please wait...`
            );

            ctx.typeChecker.worker_inspectAndPrint();
            return props;
        });
    };
}
