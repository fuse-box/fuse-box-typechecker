import { ITypeCheckerOptions } from './interfaces';
import { getPath } from './getPath';
import { Logger, Style } from './logger';

export function printSettings(options: ITypeCheckerOptions) {
    // configuration name
    Logger.info(`Typechecker settings - name:`, Style.dim(`${options.name}`));

    // base path being used
    Logger.info(`Typechecker settings - basepath:`, Style.dim(`${options.basePath}`));

    // get tsconfig path and options
    if (options.tsConfig) {
        let tsconf = getPath(options.tsConfig, options);
        Logger.info(`Typechecker settings - tsconfig:`, Style.dim(`${tsconf}`));
    } else {
        Logger.info(`Typechecker settings - tsconfig:`, Style.dim(`undefined, using ts defaults/override if defined`));
    }
}
