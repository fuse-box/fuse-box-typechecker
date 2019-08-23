import chalk from 'chalk';
import {
    END_LINE,
    ITypeCheckerOptions,
    TotalErrorsFound,
    TypeCheckError,
    ITSError,
    IResults
} from './interfaces';
import * as ts from 'typescript';
import * as path from 'path';
import { processTsDiagnostics } from './processTsDiagnostics';

export function print(text: string) {
    ts.sys.write(text);
}

export function printResult(options: ITypeCheckerOptions, errors: IResults): TotalErrorsFound {
    // get the lint errors messages
    const tsErrorMessages: TypeCheckError[] = processTsDiagnostics(options, errors);

    // group by filename
    let groupedErrors: { [k: string]: TypeCheckError[] } = {};
    tsErrorMessages.forEach((error: TypeCheckError) => {
        if (!groupedErrors[error.fileName]) {
            groupedErrors[error.fileName] = [] as TypeCheckError[];
        }
        groupedErrors[error.fileName].push(error);
    });

    let allErrors = Object.entries(groupedErrors).map(([fileName, errors]) => {
        const short = options.shortenFilenames !== false ? true : false;
        const fullFileName = path.resolve(fileName);
        let shortFileName = fullFileName.split(options.basePath as string).join('.');
        if( path.isAbsolute(shortFileName)){
            // most likely a tsconfig path
            shortFileName = path.relative(process.cwd(), fullFileName)
        } else{
            // if somepne passes in basepath we need to use that in print
            if(options.basePathSetup){
                shortFileName = path.join(options.basePathSetup, shortFileName);
            }
        }

        


        return (
            chalk.grey(` └──`) +
            chalk.blueBright(`${shortFileName}`) +
            END_LINE +
            errors
                .map((err: TypeCheckError) => {
                    let text = chalk.red('    |');

                    text += chalk[err.color](
                        ` ${short ? shortFileName : fullFileName} (${err.line},${err.char}) `
                    );
                    text += chalk.grey(`(${(<ITSError>err).category}`);
                    text += chalk.grey(`${(<ITSError>err).code})`);
                    text += ' ' + chalk.grey((<ITSError>err).message);

                    return text;
                })
                .join(END_LINE)
        );
    });

    const name = options.name;
    // print if any
    if (allErrors.length > 0) {
        // insert header
        allErrors.unshift(
            chalk.white(` Typechecker (${name ? name: 'no-name' }):` + chalk.white('')) // fix windows
        );
        print(allErrors.join(END_LINE));
    } else {
        print(chalk.white(` Typechecker ${name ? name: 'no-name'}: No Errors found` + chalk.white(''))); // fix windows
    }

    // print option errors
    if (errors.globalErrors.length) {
        print(chalk.underline(`${END_LINE}${END_LINE}Option errors`) + chalk.white(`:${END_LINE}`));
        let optionErrorsText = Object.entries(errors.globalErrors).map(([no, err]) => {
            let text = no + ':';
            let messageText = (<any>err).messageText;
            if (typeof messageText === 'object' && messageText !== null) {
                messageText = JSON.stringify(messageText);
            }
            text = chalk[options.yellowOnOptions ? 'yellow' : 'red'](` └── tsConfig: `);
            text += chalk.grey(`(${(<any>err).category}:`);
            text += chalk.grey(`${(<any>err).code})`);
            text += chalk.grey(` ${messageText}`);
            return text;
        });
        print(optionErrorsText.join(END_LINE));
    }
    print(END_LINE);

    // print global errors
    // todo: this needs testing, how do I create a global error??
    /* try {
            if (getGlobalDiagnostics().length) {
                print(chalk.underline(`${END_LINE}${END_LINE}Global errors`) + chalk.white(`:${END_LINE}`));
                let optionErrorsText = Object.entries(getGlobalDiagnostics())
                    .map(([no, err]) => {
                        let text = no + ':';
                        text = chalk[options.yellowOnGlobal ? 'yellow' : 'red']
                            (`└── tsConfig: `);
                        text += chalk.white(`(${(<any>err).category}:`);
                        text += chalk.white(`${(<any>err).code})`);
                        text += chalk.white(` ${(<any>err).messageText}`);
                        return text;
                    });
                print(optionErrorsText.join(END_LINE));
            }
        } catch (err) {
            console.log(`Global error`);
        } */

    // time for summary >>>>>
    // get errors totals
    let optionsErrors = errors.optionsErrors.length;
    let globalErrors = errors.globalErrors.length;
    let syntacticErrors = errors.syntacticErrors.length;
    let semanticErrors = errors.semanticErrors.length;
    let totalsErrors = optionsErrors + globalErrors + syntacticErrors + semanticErrors;

    // if errors, show user
    if (options.print_summary) {
        if (totalsErrors) {
            // write header
            print(
                chalk.underline(`${END_LINE}${END_LINE}Errors`) +
                    chalk.white(`:${totalsErrors}${END_LINE}`)
            );

            print(
                chalk[optionsErrors ? (options.yellowOnOptions ? 'yellow' : 'red') : 'white'](
                    `└── Options: ${optionsErrors}${END_LINE}`
                )
            );

            print(
                chalk[globalErrors ? (options.yellowOnGlobal ? 'yellow' : 'red') : 'white'](
                    `└── Global: ${globalErrors}${END_LINE}`
                )
            );

            print(
                chalk[syntacticErrors ? (options.yellowOnSyntactic ? 'yellow' : 'red') : 'white'](
                    `└── Syntactic: ${syntacticErrors}${END_LINE}`
                )
            );

            print(
                chalk[semanticErrors ? (options.yellowOnSemantic ? 'yellow' : 'red') : 'white'](
                    `└── Semantic: ${semanticErrors}${END_LINE}`
                )
            );
        }
    }

    if (options.print_runtime) {
        print(
            chalk.grey(`Typechecking time: ${errors.elapsedInspectionTime}ms${END_LINE}${END_LINE}`)
        );
    }

    return totalsErrors;
}
