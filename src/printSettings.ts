import chalk from 'chalk';
import { print } from './printResult';
import { ITypeCheckerOptions } from './interfaces';
import { getPath } from './getPath';

export function printSettings(options: ITypeCheckerOptions) {
    // configuration name
    print(chalk.yellow(`${'\n'}Typechecker name: ${chalk.white(`${options.name}${'\n'}`)}`));

    // base path being used
    print(chalk.yellow(`Typechecker basepath: ${chalk.white(`${options.basePath}${'\n'}`)}`));

    // get tsconfig path and options
    if (options.tsConfig) {
        let tsconf = getPath(options.tsConfig, options);
        print(chalk.yellow(`Typechecker tsconfig: ${chalk.white(`${tsconf}${'\n'}`)}`));
    } else {
        print(
            chalk.yellow(
                `Typechecker tsconfig: ${chalk.white(`undefined, using ts defaults${'\n'}`)}`
            )
        );
    }

}
