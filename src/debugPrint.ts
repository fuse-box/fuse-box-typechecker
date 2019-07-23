import chalk from 'chalk';
import { print } from './printResult';
import { END_LINE } from './interfaces';

const enable = true;

export function debugPrint(text: string) {
    if (enable) {
        print(chalk.bgYellow(chalk.black(text + END_LINE)));
    }
}
