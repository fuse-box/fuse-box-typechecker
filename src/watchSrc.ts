import { END_LINE, ITypeCheckerOptions } from './interfaces';
import * as watch from 'watch';
import { getPath } from './getPath';
import { debugPrint } from './debugPrint';
import { Logger, Style } from './logger';

let watchTimeout: any;

export function watchSrc(pathToWatch: string, options: ITypeCheckerOptions, callback: Function) {
    debugPrint('wwatchSrc' + pathToWatch);
    let basePath = getPath(pathToWatch, options);

    watch.createMonitor(basePath, (monitor: any) => {
        // todo-> move into thread

        // tell user what path we are watching
        Logger.echo(Style.yellow(`Typechecker watching: ${Style.white(`${basePath}${END_LINE}`)}`));

        // on created file event
        monitor.on('created', (f: any /*, stat: any*/) => {
            Logger.echo(END_LINE + Style.yellow(`File created: ${f}${END_LINE}`));
            callback();
        });

        // on changed file event
        monitor.on('changed', (f: any /*, curr: any, prev: any*/) => {
            // tell user about event
            Logger.echo(END_LINE + Style.yellow(`File changed: ${Style.white(`${f}${END_LINE}`)}`));
            Logger.echo(Style.grey(`Calling typechecker${END_LINE}`));

            // have inside timeout, so we only run once when multiple files are saved
            clearTimeout(watchTimeout);
            watchTimeout = setTimeout(() => {
                callback();
            }, 100);
        });

        monitor.on('removed', (f: any /*, stat: any*/) => {
            // tell user about event
            Logger.echo(END_LINE + Style.yellow(`File removed: ${Style.white(`${f}${END_LINE}`)}`));
            Logger.echo(Style.grey(`Calling typechecker${END_LINE}`));

            // have inside timeout, so we only run once when multiple files are saved
            clearTimeout(watchTimeout);
            watchTimeout = setTimeout(() => {
                callback();
            }, 100);
        });
    });
}
