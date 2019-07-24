"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var getOptionsDiagnostics_1 = require("./getOptionsDiagnostics");
var getGlobalDiagnostics_1 = require("./getGlobalDiagnostics");
var getSyntacticDiagnostics_1 = require("./getSyntacticDiagnostics");
var getSemanticDiagnostics_1 = require("./getSemanticDiagnostics");
var throwIfErrors_1 = require("./throwIfErrors");
function inspectCode(options, oldProgram) {
    var parseConfigHost = {
        fileExists: ts.sys.fileExists,
        readDirectory: ts.sys.readDirectory,
        readFile: ts.sys.readFile,
        useCaseSensitiveFileNames: true
    };
    var inspectionTimeStart = new Date().getTime();
    var parsed = ts.parseJsonConfigFileContent(options.tsConfigJsonContent, parseConfigHost, options.basePath || '.', undefined);
    var host = ts.createIncrementalCompilerHost(parsed.options);
    var program = ts.createEmitAndSemanticDiagnosticsBuilderProgram(parsed.fileNames, parsed.options, host, oldProgram, undefined, parsed.projectReferences);
    var results = {
        oldProgram: program,
        optionsErrors: getOptionsDiagnostics_1.getOptionsDiagnostics(options, program),
        globalErrors: getGlobalDiagnostics_1.getGlobalDiagnostics(options, program),
        syntacticErrors: getSyntacticDiagnostics_1.getSyntacticDiagnostics(options, program),
        semanticErrors: getSemanticDiagnostics_1.getSemanticDiagnostics(options, program),
        elapsedInspectionTime: new Date().getTime() - inspectionTimeStart
    };
    throwIfErrors_1.throwIfError(options, results);
    return results;
}
exports.inspectCode = inspectCode;
//# sourceMappingURL=inspectCode.js.map