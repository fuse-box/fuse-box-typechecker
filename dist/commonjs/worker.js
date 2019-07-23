"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interfaces_1 = require("./interfaces");
var inspectCode_1 = require("./inspectCode");
var printResult_1 = require("./printResult");
var watchSrc_1 = require("./watchSrc");
var printSettings_1 = require("./printSettings");
var debugPrint_1 = require("./debugPrint");
var lastResult;
var printErrorTotal;
process.on('message', function (msg) {
    debugPrint_1.debugPrint("worker message recived " + msg.type);
    switch (msg.type) {
        case interfaces_1.WorkerCommand.inspectCode:
            debugPrint_1.debugPrint('worker inspectCode');
            if (msg.options) {
                lastResult = inspectCode_1.inspectCode(msg.options, lastResult && lastResult.oldProgram);
            }
            else {
                throw new Error('You tried to inspect code without ts/lint options');
            }
            break;
        case interfaces_1.WorkerCommand.inspectCodeAndPrint:
            debugPrint_1.debugPrint('worker inspectCodeAndPrint');
            if (msg.options) {
                lastResult = inspectCode_1.inspectCode(msg.options, lastResult && lastResult.oldProgram);
                printErrorTotal = printResult_1.printResult(msg.options, lastResult);
                printErrorTotal = printErrorTotal;
            }
            else {
                throw new Error('You tried to inspect code without ts/lint options');
            }
            break;
        case interfaces_1.WorkerCommand.printResult:
            debugPrint_1.debugPrint('worker printResult');
            if (msg.options && lastResult) {
                printErrorTotal = printResult_1.printResult(msg.options, lastResult);
            }
            else {
                throw new Error('You tried to print code without ts/lint options or without having inspected code');
            }
            break;
        case interfaces_1.WorkerCommand.printSettings:
            debugPrint_1.debugPrint('worker printSettings');
            if (msg.options) {
                printSettings_1.printSettings(msg.options);
            }
            else {
                throw new Error('You tried to print settings without ts/lint options or without having inspected code');
            }
            break;
        case interfaces_1.WorkerCommand.watch:
            debugPrint_1.debugPrint('worker watch');
            if (msg.options) {
                watchSrc_1.watchSrc(msg.watchSrc, msg.options, function () {
                    lastResult = inspectCode_1.inspectCode(msg.options, lastResult && lastResult.oldProgram);
                    printErrorTotal = printResult_1.printResult(msg.options, lastResult);
                });
            }
            else {
                throw new Error('You tried to print code without ts/lint options or without having inspected code');
            }
            break;
    }
});
debugPrint_1.debugPrint('worker started');
//# sourceMappingURL=worker.js.map