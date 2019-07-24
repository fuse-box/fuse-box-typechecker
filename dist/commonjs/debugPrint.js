"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var printResult_1 = require("./printResult");
var interfaces_1 = require("./interfaces");
var enable = true;
function debugPrint(text) {
    if (enable) {
        printResult_1.print(chalk_1.default.bgYellow(chalk_1.default.black(text + interfaces_1.END_LINE)));
    }
}
exports.debugPrint = debugPrint;
//# sourceMappingURL=debugPrint.js.map