"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var interfaces_1 = require("./interfaces");
var printResult_1 = require("./printResult");
function throwIfError(options, errors) {
    switch (true) {
        case options.throwOnGlobal && errors.globalErrors.length > 0:
        case options.throwOnOptions && errors.optionsErrors.length > 0:
        case options.throwOnSemantic && errors.semanticErrors.length > 0:
        case options.throwOnTsLint && errors.lintFileResult.length > 0:
        case options.throwOnSyntactic && errors.syntacticErrors.length > 0:
            if (process.send) {
                process.send('error');
            }
            else {
                printResult_1.print(chalk_1.default.grey("error typechecker" + interfaces_1.END_LINE + interfaces_1.END_LINE));
            }
            process.exit(1);
            break;
    }
}
exports.throwIfError = throwIfError;
//# sourceMappingURL=throwIfErrors.js.map