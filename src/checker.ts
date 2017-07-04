import * as ts from 'typescript';
import * as chalk from 'chalk';
import * as tslint from 'tslint';
import * as path from 'path';
import { IInternalTypeCheckerOptions, END_LINE } from './interfaces';


export class Checker {

    // options that will be used when checking and printing results
    private options: IInternalTypeCheckerOptions;

    // typescript program
    private program: ts.Program;

    // time used to do typecheck/linting
    private elapsedInspectionTime: number;

    // type diagonstic returned by typescript
    private tsDiagnostics: ts.Diagnostic[];

    // lint result returned by tsLint
    private lintFileResult: tslint.LintResult[];


    constructor() {
        // nothing atm
    }


    public inspectCode(options: IInternalTypeCheckerOptions) {
        this.options = options;


        // parse it right away, no need to wait...
        const parseConfigHost: any = {
            fileExists: ts.sys.fileExists,
            readDirectory: ts.sys.readDirectory,
            readFile: ts.sys.readFile,
            useCaseSensitiveFileNames: true
        };

        // take the time
        let inspectionTimeStart = new Date().getTime();

        // get program and get diagnostics and store them diagnostics
        const parsed = ts.parseJsonConfigFileContent(this.options.tsConfigJsonContent, parseConfigHost, options.basePath || '.', undefined);
        this.program = ts.createProgram(parsed.fileNames, parsed.options, undefined, this.program);


        // get errors and tag them;
        this.tsDiagnostics = [];
        let optionsErrors = this.program.getOptionsDiagnostics().map((obj) => {
            // tag em so we know for later
            (<any>obj)._type = 'options';
            return obj;
        });
        this.tsDiagnostics = this.tsDiagnostics.concat(optionsErrors);



        let globalErrors = this.program.getGlobalDiagnostics().map((obj) => {
            (<any>obj)._type = 'global';
            return obj;
        });
        this.tsDiagnostics = this.tsDiagnostics.concat(globalErrors);



        let syntacticErrors = this.program.getSyntacticDiagnostics().map((obj) => {
            (<any>obj)._type = 'syntactic';
            return obj;
        });
        this.tsDiagnostics = this.tsDiagnostics.concat(syntacticErrors);



        let semanticErrors = this.program.getSemanticDiagnostics().map((obj) => {
            (<any>obj)._type = 'semantic';
            return obj;
        });
        this.tsDiagnostics = this.tsDiagnostics.concat(semanticErrors);


        // get tslint if json file is supplied
        this.lintFileResult = [];
        if (options.tsLint) {

            // get full path
            let fullPath = path.resolve(this.options.basePath, options.tsLint);

            // gets the files, lint every file and store errors in lintResults
            let files = tslint.Linter.getFileNames(this.program);

            // get tslint configuration
            const tsLintConfiguration = tslint.Configuration.findConfiguration(fullPath, this.options.basePath).results;

            // lint the files
            this.lintFileResult =
                files.map(file => {
                    // get content of file
                    const fileContents = this.program.getSourceFile(file).getFullText();

                    // create new linter using lint options and tsprogram
                    const linter = new tslint.Linter((<tslint.ILinterOptions>options.lintoptions), this.program);

                    // lint file using filename, filecontent, and tslint configuration
                    linter.lint(file, fileContents, tsLintConfiguration);

                    // return result
                    return linter.getResult();
                }).filter((result) => {
                    // only return the one with erros
                    return result.errorCount ? true : false;
                });
        }

        // save elapsed check time
        this.elapsedInspectionTime = new Date().getTime() - inspectionTimeStart;
    }



    /**
     * print result
     *
     */
    public printResult(isWorker?: boolean) {

        // consts
        const print = this.writeText;
        const program = this.program;
        const options = this.options;

        // print header
        print(
            chalk.bgWhite(
                chalk.black(`${END_LINE}Typechecker plugin(${options.type}) ${options.name}`)
            ) +
            chalk.white(`.${END_LINE}`)
        );

        // print time
        print(
            chalk.grey(`Time:${new Date().toString()} ${END_LINE}`)
        );

        // get the lint errors messages
        let lintErrorMessages = this.processLintFiles();

        // loop diagnostics and get the errors messages
        let tsErrorMessages = this.processTsDiagnostics();

        // combine errors and print if any
        let allErrors = tsErrorMessages.concat(lintErrorMessages);

        // print if any
        if (allErrors.length > 0) {

            // insert header
            allErrors.unshift(
                chalk.underline(`${END_LINE}File errors`) + chalk.white(':') // fix windows
            );

            print(allErrors.join(END_LINE));
        }

        // time for summary >>>>>

        // get errors totals
        let optionsErrors = program.getOptionsDiagnostics().length;
        let globalErrors = program.getGlobalDiagnostics().length;
        let syntacticErrors = program.getSyntacticDiagnostics().length;
        let semanticErrors = program.getSemanticDiagnostics().length;
        let tsLintErrors = lintErrorMessages.length;
        let totalsErrors = optionsErrors + globalErrors + syntacticErrors + semanticErrors + tsLintErrors;



        // if errors, show user
        if (totalsErrors) {

            // write header
            print(
                chalk.underline(`${END_LINE}${END_LINE}Errors`) +
                chalk.white(`:${totalsErrors}${END_LINE}`)
            );

            print(
                chalk[optionsErrors ? options.yellowOnOptions ? 'yellow' : 'red' : 'white']
                    (`└── Options: ${optionsErrors}${END_LINE}`)
            );

            print(
                chalk[globalErrors ? options.yellowOnGlobal ? 'yellow' : 'red' : 'white']
                    (`└── Global: ${globalErrors}${END_LINE}`)
            );

            print(
                chalk[syntacticErrors ? options.yellowOnSyntactic ? 'yellow' : 'red' : 'white']
                    (`└── Syntactic: ${syntacticErrors}${END_LINE}`)
            );

            print(
                chalk[semanticErrors ? options.yellowOnSemantic ? 'yellow' : 'red' : 'white']
                    (`└── Semantic: ${semanticErrors}${END_LINE}`)
            );

            print(
                chalk[tsLintErrors ? options.yellowOnLint ? 'yellow' : 'red' : 'white']
                    (`└── TsLint: ${tsLintErrors}${END_LINE}${END_LINE}`)
            );

        } else {
            // if there no errors, then also give some feedback about this, so they know its working
            print(
                chalk.grey(`All good, no errors :-)${END_LINE}`)
            );
        }

        print(
            chalk.grey(`Typechecking time: ${this.elapsedInspectionTime}ms${END_LINE}`)
        );


        // final check how to end the checker, throw, exit or keep alive

        switch (true) {

            // if throwError is set then callback and quit
            case options.throwOnGlobal && globalErrors > 0:
            case options.throwOnOptions && optionsErrors > 0:
            case options.throwOnSemantic && semanticErrors > 0:
            case options.throwOnTsLint && tsLintErrors > 0:
            case options.throwOnSyntactic && syntacticErrors > 0:
                if (process.send) {
                    process.send('error');
                } else {
                    throw new Error('Typechecker throwing error due to throw options set');
                }
                // exit with error
                process.exit(1);
                break;

            // if quit is set and its a worker, then post message and callback to main tread and tell its done
            case options.quit && isWorker:
                print(chalk.grey(`Quiting typechecker${END_LINE}${END_LINE}`));

                // since Im a worker I need to send back a message;
                (<any>process).send('done');
                break;

            // if quit is set and not worker, then just post messeage
            case options.quit && !isWorker:
                print(chalk.grey(`Quiting typechecker${END_LINE}${END_LINE}`));
                break;

            // default action
            default:
                print(chalk.grey(`Keeping typechecker alive${END_LINE}${END_LINE}`));
        }

        return totalsErrors;

    }



    /**
     * write to screen helper
     *
     */
    private writeText(text: string) {
        ts.sys.write(text);
    }



    /**
     * loops lint failures and return pretty failure string ready to be printed
     *
     */
    private processLintFiles(): string[] {

        const options = this.options;

        // loop lint results
        let lintResultsFilesMessages =
            this.lintFileResult.map((fileResult: tslint.LintResult) => {
                let messages: string[] = [];
                if (fileResult.failures) {
                    // we have a failure, lets check its failures
                    messages = fileResult.failures.map((failure: any) => {

                        // simplify it so its more readable later
                        let r = {
                            fileName: failure.fileName,
                            line: failure.startPosition.lineAndCharacter.line,
                            char: failure.startPosition.lineAndCharacter.character,
                            ruleSeverity: failure.ruleSeverity.charAt(0).toUpperCase() + failure.ruleSeverity.slice(1),
                            ruleName: failure.ruleName,
                            failure: failure.failure
                        };

                        // make error pretty and return it
                        let message = chalk.red('└── ');
                        message += chalk[options.yellowOnLint ? 'yellow' : 'red'](`${r.fileName} (${r.line + 1},${r.char + 1}) `);
                        message += chalk.white(`(${r.ruleSeverity}:`);
                        message += chalk.white(`${r.ruleName})`);
                        message += ' ' + r.failure;
                        return message;
                    });
                }
                // return messages
                return messages;

            }).filter((res: string[]) => {
                // filter our only messages with content
                return res.length === 0 ? false : true;
            });

        // flatten/concatenate lint files - > failures
        let lintErrorMessages: string[] = [];
        try {
            if (lintResultsFilesMessages.length) {
                lintErrorMessages = lintResultsFilesMessages.reduce((a: string[], b: string[]) => {
                    return a.concat(b);
                });
            }
        } catch (err) {
            console.log(err);
        }

        return lintErrorMessages;
    }



    /**
     * loops ts failures and return pretty failure string ready to be printed
     *
     */
    private processTsDiagnostics(): string[] {

        const options = this.options;
        let tsErrorMessages: string[] = [];

        if (this.tsDiagnostics.length > 0) {
            tsErrorMessages = this.tsDiagnostics.map((diag: any) => {

                // get message type error, warn, info
                let message = chalk.red('└── ');

                // set color from options
                let color: string;
                switch (diag._type) {
                    case 'options':
                        color = options.yellowOnOptions ? 'yellow' : 'red';
                        break;
                    case 'global':
                        color = options.yellowOnGlobal ? 'yellow' : 'red';
                        break;
                    case 'syntactic':
                        color = options.yellowOnSyntactic ? 'yellow' : 'red';
                        break;
                    case 'semantic':
                        color = options.yellowOnSemantic ? 'yellow' : 'red';
                        break;
                    default:
                        color = 'red';
                }

                // if file
                if (diag.file) {
                    const {
                        line,
                        character
                    } = diag.file.getLineAndCharacterOfPosition(diag.start);

                    message += chalk[color](`${diag.file.fileName} (${line + 1},${character + 1}) `);
                    message += chalk.white(`(${ts.DiagnosticCategory[diag.category]}:`);
                    message += chalk.white(`TS${diag.code})`);
                }

                // flatten error message
                message += ' ' + ts.flattenDiagnosticMessageText(diag.messageText, END_LINE);

                // return message
                return message;
            });
        }

        return tsErrorMessages;
    }


}
