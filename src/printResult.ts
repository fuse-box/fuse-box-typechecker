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
    // print header
    print(
        chalk.bgWhite(chalk.black(`${END_LINE}Typechecker plugin: ${options.name}.${END_LINE}`)) +
            chalk.white(``)
    );

    // print time
    print(chalk.grey(`Time:${new Date().toString()} ${END_LINE}`));

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
        const short = options.shortenFilenames;
        const fullFileName = path.resolve(fileName);
        const shortFileName = fullFileName.split(options.basePath).join('.');
        return (
            chalk.white(`└── ${shortFileName}`) +
            END_LINE +
            errors
                .map((err: TypeCheckError) => {
                    let text = chalk.red('   |');

                    text += chalk[err.color](
                        ` ${short ? shortFileName : fullFileName} (${err.line},${err.char}) `
                    );
                    text += chalk.white(`(${(<ITSError>err).category}`);
                    text += chalk.white(`${(<ITSError>err).code})`);
                    text += ' ' + (<ITSError>err).message;

                    return text;
                })
                .join(END_LINE)
        );
    });

    // print if any
    if (allErrors.length > 0) {
        // insert header
        allErrors.unshift(
            chalk.underline(`${END_LINE}File errors`) + chalk.white(':') // fix windows
        );
        print(allErrors.join(END_LINE));
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
            text = chalk[options.yellowOnOptions ? 'yellow' : 'red'](`└── tsConfig: `);
            text += chalk.white(`(${(<any>err).category}:`);
            text += chalk.white(`${(<any>err).code})`);
            text += chalk.white(` ${messageText}`);
            return text;
        });
        print(optionErrorsText.join(END_LINE));
    }

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
    } else {
        // if there no errors, then also give some feedback about this, so they know its working
        print(chalk.grey(`All good, no errors :-)${END_LINE}`));
    }

    print(chalk.grey(`Typechecking time: ${errors.elapsedInspectionTime}ms${END_LINE}`));

    return totalsErrors;
}
