import * as ts from 'typescript';
import * as chalk from 'chalk';
import * as tslint from 'tslint';
import * as path from 'path';

import { OptionsInterface } from './interfaces';


export class Checker {

    private options: OptionsInterface;
    private tsConfig: string;
    private program: ts.Program;
    private elapsed: number;
    private diagnostics: ts.Diagnostic[];
    private files: string[];
    private lintResults: any;

    constructor() {
        // nothing atm
    }


    public configure(options: any) {
        this.tsConfig = options.tsConfigObj;
        this.options = options;


        // parse it right away, no need to wait...
        const parseConfigHost: any = {
            fileExists: ts.sys.fileExists,
            readDirectory: ts.sys.readDirectory,
            readFile: ts.sys.readFile,
            useCaseSensitiveFileNames: true
        };

        // take the time
        let start = new Date().getTime();

        // get program and get diagnostics and store them diagnostics
        const parsed = ts.parseJsonConfigFileContent(this.tsConfig, parseConfigHost, options.basePath || '.', null);
        this.program = ts.createProgram(parsed.fileNames, parsed.options, null, this.program);
        this.diagnostics = ts.getPreEmitDiagnostics(this.program);

        // get tslint if json file is supplied
        this.lintResults = [];
        if (options.tsLint) {

            // get full path
            let fullPath = path.resolve(this.options.basePath, options.tsLint);

            // gets the files, lint every file and store errors in lintResults
            this.files = tslint.Linter.getFileNames(this.program);
            const config = tslint.Configuration.findConfiguration(fullPath, this.options.basePath).results;
            this.lintResults = this.files.map(file => {
                const fileContents = this.program.getSourceFile(file).getFullText();
                const linter = new tslint.Linter(options.lintoptions, this.program);
                linter.lint(file, fileContents, config);
                return linter.getResult();
            }).filter((result) => {
                return result.errorCount ? true : false;
            });
        }

        this.elapsed = new Date().getTime() - start;
    }



    public typecheck() {

        const write = this.writeText;
        const diagnostics = this.diagnostics;
        const program = this.program;
        const options = this.options;
        const END_LINE = '\n';

        write(
            chalk.bgWhite(
                chalk.black(`${END_LINE}Typechecker plugin(${options.type}) ${options.name}`)
            ) +
            chalk.white(`.${END_LINE}`)
        );

        write(
            chalk.grey(`Time:${new Date().toString()} ${END_LINE}`)
        );


        let lintResults = this.lintResults.map((errors: any) => {
            if (errors.failures) {
                let messages = errors.failures.map((failure: any) => {

                    let r = {
                        fileName: failure.fileName,
                        line: failure.startPosition.lineAndCharacter.line,
                        char: failure.startPosition.lineAndCharacter.character,
                        ruleSeverity: failure.ruleSeverity,
                        ruleName: failure.ruleName,
                        failure: failure.failure
                    };

                    let message = chalk.red('└── ');
                    message += chalk.red(`${r.fileName}: (${r.line + 1}:${r.char + 1}):`);
                    message += chalk.white(r.ruleSeverity);
                    message += chalk.white(` TSLint: "${r.ruleName}":`);
                    message += ' ' + r.failure;
                    return message;
                });
                return messages;
            }
        });

        // concatenate lint files - > failures
        try {
            if (lintResults.length) {
                lintResults = lintResults.reduce((a: string[], b: string[]) => {
                    return a.concat(b);
                });
            }
        } catch (err) {
            console.log(err);
        }

        // loop diagnostics
        let messages = [];
        if (diagnostics.length > 0) {
            messages = diagnostics.map((diag: any) => {

                // get message type error, warn, info
                let message = chalk.red('└── ');

                // if file
                if (diag.file) {
                    const {
                        line,
                        character
                    } = diag.file.getLineAndCharacterOfPosition(diag.start);

                    message += chalk.red(`${diag.file.fileName}: (${line + 1}:${character + 1}):`);
                    message += chalk.white(ts.DiagnosticCategory[diag.category]);
                    message += chalk.white(` TS${diag.code}:`);
                }

                // flatten error message
                message += ' ' + ts.flattenDiagnosticMessageText(diag.messageText, END_LINE);

                // return message
                return message;
            });

            // write errors
            messages.unshift(
                chalk.underline(`${END_LINE}File errors`) + chalk.white(':') // fix windows
            );
            let x = messages.concat(lintResults);
            write(x.join('\n'));

        }

        let optionsErrors = program.getOptionsDiagnostics().length;
        let globalErrors = program.getGlobalDiagnostics().length;
        let syntacticErrors = program.getSyntacticDiagnostics().length;
        let semanticErrors = program.getSemanticDiagnostics().length;
        let tsLintErrors = lintResults.length;
        let totals = optionsErrors + globalErrors + syntacticErrors + semanticErrors + tsLintErrors;

        write(
            chalk.underline(`${END_LINE}${END_LINE}Errors`) +
            chalk.white(`:${totals}${END_LINE}`)
        );

        if (totals) {

            write(
                chalk[optionsErrors ? 'red' : 'white']
                    (`└── Options: ${optionsErrors}${END_LINE}`)
            );

            write(
                chalk[globalErrors ? 'red' : 'white']
                    (`└── Global: ${globalErrors}${END_LINE}`)
            );

            write(
                chalk[syntacticErrors ? 'red' : 'white']
                    (`└── Syntactic: ${syntacticErrors}${END_LINE}`)
            );

            write(
                chalk[semanticErrors ? 'red' : 'white']
                    (`└── Semantic: ${semanticErrors}${END_LINE}`)
            );

            write(
                chalk[tsLintErrors ? 'red' : 'white']
                    (`└── TsLint: ${tsLintErrors}${END_LINE}${END_LINE}`)
            );

        }

        write(
            chalk.grey(`Typechecking time: ${this.elapsed}ms${END_LINE}`)
        );


        switch (true) {
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
                process.exit(1);
                break;
            case options.quit:
                write(chalk.grey(`Quiting typechecker${END_LINE}${END_LINE}`));
                process.send('done');
                break;
            case options.finished:
                write(chalk.grey(`Quiting typechecker${END_LINE}${END_LINE}`));
                break;
            default:
                write(chalk.grey(`Keeping typechecker alive${END_LINE}${END_LINE}`));
        }

        return totals;

    }


    private writeText(text: string) {
        ts.sys.write(text);
    }


}
