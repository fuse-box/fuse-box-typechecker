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
        var short = options.shortenFilenames !== false ? true : false;
        var fullFileName = path.resolve(fileName);
        var shortFileName = fullFileName.split(options.basePath).join('.');
        return (chalk_1.default.grey(" \u2514\u2500\u2500") +
            chalk_1.default.blueBright("" + shortFileName) +
            interfaces_1.END_LINE +
            errors
                .map(function (err) {
                var text = chalk_1.default.red('    |');
                text += chalk_1.default[err.color](" " + (short ? shortFileName : fullFileName) + " (" + err.line + "," + err.char + ") ");
                text += chalk_1.default.grey("(" + err.category);
                text += chalk_1.default.grey(err.code + ")");
                text += ' ' + chalk_1.default.grey(err.message);
                return text;
            })
                .join(interfaces_1.END_LINE));
    });
    var name = options.name;
    if (allErrors.length > 0) {
        allErrors.unshift(chalk_1.default.white(" Typechecker (" + (name ? name : 'no-name') + "):" + chalk_1.default.white('')));
        print(allErrors.join(interfaces_1.END_LINE));
    }
    else {
        print(chalk_1.default.white(" Typechecker " + (name ? name : 'no-name') + ": No Errors found" + chalk_1.default.white('')));
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
            text = chalk_1.default[options.yellowOnOptions ? 'yellow' : 'red'](" \u2514\u2500\u2500 tsConfig: ");
            text += chalk_1.default.grey("(" + err.category + ":");
            text += chalk_1.default.grey(err.code + ")");
            text += chalk_1.default.grey(" " + messageText);
            return text;
        });
        print(optionErrorsText.join(interfaces_1.END_LINE));
    }
    print(interfaces_1.END_LINE);
    var optionsErrors = errors.optionsErrors.length;
    var globalErrors = errors.globalErrors.length;
    var syntacticErrors = errors.syntacticErrors.length;
    var semanticErrors = errors.semanticErrors.length;
    var totalsErrors = optionsErrors + globalErrors + syntacticErrors + semanticErrors;
    if (options.print_summary) {
        if (totalsErrors) {
            print(chalk_1.default.underline("" + interfaces_1.END_LINE + interfaces_1.END_LINE + "Errors") +
                chalk_1.default.white(":" + totalsErrors + interfaces_1.END_LINE));
            print(chalk_1.default[optionsErrors ? (options.yellowOnOptions ? 'yellow' : 'red') : 'white']("\u2514\u2500\u2500 Options: " + optionsErrors + interfaces_1.END_LINE));
            print(chalk_1.default[globalErrors ? (options.yellowOnGlobal ? 'yellow' : 'red') : 'white']("\u2514\u2500\u2500 Global: " + globalErrors + interfaces_1.END_LINE));
            print(chalk_1.default[syntacticErrors ? (options.yellowOnSyntactic ? 'yellow' : 'red') : 'white']("\u2514\u2500\u2500 Syntactic: " + syntacticErrors + interfaces_1.END_LINE));
            print(chalk_1.default[semanticErrors ? (options.yellowOnSemantic ? 'yellow' : 'red') : 'white']("\u2514\u2500\u2500 Semantic: " + semanticErrors + interfaces_1.END_LINE));
        }
    }
    if (options.print_runtime) {
        print(chalk_1.default.grey("Typechecking time: " + errors.elapsedInspectionTime + "ms" + interfaces_1.END_LINE + interfaces_1.END_LINE));
    }
    return totalsErrors;
}
exports.printResult = printResult;
//# sourceMappingURL=printResult.js.map