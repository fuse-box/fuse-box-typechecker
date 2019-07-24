"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getOptionsDiagnostics(options, program) {
    return program
        .getOptionsDiagnostics()
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
        obj._type = 'options';
        return obj;
    });
}
exports.getOptionsDiagnostics = getOptionsDiagnostics;
//# sourceMappingURL=getOptionsDiagnostics.js.map