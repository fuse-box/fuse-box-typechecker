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
            checker.inspectCode(msg.options);
            break;

        // tell checker to print result
        case WorkerCommand.printResult:
            checker.printResult(true);
            break;
    }
});
