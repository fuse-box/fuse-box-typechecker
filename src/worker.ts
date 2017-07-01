
// typechecker
import { Checker } from './checker';
import { CommandType } from './interfaces';

// create checker
let checker = new Checker();

// listen for messages
process.on('message', function (msg: any) {
    const type: CommandType = msg.type;
    switch (type) {
        case CommandType.configure:
            checker.configure(msg.options);
            break;
        case CommandType.run:
            checker.typecheck();
            break;
    }
});
