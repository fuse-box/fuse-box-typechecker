"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var interfaces_1 = require("./interfaces");
var ts = require("typescript");
var path = require("path");
var processTsDiagnostics_1 = require("./processTsDiagnostics");
function print(text) {
    ts.sys.write(text);
}
exports.print = print;
function printResult(options, errors) {
    print(chalk_1.default.bgWhite(chalk_1.default.black(interfaces_1.END_LINE + "Typechecker plugin: " + options.name + "." + interfaces_1.END_LINE)) +
        chalk_1.default.white(""));
    print(chalk_1.default.grey("Time:" + new Date().toString() + " " + interfaces_1.END_LINE));
    var tsErrorMessages = processTsDiagnostics_1.processTsDiagnostics(options, errors);
    var groupedErrors = {};
    tsErrorMessages.forEach(function (error) {
        if (!groupedErrors[error.fileName]) {
            groupedErrors[error.fileName] = [];
        }
        groupedErrors[error.fileName].push(error);
    });
    var allErrors = Object.entries(groupedErrors).map(function (_a) {
        var fileName = _a[0], errors = _a[1];
        var short = options.shortenFilenames;
        var fullFileName = path.resolve(fileName);
        var shortFileName = fullFileName.split(options.basePath).join('.');
        return (chalk_1.default.white("\u2514\u2500\u2500 " + shortFileName) +
            interfaces_1.END_LINE +
            errors
                .map(function (err) {
                var text = chalk_1.default.red('   |');
                text += chalk_1.default[err.color](" " + (short ? shortFileName : fullFileName) + " (" + err.line + "," + err.char + ") ");
                text += chalk_1.default.white("(" + err.category);
                text += chalk_1.default.white(err.code + ")");
                text += ' ' + err.message;
                return text;
            })
                .join(interfaces_1.END_LINE));
    });
    if (allErrors.length > 0) {
        allErrors.unshift(chalk_1.default.underline(interfaces_1.END_LINE + "File errors") + chalk_1.default.white(':'));
        print(allErrors.join(interfaces_1.END_LINE));
    }
    if (errors.globalErrors.length) {
        print(chalk_1.default.underline("" + interfaces_1.END_LINE + interfaces_1.END_LINE + "Option errors") + chalk_1.default.white(":" + interfaces_1.END_LINE));
        var optionErrorsText = Object.entries(errors.globalErrors).map(function (_a) {
            var no = _a[0], err = _a[1];
            var text = no + ':';
            var messageText = err.messageText;
            if (typeof messageText === 'object' && messageText !== null) {
                messageText = JSON.stringify(messageText);
            }
            text = chalk_1.default[options.yellowOnOptions ? 'yellow' : 'red']("\u2514\u2500\u2500 tsConfig: ");
            text += chalk_1.default.white("(" + err.category + ":");
            text += chalk_1.default.white(err.code + ")");
            text += chalk_1.default.white(" " + messageText);
            return text;
        });
        print(optionErrorsText.join(interfaces_1.END_LINE));
    }
    var optionsErrors = errors.optionsErrors.length;
    var globalErrors = errors.globalErrors.length;
    var syntacticErrors = errors.syntacticErrors.length;
    var semanticErrors = errors.semanticErrors.length;
    var totalsErrors = optionsErrors + globalErrors + syntacticErrors + semanticErrors;
    if (totalsErrors) {
        print(chalk_1.default.underline("" + interfaces_1.END_LINE + interfaces_1.END_LINE + "Errors") +
            chalk_1.default.white(":" + totalsErrors + interfaces_1.END_LINE));
        print(chalk_1.default[optionsErrors ? (options.yellowOnOptions ? 'yellow' : 'red') : 'white']("\u2514\u2500\u2500 Options: " + optionsErrors + interfaces_1.END_LINE));
        print(chalk_1.default[globalErrors ? (options.yellowOnGlobal ? 'yellow' : 'red') : 'white']("\u2514\u2500\u2500 Global: " + globalErrors + interfaces_1.END_LINE));
        print(chalk_1.default[syntacticErrors ? (options.yellowOnSyntactic ? 'yellow' : 'red') : 'white']("\u2514\u2500\u2500 Syntactic: " + syntacticErrors + interfaces_1.END_LINE));
        print(chalk_1.default[semanticErrors ? (options.yellowOnSemantic ? 'yellow' : 'red') : 'white']("\u2514\u2500\u2500 Semantic: " + semanticErrors + interfaces_1.END_LINE));
    }
    else {
        print(chalk_1.default.grey("All good, no errors :-)" + interfaces_1.END_LINE));
    }
    print(chalk_1.default.grey("Typechecking time: " + errors.elapsedInspectionTime + "ms" + interfaces_1.END_LINE));
    return totalsErrors;
}
exports.printResult = printResult;
//# sourceMappingURL=printResult.js.map