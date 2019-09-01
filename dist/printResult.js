"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interfaces_1 = require("./interfaces");
var path = require("path");
var processTsDiagnostics_1 = require("./processTsDiagnostics");
var logger_1 = require("./logger");
function printResult(options, errors) {
    var tsErrorMessages = processTsDiagnostics_1.processTsDiagnostics(options, errors);
    var groupedErrors = {};
    tsErrorMessages.forEach(function (error) {
        if (!groupedErrors[error.fileName]) {
            groupedErrors[error.fileName] = [];
        }
        groupedErrors[error.fileName].push(error);
    });
    var optionsErrors = errors.optionsErrors.length;
    var globalErrors = errors.globalErrors.length;
    var syntacticErrors = errors.syntacticErrors.length;
    var semanticErrors = errors.semanticErrors.length;
    var totalsErrors = optionsErrors + globalErrors + syntacticErrors + semanticErrors;
    var allErrors = Object.entries(groupedErrors).map(function (_a) {
        var fileName = _a[0], errors = _a[1];
        var short = options.shortenFilenames !== false ? true : false;
        var fullFileName = path.resolve(fileName);
        var shortFileName = fullFileName.split(options.basePath).join('.');
        if (path.isAbsolute(shortFileName)) {
            shortFileName = path.relative(process.cwd(), fullFileName);
        }
        else {
            if (options.basePathSetup) {
                shortFileName = path.join(options.basePathSetup, shortFileName);
            }
        }
        return (logger_1.Style.grey("   \u2514\u2500\u2500 ") +
            logger_1.Style.underline(logger_1.Style.cyan("" + shortFileName)) +
            logger_1.Style.grey(" - " + errors.length + " errors") +
            interfaces_1.END_LINE +
            errors
                .map(function (err) {
                var text = logger_1.Style.red('    | ');
                text += logger_1.Style[err.color](" " + (short ? shortFileName : fullFileName) + " (" + err.line + "," + err.char + ") ");
                text += logger_1.Style.grey("(" + err.category);
                text += logger_1.Style.grey(err.code + ")");
                text += ' ' + logger_1.Style.grey(err.message);
                return text;
            })
                .join(interfaces_1.END_LINE));
    });
    var name = options.name;
    if (allErrors.length > 0) {
        logger_1.Logger.echo('');
        logger_1.Logger.info("Typechecker inspection - (" + (name ? name : 'no-name') + "):", logger_1.Style.grey(totalsErrors + " errors."));
        logger_1.Logger.echo(allErrors.join(interfaces_1.END_LINE));
    }
    else {
        logger_1.Logger.echo(interfaces_1.END_LINE);
        logger_1.Logger.info("Typechecker inspection - (" + (name ? name : 'no-name') + "):", " No Errors found");
    }
    if (errors.globalErrors.length) {
        logger_1.Logger.echo(logger_1.Style.underline("" + interfaces_1.END_LINE + interfaces_1.END_LINE + "Option errors") + logger_1.Style.white(":" + interfaces_1.END_LINE));
        var optionErrorsText = Object.entries(errors.globalErrors).map(function (_a) {
            var no = _a[0], err = _a[1];
            var text = no + ':';
            var messageText = err.messageText;
            if (typeof messageText === 'object' && messageText !== null) {
                messageText = JSON.stringify(messageText);
            }
            text = "   \u2514\u2500\u2500 tsConfig: ";
            text += logger_1.Style.grey("(" + err.category + ":");
            text += logger_1.Style.grey(err.code + ")");
            text += logger_1.Style.grey(" " + messageText);
            return text;
        });
        logger_1.Logger.echo(optionErrorsText.join(interfaces_1.END_LINE));
    }
    if (options.print_summary) {
        if (totalsErrors) {
            var str = '';
            logger_1.Logger.info(interfaces_1.END_LINE + "  " + logger_1.Style.underline("Typechecker Summary:"), logger_1.Style.grey("Errors - " + totalsErrors));
            str += "   " + logger_1.Style[optionsErrors ? 'red' : 'grey']("\u2514\u2500\u2500 Options: " + optionsErrors + interfaces_1.END_LINE);
            str += "   " + logger_1.Style[globalErrors ? 'red' : 'grey']("\u2514\u2500\u2500 Global: " + globalErrors + interfaces_1.END_LINE);
            str += "   " + logger_1.Style[syntacticErrors ? 'red' : 'grey']("\u2514\u2500\u2500 Syntactic: " + syntacticErrors + interfaces_1.END_LINE);
            str += "   " + logger_1.Style[semanticErrors ? 'red' : 'grey']("\u2514\u2500\u2500 Semantic: " + semanticErrors + interfaces_1.END_LINE);
            logger_1.Logger.echo(str);
        }
    }
    if (options.print_runtime) {
        logger_1.Logger.info("Typechecker inspection time:", logger_1.Style.grey(errors.elapsedInspectionTime + "ms" + interfaces_1.END_LINE + interfaces_1.END_LINE));
    }
    return totalsErrors;
}
exports.printResult = printResult;
//# sourceMappingURL=printResult.js.map