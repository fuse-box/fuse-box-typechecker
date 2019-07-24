import { WorkerCommand, IWorkerOptions, IResults } from './interfaces';
import { inspectCode } from './inspectCode';
import { printResult } from './printResult';
import { watchSrc } from './watchSrc';
import { printSettings } from './printSettings';
import { debugPrint } from './debugPrint';

let lastResult: IResults;
let printErrorTotal: number;

// listen for messages
process.on('message', function(msg: IWorkerOptions) {
    debugPrint(`worker message recived ${msg.type}`);
    switch (msg.type) {
        // tell checker to inspect code
        case WorkerCommand.inspectCode:
            debugPrint('worker inspectCode');
            if (msg.options) {
                lastResult = inspectCode(msg.options, lastResult && lastResult.oldProgram);
            } else {
                throw new Error('You tried to inspect code without ts/lint options');
            }
            break;

        // tell checker to inspect code
        case WorkerCommand.inspectCodeAndPrint:
            debugPrint('worker inspectCodeAndPrint');
            if (msg.options) {
                lastResult = inspectCode(msg.options, lastResult && lastResult.oldProgram);
                printErrorTotal = printResult(msg.options, lastResult);
                printErrorTotal = printErrorTotal;
            } else {
                throw new Error('You tried to inspect code without ts/lint options');
            }
            break;

        case WorkerCommand.printResult:
            debugPrint('worker printResult');
            if (msg.options && lastResult) {
                printErrorTotal = printResult(msg.options, lastResult);
            } else {
                throw new Error(
                    'You tried to print code without ts/lint options or without having inspected code'
                );
            }
            break;

        case WorkerCommand.printSettings:
            debugPrint('worker printSettings');
            if (msg.options) {
                printSettings(msg.options);
            } else {
                throw new Error(
                    'You tried to print settings without ts/lint options or without having inspected code'
                );
            }
            break;

        case WorkerCommand.watch:
            debugPrint('worker watch');
            if (msg.options) {
                watchSrc(msg.pathToWatch, msg.options, () => {
                    lastResult = inspectCode(msg.options, lastResult && lastResult.oldProgram);
                    printErrorTotal = printResult(msg.options, lastResult);
                });
            } else {
                throw new Error(
                    'You tried to print code without ts/lint options or without having inspected code'
                );
            }
            break;
    }
});

debugPrint('worker started');
