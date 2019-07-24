"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getSemanticDiagnostics(options, program) {
    return program
        .getSemanticDiagnostics()
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
        obj._type = 'semantic';
        return obj;
    });
}
exports.getSemanticDiagnostics = getSemanticDiagnostics;
//# sourceMappingURL=getSemanticDiagnostics.js.map