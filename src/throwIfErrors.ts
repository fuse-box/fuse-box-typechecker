import { END_LINE, ITypeCheckerOptions, IResults } from './interfaces';
import { printResult } from './printResult';
import { Logger } from './logger';

export function throwIfError(options: ITypeCheckerOptions, errors: IResults) {
    switch (true) {
        // if throwError is set then callback and quit
        case options.throwOnGlobal && errors.globalErrors.length > 0:
        case options.throwOnOptions && errors.optionsErrors.length > 0:
        case options.throwOnSemantic && errors.semanticErrors.length > 0:
        case options.throwOnSyntactic && errors.syntacticErrors.length > 0:
            Logger.info(`<black><bold><bgYellow> WARNING </bgYellow></bold></black> <yellow>Typechecker throw on error activated- quitting</yellow>`);

            printResult(options, errors);
            process.exit(1);
            break;
    }
}
