import { END_LINE } from './interfaces';
import { Logger } from './logger';

const enable = false;

export function debugPrint(text: string) {
    if (enable) {
        Logger.info(`Typechecker debugPrint:`, text + END_LINE);
    }
}
