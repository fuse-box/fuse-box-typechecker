"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var chalk = require("chalk");
var tslint = require("tslint");
var path = require("path");
var interfaces_1 = require("./interfaces");
var Checker = (function () {
    function Checker() {
    }
    Checker.prototype.inspectCode = function (options) {
        var _this = this;
        this.options = options;
        var parseConfigHost = {
            fileExists: ts.sys.fileExists,
            readDirectory: ts.sys.readDirectory,
            readFile: ts.sys.readFile,
            useCaseSensitiveFileNames: true
        };
        var inspectionTimeStart = new Date().getTime();
        var parsed = ts.parseJsonConfigFileContent(this.options.tsConfigJsonContent, parseConfigHost, options.basePath || '.', undefined);
        this.program = ts.createProgram(parsed.fileNames, parsed.options, undefined, this.program);
        this.tsDiagnostics = [];
        var optionsErrors = this.program.getOptionsDiagnostics().map(function (obj) {
            obj._type = 'options';
            return obj;
        });
        this.tsDiagnostics = this.tsDiagnostics.concat(optionsErrors);
        var globalErrors = this.program.getGlobalDiagnostics().map(function (obj) {
            obj._type = 'global';
            return obj;
        });
        this.tsDiagnostics = this.tsDiagnostics.concat(globalErrors);
        var syntacticErrors = this.program.getSyntacticDiagnostics().map(function (obj) {
            obj._type = 'syntactic';
            return obj;
        });
        this.tsDiagnostics = this.tsDiagnostics.concat(syntacticErrors);
        var semanticErrors = this.program.getSemanticDiagnostics().map(function (obj) {
            obj._type = 'semantic';
            return obj;
        });
        this.tsDiagnostics = this.tsDiagnostics.concat(semanticErrors);
        this.lintFileResult = [];
        if (options.tsLint) {
            var fullPath = path.resolve(this.options.basePath, options.tsLint);
            var files = tslint.Linter.getFileNames(this.program);
            var tsLintConfiguration_1 = tslint.Configuration.findConfiguration(fullPath, this.options.basePath).results;
            this.lintFileResult =
                files.map(function (file) {
                    var fileContents = _this.program.getSourceFile(file).getFullText();
                    var linter = new tslint.Linter(options.lintoptions, _this.program);
                    linter.lint(file, fileContents, tsLintConfiguration_1);
                    return linter.getResult();
                }).filter(function (result) {
                    return result.errorCount ? true : false;
                });
        }
        this.elapsedInspectionTime = new Date().getTime() - inspectionTimeStart;
    };
    Checker.prototype.printResult = function (isWorker) {
        var print = this.writeText;
        var program = this.program;
        var options = this.options;
        print(chalk.bgWhite(chalk.black(interfaces_1.END_LINE + "Typechecker plugin(" + options.type + ") " + options.name)) +
            chalk.white("." + interfaces_1.END_LINE));
        print(chalk.grey("Time:" + new Date().toString() + " " + interfaces_1.END_LINE));
        var lintErrorMessages = this.processLintFiles();
        var tsErrorMessages = this.processTsDiagnostics();
        var allErrors = tsErrorMessages.concat(lintErrorMessages);
        if (allErrors.length > 0) {
            allErrors.unshift(chalk.underline(interfaces_1.END_LINE + "File errors") + chalk.white(':'));
            print(allErrors.join(interfaces_1.END_LINE));
        }
        var optionsErrors = program.getOptionsDiagnostics().length;
        var globalErrors = program.getGlobalDiagnostics().length;
        var syntacticErrors = program.getSyntacticDiagnostics().length;
        var semanticErrors = program.getSemanticDiagnostics().length;
        var tsLintErrors = lintErrorMessages.length;
        var totalsErrors = optionsErrors + globalErrors + syntacticErrors + semanticErrors + tsLintErrors;
        if (totalsErrors) {
            print(chalk.underline("" + interfaces_1.END_LINE + interfaces_1.END_LINE + "Errors") +
                chalk.white(":" + totalsErrors + interfaces_1.END_LINE));
            print(chalk[optionsErrors ? options.yellowOnOptions ? 'yellow' : 'red' : 'white']("\u2514\u2500\u2500 Options: " + optionsErrors + interfaces_1.END_LINE));
            print(chalk[globalErrors ? options.yellowOnGlobal ? 'yellow' : 'red' : 'white']("\u2514\u2500\u2500 Global: " + globalErrors + interfaces_1.END_LINE));
            print(chalk[syntacticErrors ? options.yellowOnSyntactic ? 'yellow' : 'red' : 'white']("\u2514\u2500\u2500 Syntactic: " + syntacticErrors + interfaces_1.END_LINE));
            print(chalk[semanticErrors ? options.yellowOnSemantic ? 'yellow' : 'red' : 'white']("\u2514\u2500\u2500 Semantic: " + semanticErrors + interfaces_1.END_LINE));
            print(chalk[tsLintErrors ? options.yellowOnLint ? 'yellow' : 'red' : 'white']("\u2514\u2500\u2500 TsLint: " + tsLintErrors + interfaces_1.END_LINE + interfaces_1.END_LINE));
        }
        else {
            print(chalk.grey("All good, no errors :-)" + interfaces_1.END_LINE));
        }
        print(chalk.grey("Typechecking time: " + this.elapsedInspectionTime + "ms" + interfaces_1.END_LINE));
        switch (true) {
            case options.throwOnGlobal && globalErrors > 0:
            case options.throwOnOptions && optionsErrors > 0:
            case options.throwOnSemantic && semanticErrors > 0:
            case options.throwOnTsLint && tsLintErrors > 0:
            case options.throwOnSyntactic && syntacticErrors > 0:
                if (process.send) {
                    process.send('error');
                }
                else {
                    throw new Error('Typechecker throwing error due to throw options set');
                }
                process.exit(1);
                break;
            case options.quit && isWorker:
                print(chalk.grey("Quiting typechecker" + interfaces_1.END_LINE + interfaces_1.END_LINE));
                process.send('done');
                break;
            case options.quit && !isWorker:
                print(chalk.grey("Quiting typechecker" + interfaces_1.END_LINE + interfaces_1.END_LINE));
                break;
            default:
                print(chalk.grey("Keeping typechecker alive" + interfaces_1.END_LINE + interfaces_1.END_LINE));
        }
        return totalsErrors;
    };
    Checker.prototype.writeText = function (text) {
        ts.sys.write(text);
    };
    Checker.prototype.processLintFiles = function () {
        var options = this.options;
        var lintResultsFilesMessages = this.lintFileResult.map(function (fileResult) {
            var messages = [];
            if (fileResult.failures) {
                messages = fileResult.failures.map(function (failure) {
                    var r = {
                        fileName: failure.fileName,
                        line: failure.startPosition.lineAndCharacter.line,
                        char: failure.startPosition.lineAndCharacter.character,
                        ruleSeverity: failure.ruleSeverity.charAt(0).toUpperCase() + failure.ruleSeverity.slice(1),
                        ruleName: failure.ruleName,
                        failure: failure.failure
                    };
                    var message = chalk.red('└── ');
                    message += chalk[options.yellowOnLint ? 'yellow' : 'red'](r.fileName + " (" + (r.line + 1) + "," + (r.char + 1) + ") ");
                    message += chalk.white("(" + r.ruleSeverity + ":");
                    message += chalk.white(r.ruleName + ")");
                    message += ' ' + r.failure;
                    return message;
                });
            }
            return messages;
        }).filter(function (res) {
            return res.length === 0 ? false : true;
        });
        var lintErrorMessages = [];
        try {
            if (lintResultsFilesMessages.length) {
                lintErrorMessages = lintResultsFilesMessages.reduce(function (a, b) {
                    return a.concat(b);
                });
            }
        }
        catch (err) {
            console.log(err);
        }
        return lintErrorMessages;
    };
    Checker.prototype.processTsDiagnostics = function () {
        var options = this.options;
        var tsErrorMessages = [];
        if (this.tsDiagnostics.length > 0) {
            tsErrorMessages = this.tsDiagnostics.map(function (diag) {
                var message = chalk.red('└── ');
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
                if (diag.file) {
                    var _a = diag.file.getLineAndCharacterOfPosition(diag.start), line = _a.line, character = _a.character;
                    message += chalk[color](diag.file.fileName + " (" + (line + 1) + "," + (character + 1) + ") ");
                    message += chalk.white("(" + ts.DiagnosticCategory[diag.category] + ":");
                    message += chalk.white("TS" + diag.code + ")");
                }
                message += ' ' + ts.flattenDiagnosticMessageText(diag.messageText, interfaces_1.END_LINE);
                return message;
            });
        }
        return tsErrorMessages;
    };
    return Checker;
}());
exports.Checker = Checker;

//# sourceMappingURL=checker.js.map
