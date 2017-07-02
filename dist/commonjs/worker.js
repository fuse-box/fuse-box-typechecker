Object.defineProperty(exports, "__esModule", { value: true });
var checker_1 = require("./checker");
var interfaces_1 = require("./interfaces");
var checker = new checker_1.Checker();
process.on('message', function (msg) {
    switch (msg.type) {
        case interfaces_1.WorkerCommand.inspectCode:
            checker.inspectCode(msg.options);
            break;
        case interfaces_1.WorkerCommand.printResult:
            checker.printResult(true);
            break;
    }
});
