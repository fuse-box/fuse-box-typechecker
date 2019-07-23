// mostly a little from compiler API, gulp-typescript, tslint and a lot of failing :-)

import * as child from 'child_process';
import * as path from 'path';
import {
    ILintOptions,
    ITypeCheckerOptions,
    WorkerCommand,
    TypecheckerRunType,
    IResults
} from './interfaces';
import chalk from 'chalk';
import * as ts from 'typescript';
import './register.json5';
import { getPath } from './getPath';
import { inspectCode } from './inspectCode';
import { printResult, print } from './printResult';

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

    public printSettings(options: ITypeCheckerOptions) {
        // configuration name
        print(chalk.yellow(`${'\n'}Typechecker name: ${chalk.white(`${options.name}${'\n'}`)}`));

        // base path being used
        print(chalk.yellow(`Typechecker basepath: ${chalk.white(`${options.basePath}${'\n'}`)}`));

        // get tsconfig path and options
        if (options.tsConfig) {
            let tsconf = getPath(options.tsConfig, options);
            print(chalk.yellow(`Typechecker tsconfig: ${chalk.white(`${tsconf}${'\n'}`)}`));
        } else {
            print(
                chalk.yellow(
                    `Typechecker tsconfig: ${chalk.white(`undefined, using ts defaults${'\n'}`)}`
                )
            );
        }

        // get tslint path and options
        if (options.tsLint) {
            let tsLint = getPath(options.tsLint, options);
            print(chalk.yellow(`Typechecker tsLint: ${chalk.white(`${tsLint}${'\n'}`)}`));
        }
    }

    public inspectAndPrint_local(): number {
        const lastResult = inspectCode(this.options);
        return printResult(this.options, lastResult);
    }

    public inspect_local(oldProgram: ts.EmitAndSemanticDiagnosticsBuilderProgram) {
        return inspectCode(this.options, oldProgram);
    }

    public print_local(errors: IResults) {
        return printResult(this.options, errors);
    }

    public startWatch(pathToWatch: string): void {
        this.startWorker();
        this.worker.send({
            quit: false,
            type: TypecheckerRunType.watch,
            pathToWatch: pathToWatch,
            options: this.options
        });
    }

    public kill(): void {
        if (this.worker) {
            this.worker.kill();
        }
    }

    public inspect_worker(): void {
        if (!this.worker) {
            this.startWorker();
        }
        this.worker.send({ type: WorkerCommand.inspectCode, options: this.options });
    }

    public print_worker(): void {
        if (!this.worker) {
            print('Need to inspect code before printing first');
        } else {
            this.worker.send({ type: WorkerCommand.printResult, options: this.options });
        }
    }

    public inspectAndPrint_worker(): void {
        if (!this.worker) {
            print('Need to inspect code before printing first');
        } else {
            this.worker.send({ type: WorkerCommand.printResult, options: this.options });
        }
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
                this.kill();
            }
        });
    }
}

export const TypeChecker = (options: ITypeCheckerOptions): TypeHelperClass => {
    return new TypeHelperClass(options);
};
