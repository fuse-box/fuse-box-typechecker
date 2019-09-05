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
import { Logger } from './logger';

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
            `   <cyan><bold><underline>${shortFileName}.</underline></bold></cyan> <grey> - ${errors.length} errors.</grey>\n` +
            errors
                .map((err: TypeCheckError) => {
                    let text = '<red>    - </red>';

                    text += `<bold><red> ${short ? shortFileName : fullFileName} (${
                        err.line
                    },${err.char})</red><bold>`;

                    text += `<dim> (${(<ITSError>err).category}</dim>`;
                    text += `<dim> ${(<ITSError>err).code})</dim>`;
                    text += ` <dim> ${(<ITSError>err).message}</dim>`;

                    return text;
                })
                .join(END_LINE)
        );
    });

    const name = options.name;
    // print if any
    if (allErrors.length > 0) {
        // insert header
        Logger.info(
            `<white><bold><bgRed> ERROR </bgRed></bold></white> <red>Typechecker inspection - (${
                name ? name : 'no-name'
            }):</red>`,
            `<gray>${totalsErrors} errors.<gray>`
        );
        Logger.echo(allErrors.join(END_LINE));
    } else {
        Logger.info(
            `<white><bold><bgGreen> SUCCESS </bgGreen></bold></white> <green>Typechecker inspection - (${
                name ? name : 'no-name'
            }):<green>`,
            `<green>No Errors found</green>`
        );
    }

    // print option errors
    // todo: this needs testing, how do I create a option error??
    if (errors.optionsErrors.length) {
        Logger.info(
            `\n   <red><underline>Option errors:</underline></red>`
        ),
            `<grey>${errors.optionsErrors.length} errors.</grey>`;
        let optionErrorsText = Object.entries(errors.optionsErrors).map(([no, err]) => {
            let text = no + ':';
            let messageText = (<any>err).messageText;
            if (typeof messageText === 'object' && messageText !== null) {
                messageText = JSON.stringify(messageText);
            }
            text = `<cyan>    tsConfig: </cyan>`;
            text += `<red>(${(<any>err).category}:</red>`;
            text += `<red>${(<any>err).code})</red>`;
            text += `<dim> ${messageText}</dim>`;
            return text;
        });
        Logger.echo(optionErrorsText.join('\n'));
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
                `\n  <underline>Error Summary:</underline>`,
                `<grey> - ${totalsErrors} errors.</grey>`
            );

            str += `   <${optionsErrors ? 'red' : 'dim'}>- Options: ${optionsErrors}\n</${
                optionsErrors ? 'red' : 'dim'
            }>`;
            str += `   <${semanticErrors ? 'red' : 'dim'}>- Options: ${semanticErrors}\n</${
                semanticErrors ? 'red' : 'dim'
            }>`;
            str += `   <${syntacticErrors ? 'red' : 'dim'}>- Options: ${syntacticErrors}\n</${
                syntacticErrors ? 'red' : 'dim'
            }>`;
            str += `   <${globalErrors ? 'red' : 'dim'}>- Options: ${globalErrors}\n</${
                globalErrors ? 'red' : 'dim'
            }>`;

            Logger.echo(str);
        }
    }

    if (options.print_runtime) {
        Logger.info(
            `  Typechecker inspection time:`,
            `<dim>${errors.elapsedInspectionTime}ms</dim>`
        );
    }

    return totalsErrors;
}
