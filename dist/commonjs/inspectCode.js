"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var getOptionsDiagnostics_1 = require("./getOptionsDiagnostics");
var getGlobalDiagnostics_1 = require("./getGlobalDiagnostics");
var getSyntacticDiagnostics_1 = require("./getSyntacticDiagnostics");
var getSemanticDiagnostics_1 = require("./getSemanticDiagnostics");
var geTsLintDiagnostics_1 = require("./geTsLintDiagnostics");
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
    return {
        oldProgram: program,
        lintFileResult: geTsLintDiagnostics_1.getTsLintDiagnostics(options, program),
        optionsErrors: getOptionsDiagnostics_1.getOptionsDiagnostics(options, program),
        globalErrors: getGlobalDiagnostics_1.getGlobalDiagnostics(options, program),
        syntacticErrors: getSyntacticDiagnostics_1.getSyntacticDiagnostics(options, program),
        semanticErrors: getSemanticDiagnostics_1.getSemanticDiagnostics(options, program),
        elapsedInspectionTime: new Date().getTime() - inspectionTimeStart
    };
}
exports.inspectCode = inspectCode;
//# sourceMappingURL=inspectCode.js.map