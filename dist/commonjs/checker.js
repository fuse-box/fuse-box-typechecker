Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var chalk = require("chalk");
var tslint = require("tslint");
var path = require("path");
var Checker = (function () {
    function Checker() {
    }
    Checker.prototype.configure = function (options) {
        var _this = this;
        this.tsConfig = options.tsConfigObj;
        this.options = options;
        var parseConfigHost = {
            fileExists: ts.sys.fileExists,
            readDirectory: ts.sys.readDirectory,
            readFile: ts.sys.readFile,
            useCaseSensitiveFileNames: true
        };
        var start = new Date().getTime();
        var parsed = ts.parseJsonConfigFileContent(this.tsConfig, parseConfigHost, options.basePath || '.', null);
        this.program = ts.createProgram(parsed.fileNames, parsed.options, null, this.program);
        this.diagnostics = ts.getPreEmitDiagnostics(this.program);
        this.lintResults = [];
        if (options.tsLint) {
            var fullPath = path.resolve(this.options.basePath, options.tsLint);
            var fileName = path.basename(fullPath);
            var basePath = path.dirname(fullPath);
            console.log("f:" + fileName + "   base:" + basePath);
            this.files = tslint.Linter.getFileNames(this.program);
            var config_1 = tslint.Configuration.findConfiguration(fullPath, this.options.basePath).results;
            this.lintResults = this.files.map(function (file) {
                var fileContents = _this.program.getSourceFile(file).getFullText();
                var linter = new tslint.Linter(options.lintoptions, _this.program);
                linter.lint(file, fileContents, config_1);
                return linter.getResult();
            }).filter(function (result) {
                return result.errorCount ? true : false;
            });
        }
        this.elapsed = new Date().getTime() - start;
    };
    Checker.prototype.typecheck = function () {
        var write = this.writeText;
        var diagnostics = this.diagnostics;
        var program = this.program;
        var options = this.options;
        var END_LINE = '\n';
        write(chalk.bgWhite(chalk.black(END_LINE + "Typechecker plugin(" + options.type + ") " + options.name)) +
            chalk.white("." + END_LINE));
        write(chalk.grey("Time:" + new Date().toString() + " " + END_LINE));
        var lintResults = this.lintResults.map(function (errors) {
            if (errors.failures) {
                var messages_1 = errors.failures.map(function (failure) {
                    var r = {
                        fileName: failure.fileName,
                        line: failure.startPosition.lineAndCharacter.line,
                        char: failure.startPosition.lineAndCharacter.character,
                        ruleSeverity: failure.ruleSeverity,
                        ruleName: failure.ruleName,
                        failure: failure.failure
                    };
                    var message = chalk.red('└── ');
                    message += chalk.red(r.fileName + ": (" + (r.line + 1) + ":" + (r.char + 1) + "):");
                    message += chalk.white(r.ruleSeverity);
                    message += chalk.white(" TSLint: \"" + r.ruleName + "\":");
                    message += ' ' + r.failure;
                    return message;
                });
                return messages_1;
            }
        });
        try {
            if (lintResults.length) {
                lintResults = lintResults.reduce(function (a, b) {
                    return a.concat(b);
                });
            }
        }
        catch (err) {
            console.log(err);
        }
        var messages = [];
        if (diagnostics.length > 0) {
            messages = diagnostics.map(function (diag) {
                var message = chalk.red('└── ');
                if (diag.file) {
                    var _a = diag.file.getLineAndCharacterOfPosition(diag.start), line = _a.line, character = _a.character;
                    message += chalk.red(diag.file.fileName + ": (" + (line + 1) + ":" + (character + 1) + "):");
                    message += chalk.white(ts.DiagnosticCategory[diag.category]);
                    message += chalk.white(" TS" + diag.code + ":");
                }
                message += ' ' + ts.flattenDiagnosticMessageText(diag.messageText, END_LINE);
                return message;
            });
            messages.unshift(chalk.underline(END_LINE + "File errors") + chalk.white(':'));
            var x = messages.concat(lintResults);
            write(x.join('\n'));
        }
        var optionsErrors = program.getOptionsDiagnostics().length;
        var globalErrors = program.getGlobalDiagnostics().length;
        var syntacticErrors = program.getSyntacticDiagnostics().length;
        var semanticErrors = program.getSemanticDiagnostics().length;
        var tsLintErrors = lintResults.length;
        var totals = optionsErrors + globalErrors + syntacticErrors + semanticErrors + tsLintErrors;
        write(chalk.underline("" + END_LINE + END_LINE + "Errors") +
            chalk.white(":" + totals + END_LINE));
        if (totals) {
            write(chalk[optionsErrors ? 'red' : 'white']("\u2514\u2500\u2500 Options: " + optionsErrors + END_LINE));
            write(chalk[globalErrors ? 'red' : 'white']("\u2514\u2500\u2500 Global: " + globalErrors + END_LINE));
            write(chalk[syntacticErrors ? 'red' : 'white']("\u2514\u2500\u2500 Syntactic: " + syntacticErrors + END_LINE));
            write(chalk[semanticErrors ? 'red' : 'white']("\u2514\u2500\u2500 Semantic: " + semanticErrors + END_LINE));
            write(chalk[tsLintErrors ? 'red' : 'white']("\u2514\u2500\u2500 TsLint: " + tsLintErrors + END_LINE + END_LINE));
        }
        write(chalk.grey("Typechecking time: " + this.elapsed + "ms" + END_LINE));
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
            case options.quit:
                write(chalk.grey("Quiting typechecker" + END_LINE + END_LINE));
                process.send('done');
                break;
            case options.finished:
                write(chalk.grey("Quiting typechecker" + END_LINE + END_LINE));
                break;
            default:
                write(chalk.grey("Keeping typechecker alive" + END_LINE + END_LINE));
        }
        return totals;
    };
    Checker.prototype.writeText = function (text) {
        ts.sys.write(text);
    };
    return Checker;
}());
exports.Checker = Checker;
