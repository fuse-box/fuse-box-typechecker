import { ITypeCheckerOptions } from './interfaces';
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
        Logger.echo(Style.yellow(`  Typechecker watching: ${Style.grey(`${basePath}`)}`));

        // on created file event
        monitor.on('created', (f: any /*, stat: any*/) => {
            Logger.echo(Style.yellow(`\n  File created: ${f}`));
            callbacsk();
        });

        // on changed file event
        monitor.on('changed', (f: any /*, curr: any, prev: any*/) => {
            // tell user about event
            Logger.echo(Style.yellow(`\n  File changed: ${Style.grey(`${f}`)}`));
            Logger.echo(Style.grey(`  Calling typechecker`));

            // have inside timeout, so we only run once when multiple files are saved
            clearTimeout(watchTimeout);
            watchTimeout = setTimeout(() => {
                callback();
            }, 100);
        });

        monitor.on('removed', (f: any /*, stat: any*/) => {
            // tell user about event
            Logger.echo(Style.yellow(`\n  File removed: ${Style.white(`${f}`)}`));
            Logger.echo(Style.grey(`Calling typechecker`));

            // have inside timeout, so we only run once when multiple files are saved
            clearTimeout(watchTimeout);
            watchTimeout = setTimeout(() => {
                callback();
            }, 100);
        });
    });
}
