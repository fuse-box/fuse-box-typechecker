import {
    END_LINE,
    ITypeCheckerOptions,
    TotalErrorsFound,
    TypeCheckError,
    ITSError,
    IResults
} from './interfaces';
import * as path from 'path';
import { processTsDiagnostics } from './processTsDiagnostics';
import { Style, Logger } from './logger';

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

    // get errors totals
    const optionsErrors = errors.optionsErrors.length;
    const globalErrors = errors.globalErrors.length;
    const syntacticErrors = errors.syntacticErrors.length;
    const semanticErrors = errors.semanticErrors.length;
    const totalsErrors = optionsErrors + globalErrors + syntacticErrors + semanticErrors;

    let allErrors = Object.entries(groupedErrors).map(([fileName, errors]) => {
        const short = options.shortenFilenames !== false ? true : false;
        const fullFileName = path.resolve(fileName);
        let shortFileName = fullFileName.split(options.basePath as string).join('.');
        if (path.isAbsolute(shortFileName)) {
            // most likely a tsconfig path
            shortFileName = path.relative(process.cwd(), fullFileName);
        } else {
            // if somepne passes in basepath we need to use that in print
            if (options.basePathSetup) {
                shortFileName = path.join(options.basePathSetup, shortFileName);
            }
        }

        return (
            Style.grey(`   └── `) +
            Style.underline(Style.cyan(`${shortFileName}`)) +
            Style.grey(` - ${errors.length} errors`) +
            END_LINE +
            errors
                .map((err: TypeCheckError) => {
                    let text = Style.red('    | ');

                    text += Style[err.color](
                        ` ${short ? shortFileName : fullFileName} (${err.line},${err.char}) `
                    );
                    text += Style.grey(`(${(<ITSError>err).category}`);
                    text += Style.grey(`${(<ITSError>err).code})`);
                    text += ' ' + Style.grey((<ITSError>err).message);

                    return text;
                })
                .join(END_LINE)
        );
    });

    const name = options.name;
    // print if any
    if (allErrors.length > 0) {
        // insert header
        Logger.echo('');
        Logger.info(
            `Typechecker inspection - (${name ? name : 'no-name'}):`,
            Style.grey(`${totalsErrors} errors.`)
        );
        Logger.echo(allErrors.join(END_LINE));
    } else {
        Logger.echo(END_LINE);
        Logger.info(`Typechecker inspection - (${name ? name : 'no-name'}):`, ` No Errors found`);
    }

    // print option errors
    // todo: this needs testing, how do I create a option error??
    if (errors.globalErrors.length) {
        Logger.echo(
            Style.underline(`${END_LINE}${END_LINE}Option errors`) + Style.white(`:${END_LINE}`)
        );
        let optionErrorsText = Object.entries(errors.globalErrors).map(([no, err]) => {
            let text = no + ':';
            let messageText = (<any>err).messageText;
            if (typeof messageText === 'object' && messageText !== null) {
                messageText = JSON.stringify(messageText);
            }
            text = `   └── tsConfig: `;
            text += Style.grey(`(${(<any>err).category}:`);
            text += Style.grey(`${(<any>err).code})`);
            text += Style.grey(` ${messageText}`);
            return text;
        });
        Logger.echo(optionErrorsText.join(END_LINE));
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

    // if errors, show user
    if (options.print_summary) {
        if (totalsErrors) {
            // write header
            let str = '';
            Logger.info(
                `${END_LINE}  ` + Style.underline(`Typechecker Summary:`),
                Style.grey(`Errors - ${totalsErrors}`)
            );

            str += `   ${Style[optionsErrors ? 'red' : 'grey'](
                `└── Options: ${optionsErrors}${END_LINE}`
            )}`;
            str += `   ${Style[globalErrors ? 'red' : 'grey'](
                `└── Global: ${globalErrors}${END_LINE}`
            )}`;
            str += `   ${Style[syntacticErrors ? 'red' : 'grey'](
                `└── Syntactic: ${syntacticErrors}${END_LINE}`
            )}`;
            str += `   ${Style[semanticErrors ? 'red' : 'grey'](
                `└── Semantic: ${semanticErrors}${END_LINE}`
            )}`;

            Logger.echo(str);
        }
    }

    if (options.print_runtime) {
        Logger.info(
            `Typechecker inspection time:`,
            Style.grey(`${errors.elapsedInspectionTime}ms${END_LINE}${END_LINE}`)
        );
    }

    return totalsErrors;
}
