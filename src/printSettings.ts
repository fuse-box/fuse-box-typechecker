import { ITypeCheckerOptions } from './interfaces';
import { getPath } from './getPath';
import { Logger } from './logger';

export function printSettings(options: ITypeCheckerOptions) {
    // configuration name
    Logger.info(`Typechecker name:`, `${options.name}`);

    // base path being used
    Logger.info(`Typechecker basepath:`, `${options.basePath}`);

    // get tsconfig path and options
    if (options.tsConfig) {
        let tsconf = getPath(options.tsConfig, options);
        Logger.info(` Typechecker tsconfig:`, `${tsconf}`);
    } else {
        Logger.info(` Typechecker tsconfig:`, `undefined, using ts defaults/override if defined`);
    }
}
