Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var chalk = require("chalk");
var Checker = (function () {
    function Checker() {
    }
    Checker.prototype.configure = function (options) {
        this.tsConfig = options.tsConfigObj;
        this.options = options;
        var parseConfigHost = {
            fileExists: ts.sys.fileExists,
            readDirectory: ts.sys.readDirectory,
            readFile: ts.sys.readFile,
            useCaseSensitiveFileNames: true
        };
        var start = new Date().getTime();
        var parsed = ts.parseJsonConfigFileContent(this.tsConfig, parseConfigHost, '.', null, 'tsconfig.json');
        this.program = ts.createProgram(parsed.fileNames, parsed.options, null, this.program);
        this.diagnostics = ts.getPreEmitDiagnostics(this.program);
        this.elapsed = new Date().getTime() - start;
    };
    Checker.prototype.typecheck = function () {
        var write = this.writeText;
        var diagnostics = this.diagnostics;
        var program = this.program;
        var options = this.options;
        var END_LINE = '\n';
        write(chalk.bgWhite(chalk.black(END_LINE + "Typechecker plugin(" + options.type + ") " + options.name + " " + END_LINE)));
        write(chalk.grey("Time:" + new Date().toString() + " " + END_LINE));
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
            messages.unshift(chalk.underline(END_LINE + "File errors:"));
            write(messages.join('\n'));
        }
        var optionsErrors = program.getOptionsDiagnostics().length;
        var globalErrors = program.getGlobalDiagnostics().length;
        var syntacticErrors = program.getSyntacticDiagnostics().length;
        var semanticErrors = program.getSemanticDiagnostics().length;
        var totals = optionsErrors + globalErrors + syntacticErrors + semanticErrors;
        write(chalk.underline("" + END_LINE + END_LINE + "Errors:" + totals + END_LINE));
        if (totals) {
            write(chalk[optionsErrors ? 'red' : 'white']("\u2514\u2500\u2500 Options: " + optionsErrors + END_LINE));
            write(chalk[globalErrors ? 'red' : 'white']("\u2514\u2500\u2500 Global: " + globalErrors + END_LINE));
            write(chalk[syntacticErrors ? 'red' : 'white']("\u2514\u2500\u2500 Syntactic: " + syntacticErrors + END_LINE));
            write(chalk[semanticErrors ? 'red' : 'white']("\u2514\u2500\u2500 Semantic: " + semanticErrors + END_LINE + END_LINE));
        }
        write(chalk.grey("Typechecking time: " + this.elapsed + "ms" + END_LINE));
        switch (true) {
            case options.throwOnGlobal && globalErrors > 0:
            case options.throwOnOptions && optionsErrors > 0:
            case options.throwOnSemantic && semanticErrors > 0:
            case options.throwOnSyntactic && syntacticErrors > 0:
                if (process.send) {
                    process.send('error');
                }
                else {
                    throw new Error('options.throwOnXXXXX triggered');
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
