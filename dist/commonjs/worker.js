"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var checker_1 = require("./checker");
var interfaces_1 = require("./interfaces");
var checker = new checker_1.Checker();
process.on('message', function (msg) {
    switch (msg.type) {
        case interfaces_1.WorkerCommand.inspectCode:
            if (msg.options) {
                checker.inspectCode(msg.options);
            }
            else {
                throw new Error('You tried to inspect code without ts/lint options');
            }
            break;
        case interfaces_1.WorkerCommand.printResult:
            checker.printResult(true);
            break;
        case interfaces_1.WorkerCommand.pushResult:
            if (process.send)
                process.send({ type: 'result', result: checker.printResult(true) });
            break;
    }
});

//# sourceMappingURL=worker.js.map
