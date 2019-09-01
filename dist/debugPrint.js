"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interfaces_1 = require("./interfaces");
var logger_1 = require("./logger");
var enable = false;
function debugPrint(text) {
    if (enable) {
        logger_1.Logger.info("Typechecker debugPrint:", text + interfaces_1.END_LINE);
    }
}
exports.debugPrint = debugPrint;
//# sourceMappingURL=debugPrint.js.map