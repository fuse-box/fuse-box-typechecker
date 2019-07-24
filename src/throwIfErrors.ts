import chalk from 'chalk';
import { END_LINE, ITypeCheckerOptions, IResults } from './interfaces';
import { print, printResult } from './printResult';

export function throwIfError(options: ITypeCheckerOptions, errors: IResults) {
    switch (true) {
        // if throwError is set then callback and quit
        case options.throwOnGlobal && errors.globalErrors.length > 0:
        case options.throwOnOptions && errors.optionsErrors.length > 0:
        case options.throwOnSemantic && errors.semanticErrors.length > 0:
        case options.throwOnSyntactic && errors.syntacticErrors.length > 0:
            print(chalk.grey(`throw action- quiting${END_LINE}${END_LINE}`));
            printResult(options, errors);
            process.exit(1);
            break;
    }
}
