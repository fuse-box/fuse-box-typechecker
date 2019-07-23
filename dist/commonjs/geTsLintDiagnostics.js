"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var path = require("path");
var printResult_1 = require("./printResult");
var tslint;
try {
    tslint = require('tslint');
}
catch (_a) {
    tslint = null;
}
function getTsLintDiagnostics(options, program) {
    if (options.tsLint) {
        if (!tslint) {
            printResult_1.print(chalk_1.default.red("\nMake sure to have " + chalk_1.default.bgWhiteBright('tslint') + " installed if you use the \"tsLint\" option:\n") + chalk_1.default.redBright('npm install --save-dev tslint\n\n'));
            throw new Error('tslint not installed');
        }
        var fullPath = path.resolve(options.basePath, options.tsLint);
        var files = tslint.Linter.getFileNames(program.getProgram());
        var tsLintConfiguration_1 = tslint.Configuration.findConfiguration(fullPath, options.basePath).results;
        return files
            .map(function (file) {
            var fileContents = program.getSourceFile(file);
            fileContents = fileContents ? fileContents.getFullText() : '';
            var linter = new tslint.Linter(options.lintoptions, program.getProgram());
            linter.lint(file, fileContents, tsLintConfiguration_1);
            return linter.getResult();
        })
            .filter(function (result) {
            return result.errorCount ? true : false;
        });
    }
    else {
        return [];
    }
}
exports.getTsLintDiagnostics = getTsLintDiagnostics;
//# sourceMappingURL=geTsLintDiagnostics.js.map