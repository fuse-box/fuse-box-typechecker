
// typechecker
import { Checker } from './checker';

// create checker
let checker = new Checker();

// listen for messages
process.on('message', function (msg: any) {
    let type = msg.type;
    switch (type) {
        case 'configure':
            checker.configure(msg.options);
            break;
        case 'run':
            checker.typecheck();
            break;
    }
});
