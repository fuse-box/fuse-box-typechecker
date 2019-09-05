import { ITypeCheckerOptions } from './interfaces';
import * as watch from 'watch';
import { getPath } from './getPath';
import { debugPrint } from './debugPrint';
import { Logger } from './logger';

let watchTimeout: any;

export function watchSrc(pathToWatch: string, options: ITypeCheckerOptions, callback: Function) {
    debugPrint('wwatchSrc' + pathToWatch);
    let basePath = getPath(pathToWatch, options);

    watch.createMonitor(basePath, (monitor: any) => {
        // todo-> move into thread

        // tell user what path we are watching
        Logger.echo(`<yellow> Typechecker watching: <yellow>${basePath}</yellow>`);

        // on created file event
        monitor.on('created', (f: any /*, stat: any*/) => {
            Logger.echo(`<yellow>\n  File created: ${f}</yellow>`);
            callback();
        });

        // on changed file event
        monitor.on('changed', (f: any /*, curr: any, prev: any*/) => {
            // tell user about event
            Logger.echo(`<yellow>\n  File changed: <grey>${f}</grey></yellow>`);
            Logger.echo(`<grey>  Calling typechecker</grey>`);

            // have inside timeout, so we only run once when multiple files are saved
            clearTimeout(watchTimeout);
            watchTimeout = setTimeout(() => {
                callback();
            }, 100);
        });

        monitor.on('removed', (f: any /*, stat: any*/) => {
            // tell user about event
            Logger.echo(`<yellow>\n  File removed: <grey>${f}</grey></yellow>`);
            Logger.echo(`<grey>  Calling typechecker</grey>`);

            // have inside timeout, so we only run once when multiple files are saved
            clearTimeout(watchTimeout);
            watchTimeout = setTimeout(() => {
                callback();
            }, 100);
        });
    });
}
