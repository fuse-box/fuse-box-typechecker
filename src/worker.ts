// typechecker
import { Checker } from './checker';
import { WorkerCommand, IWorkerOptions } from './interfaces';

// create checker instance
let checker = new Checker();
let hasCallback = false;
// listen for messages
process.on('message', function (msg: IWorkerOptions) {

    // set if callback is awaited
    hasCallback = msg.hasCallback || false;

    switch (msg.type) {

        // tell checker to inspect code
        case WorkerCommand.inspectCode:
            if (msg.options) {
                checker.inspectCode(msg.options);
            } else {
                throw new Error('You tried to inspect code without ts/lint options');
            }

            break;

        // tell checker to print result
        case WorkerCommand.printResult:
            let result = checker.printResult(true);

            if (process.send && hasCallback) {
                process.send({ type: 'result', result: result });
            }

            break;

        // tell checker to return result obj
        case WorkerCommand.getResultObj:
            let resultObj = checker.lastResults;
            // TODO, need to trim down results, so it can be transfered, the will break if any errors
            if (process.send && hasCallback) {
                process.send({ type: 'result', result: resultObj });
                (<any>process).send('done');
            }

            break;
    }
});
