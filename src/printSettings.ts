import { ITypeCheckerOptions } from './interfaces';
import { getPath } from './getPath';
import { Logger } from './logger';

export function printSettings(options: ITypeCheckerOptions) {
    // configuration name
    Logger.info(`Typechecker settings - name:`, `<dim>${options.name}</dim>`);

    // base path being used
    Logger.info(`Typechecker settings - basepath:`, `<dim>${options.basePath}</dim>`);

    // get tsconfig path and options
    if (options.tsConfig) {
        let tsconf = getPath(options.tsConfig, options);
        Logger.info(`Typechecker settings - tsconfig:`, `<dim>${tsconf}</dim>`);
    } else {
        Logger.info(`Typechecker settings - tsconfig:`, `<dim>undefined, using ts defaults/override if defined</dim>`);
    }
}
