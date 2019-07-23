import chalk from 'chalk';
import { END_LINE, ITypeCheckerOptions} from './interfaces';
import {print} from './printResult';
import * as watch from 'watch';
import { getPath } from './getPath';

let watchTimeout: any;


export function watchSrc(pathToWatch: string, options: ITypeCheckerOptions, callback: Function) {
    let basePath = getPath(pathToWatch, options);

    watch.createMonitor(basePath, (monitor: any) => {
        // todo-> move into thread

        // tell user what path we are watching
        print(chalk.yellow(`Typechecker watching: ${chalk.white(`${basePath}${END_LINE}`)}`));

        // on created file event
        monitor.on('created', (f: any /*, stat: any*/) => {
            print(END_LINE + chalk.yellow(`File created: ${f}${END_LINE}`));
            callback();
        });

        // on changed file event
        monitor.on('changed', (f: any /*, curr: any, prev: any*/) => {

            // tell user about event
            print(END_LINE + chalk.yellow(`File changed: ${chalk.white(`${f}${END_LINE}`)}`));
            print(chalk.grey(`Calling typechecker${END_LINE}`));

            // have inside timeout, so we only run once when multiple files are saved
            clearTimeout(watchTimeout);
            watchTimeout = setTimeout(() => {
                callback();
            }, 500);
        });

        monitor.on('removed', (f: any /*, stat: any*/) => {
            // tell user about event
            print(END_LINE + chalk.yellow(`File removed: ${chalk.white(`${f}${END_LINE}`)}`));
            print(chalk.grey(`Calling typechecker${END_LINE}`));

            // have inside timeout, so we only run once when multiple files are saved
            clearTimeout(watchTimeout);
            watchTimeout = setTimeout(() => {
                callback();
            }, 500);
        });

    });
}
