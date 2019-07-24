"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getGlobalDiagnostics(options, program) {
    return program
        .getGlobalDiagnostics()
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
        obj._type = 'global';
        return obj;
    });
}
exports.getGlobalDiagnostics = getGlobalDiagnostics;
//# sourceMappingURL=getGlobalDiagnostics.js.map