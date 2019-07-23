"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getSyntacticDiagnostics(options, program) {
    return program
        .getSyntacticDiagnostics()
        .filter(function (errors) {
        if (options.skipTsErrors &&
            options.skipTsErrors.indexOf(errors.code) !== -1) {
            return false;
        }
        else {
            return true;
        }
    })
        .map(function (obj) {
        obj._type = 'syntactic';
        return obj;
    });
}
exports.getSyntacticDiagnostics = getSyntacticDiagnostics;
//# sourceMappingURL=getSyntacticDiagnostics.js.map