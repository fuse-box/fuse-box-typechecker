import chalk from 'chalk';
import { print } from './printResult';
import { ITypeCheckerOptions } from './interfaces';
import { getPath } from './getPath';

export function printSettings(options: ITypeCheckerOptions) {
    // configuration name
    print(chalk.white(`${'\n'} Typechecker name: ${chalk.grey(`${options.name}${'\n'}`)}`));

    // base path being used
    print(chalk.white(` Typechecker basepath: ${chalk.grey(`${options.basePath}${'\n'}`)}`));

    // get tsconfig path and options
    if (options.tsConfig) {
        let tsconf = getPath(options.tsConfig, options);
        print(chalk.white(` Typechecker tsconfig: ${chalk.grey(`${tsconf}${'\n'}`)}`));
    } else {
        print(
            chalk.white(
                ` Typechecker tsconfig: ${chalk.grey(`undefined, using ts defaults${'\n'}`)}`
            )
        );
    }

}
