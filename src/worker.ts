// typechecker
import { Checker } from './checker';
import { WorkerCommand, IWorkerOptions } from './interfaces';

// create checker instance
let checker = new Checker();

// listen for messages
process.on('message', function (msg: IWorkerOptions) {
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
            checker.printResult(true);
            break;

        case WorkerCommand.pushResult:
            if(process.send)
                process.send({ type: 'result', result: checker.printResult(true) });
            break;
    }
});
