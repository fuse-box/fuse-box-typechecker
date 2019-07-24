/*import chalk from 'chalk';
import { END_LINE, ITypeCheckerOptions, IResults } from './interfaces';
import { print } from './printResult';

 export function throwIfError(options: ITypeCheckerOptions, errors: IResults) {
    switch (true) {
        // if throwError is set then callback and quit
        case options.throwOnGlobal && errors.globalErrors.length > 0:
        case options.throwOnOptions && errors.optionsErrors.length > 0:
        case options.throwOnSemantic && errors.semanticErrors.length > 0:
        case options.throwOnTsLint && errors.lintFileResult.length > 0:
        case options.throwOnSyntactic && errors.syntacticErrors.length > 0:
            if (process.send) {
                process.send('error');
            } else {
                print(chalk.grey(`error typechecker${END_LINE}${END_LINE}`));
            }
            // exit with error
            process.exit(1);
            break;
    }
} */
