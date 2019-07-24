"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interfaces_1 = require("./interfaces");
var ts = require("typescript");
function processTsDiagnostics(options, errors) {
    return errors.globalErrors
        .concat(errors.semanticErrors)
        .concat(errors.syntacticErrors)
        .concat(errors.optionsErrors)
        .filter(function (diag) { return diag.file; })
        .map(function (diag) {
        var color;
        switch (diag._type) {
            case 'options':
                color = options.yellowOnOptions ? 'yellow' : 'red';
                break;
            case 'global':
                color = options.yellowOnGlobal ? 'yellow' : 'red';
                break;
            case 'syntactic':
                color = options.yellowOnSyntactic ? 'yellow' : 'red';
                break;
            case 'semantic':
                color = options.yellowOnSemantic ? 'yellow' : 'red';
                break;
            default:
                color = 'red';
        }
        var _a = diag.file.getLineAndCharacterOfPosition(diag.start), line = _a.line, character = _a.character;
        return {
            fileName: diag.file.fileName,
            line: line + 1,
            message: ts.flattenDiagnosticMessageText(diag.messageText, interfaces_1.END_LINE),
            char: character + 1,
            color: color,
            category: ts.DiagnosticCategory[diag.category] + ":",
            code: "TS" + diag.code
        };
    });
}
exports.processTsDiagnostics = processTsDiagnostics;
//# sourceMappingURL=processTsDiagnostics.js.map