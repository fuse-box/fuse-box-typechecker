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
            `   <cyan><bold><underline>${shortFileName}</underline></bold></cyan> <grey> - ${errors.length} errors.</grey>\n` +
            errors
                .map((err: TypeCheckError) => {
                    const fName = short ? shortFileName : fullFileName;
                    let text = `<yellow>    -  ${fName}:${err.line}:${err.char}</yellow><dim> (${
                        (<ITSError>err).category
                    }</dim><dim> ${(<ITSError>err).code})</dim><dim> ${
                        (<ITSError>err).message
                    }</dim>`;

                    return text;
                })
                .join(END_LINE)
        );
    });

    const name = options.name;
    // print if any
    if (allErrors.length > 0) {
        // insert header
        Logger.echo('')
        Logger.info(
            `<white><bold><bgRed> ERROR </bgRed></bold></white> <red>Typechecker inspection - (${
                name ? name : 'no-name'
            }):</red>`,
            `<gray>${totalsErrors} errors.<gray>`
        );
        Logger.echo('')
        Logger.echo(allErrors.join(END_LINE));
    } else {
        Logger.echo('')
        Logger.info(
            `<white><bold><bgGreen> SUCCESS </bgGreen></bold></white> <green>Typechecker inspection - (${
                name ? name : 'no-name'
            }):<green>`,
            `<green>No Errors found</green>`
        );
        Logger.echo('')
    }

    // print option errors
    if (errors.optionsErrors.length) {
        Logger.info(`\n   <cyan><bold><underline>Option errors:</underline></bold></cyan>`,
            `<grey>${errors.optionsErrors.length} errors.</grey>`);
        let optionErrorsText = Object.entries(errors.optionsErrors).map(([no, err]) => {
            let messageText = (<any>err).messageText;
            if (typeof messageText === 'object' && messageText !== null) {
                messageText = JSON.stringify(messageText);
            }
            let text = `<yellow>    -  tsConfig: </yellow><yellow>(${
                (<any>err).category
            }:</yellow><yellow>${(<any>err).code})</yellow><dim> ${messageText}</dim>`;
            return text;
        });
        Logger.echo(optionErrorsText.join('\n'));
    }

    // todo: this needs testing, how do I create a global error??
    try {
        if (errors.globalErrors.length) {
            Logger.info(`\n   <red><bold><underline>Option errors:</underline></bold></red>`,
                `<grey>${errors.globalErrors.length} errors.</grey>`);
            let globalErrorsText = Object.entries(errors.globalErrors).map(([no, err]) => {
                let messageText = (<any>err).messageText;
                if (typeof messageText === 'object' && messageText !== null) {
                    messageText = JSON.stringify(messageText);
                }
                let text = `<yellow>  -  tsConfig: </yellow><yellow>(${
                    (<any>err).category
                }:</yellow><yellow>${(<any>err).code})</yellow><dim> ${messageText}</dim>`;
                return text;
            });
            Logger.echo(globalErrorsText.join('\n'));
        }
    } catch (err) {
        console.log(`Global error`, err);
    }

    // if errors, show user
    if (options.print_summary) {
        if (totalsErrors) {
            // write header

            Logger.info(
                `\n  <underline>Error Summary:</underline>`,
                `<grey> - ${totalsErrors} errors.</grey>`
            );

            Logger.echo(
                `   <${optionsErrors ? 'red' : 'dim'}>- Options: ${optionsErrors}\n</${
                    optionsErrors ? 'red' : 'dim'
                }>   <${semanticErrors ? 'red' : 'dim'}>- Options: ${semanticErrors}\n</${
                    semanticErrors ? 'red' : 'dim'
                }>   <${syntacticErrors ? 'red' : 'dim'}>- Options: ${syntacticErrors}\n</${
                    syntacticErrors ? 'red' : 'dim'
                }>   <${globalErrors ? 'red' : 'dim'}>- Options: ${globalErrors}\n</${
                    globalErrors ? 'red' : 'dim'
                }>`
            );
        }
    }

    if (options.print_runtime) {
        Logger.info(`Typechecker inspection time:`, `<dim>${errors.elapsedInspectionTime}ms</dim>`);
    }

    return totalsErrors;
}
