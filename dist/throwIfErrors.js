"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interfaces_1 = require("./interfaces");
var printResult_1 = require("./printResult");
var logger_1 = require("./logger");
function throwIfError(options, errors) {
    switch (true) {
        case options.throwOnGlobal && errors.globalErrors.length > 0:
        case options.throwOnOptions && errors.optionsErrors.length > 0:
        case options.throwOnSemantic && errors.semanticErrors.length > 0:
        case options.throwOnSyntactic && errors.syntacticErrors.length > 0:
            logger_1.Logger.error("throw action- quiting" + interfaces_1.END_LINE + interfaces_1.END_LINE);
            printResult_1.printResult(options, errors);
            process.exit(1);
            break;
    }
}
exports.throwIfError = throwIfError;
//# sourceMappingURL=throwIfErrors.js.map