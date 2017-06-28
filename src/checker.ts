import * as ts from 'typescript';
import * as chalk from 'chalk';

import { OptionsInterface } from './interfaces';

export class Checker {

    private options: OptionsInterface;
    private tsConfig: string;
    private program: ts.Program;
    private elapsed: number;
    private diagnostics: ts.Diagnostic[];

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

        // take the time and get program
        let start = new Date().getTime();
        const parsed = ts.parseJsonConfigFileContent(this.tsConfig, parseConfigHost, '.', null, 'tsconfig.json');
        this.program = ts.createProgram(parsed.fileNames, parsed.options, null, this.program);
        this.diagnostics = ts.getPreEmitDiagnostics(this.program);
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

            write(messages.join('\n'));

        }

        let optionsErrors = program.getOptionsDiagnostics().length;
        let globalErrors = program.getGlobalDiagnostics().length;
        let syntacticErrors = program.getSyntacticDiagnostics().length;
        let semanticErrors = program.getSemanticDiagnostics().length;
        let totals = optionsErrors + globalErrors + syntacticErrors + semanticErrors;

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
                    (`└── Semantic: ${semanticErrors}${END_LINE}${END_LINE}`)
            );

        }

        write(
            chalk.grey(`Typechecking time: ${this.elapsed}ms${END_LINE}`)
        );


        switch (true) {
            case options.throwOnGlobal && globalErrors > 0:
            case options.throwOnOptions && optionsErrors > 0:
            case options.throwOnSemantic && semanticErrors > 0:
            case options.throwOnSyntactic && syntacticErrors > 0:
                if (process.send) {
                    process.send('error');
                } else {
                   throw new Error('options.throwOnXXXXX triggered');
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
