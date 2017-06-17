Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
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
        debugger;
        this.program = ts.createProgram(parsed.fileNames, parsed.options, null, this.program);
        this.diagnostics = ts.getPreEmitDiagnostics(this.program);
        this.elapsed = new Date().getTime() - start;
    };
    Checker.prototype.typecheck = function () {
        var write = this.writeText;
        var diagnostics = this.diagnostics;
        var program = this.program;
        var options = this.options;
        var TEXT_WHITE = '\x1b[0m';
        var TEXT_RED = '\x1b[91m';
        var TEXT_UNDERLINE_START = '\x1B[4m';
        var TEXT_UNDERLINE_END = '\x1B[24m';
        var TEXT_BOLD_START = '\x1B[1m';
        var TEXT_BOLD_END = '\x1B[22m';
        var TEXT_INVERT_START = '\x1B[7m';
        var TEXT_INVERT_END = '\x1B[27m';
        var TEXT_ITALIC_START = '\x1b[90m';
        var TEXT_ITALIC_END = '\x1b[0m';
        var TEXT_END_LINE = '\n';
        write("" + TEXT_END_LINE + TEXT_INVERT_START + TEXT_BOLD_START + "Typechecker plugin" + TEXT_BOLD_END + TEXT_INVERT_END + TEXT_END_LINE);
        var messages = [];
        if (diagnostics.length > 0) {
            messages = diagnostics.map(function (diag) {
                var message = TEXT_RED + "\u2514\u2500\u2500 ";
                if (diag.file) {
                    var _a = diag.file.getLineAndCharacterOfPosition(diag.start), line = _a.line, character = _a.character;
                    message += diag.file.fileName + ": (" + (line + 1) + ":" + (character + 1) + "):";
                    message += TEXT_WHITE;
                    message += ts.DiagnosticCategory[diag.category];
                    message += " TS" + diag.code + ":";
                }
                message += ' ' + ts.flattenDiagnosticMessageText(diag.messageText, TEXT_END_LINE);
                return message;
            });
            messages.unshift("" + TEXT_END_LINE + TEXT_WHITE + TEXT_UNDERLINE_START + "File errors:" + TEXT_UNDERLINE_END);
            write(messages.join('\n'));
        }
        write(TEXT_WHITE + TEXT_END_LINE + TEXT_END_LINE);
        var optionsErrors = program.getOptionsDiagnostics().length;
        var globalErrors = program.getGlobalDiagnostics().length;
        var syntacticErrors = program.getSyntacticDiagnostics().length;
        var semanticErrors = program.getSemanticDiagnostics().length;
        var totals = optionsErrors + globalErrors + syntacticErrors + semanticErrors;
        write(TEXT_UNDERLINE_START + "Errors:" + totals + TEXT_UNDERLINE_END + TEXT_END_LINE);
        if (totals) {
            write((optionsErrors ? TEXT_RED : TEXT_WHITE) + "\u2514\u2500\u2500 Options: " + optionsErrors + TEXT_END_LINE);
            write((globalErrors ? TEXT_RED : TEXT_WHITE) + "\u2514\u2500\u2500 Global: " + globalErrors + TEXT_END_LINE);
            write((syntacticErrors ? TEXT_RED : TEXT_WHITE) + "\u2514\u2500\u2500 Syntactic: " + syntacticErrors + TEXT_END_LINE);
            write((semanticErrors ? TEXT_RED : TEXT_WHITE) + "\u2514\u2500\u2500 Semantic: " + semanticErrors + TEXT_END_LINE + TEXT_END_LINE);
        }
        write(TEXT_ITALIC_START);
        write("" + TEXT_WHITE + TEXT_ITALIC_START + "Typechecking time: " + this.elapsed + "ms" + TEXT_ITALIC_END + TEXT_END_LINE);
        switch (true) {
            case options.throwOnGlobal && globalErrors > 0:
            case options.throwOnOptions && optionsErrors > 0:
            case options.throwOnSemantic && semanticErrors > 0:
            case options.throwOnSyntactic && syntacticErrors > 0:
                process.send('error');
                process.exit(0);
                break;
            case options.quit:
                write(TEXT_ITALIC_START + "Quiting typechecker" + TEXT_ITALIC_END + TEXT_END_LINE + TEXT_END_LINE);
                process.exit(0);
                break;
            default:
                write(TEXT_ITALIC_START + "Keeping typechecker alive" + TEXT_ITALIC_END + TEXT_END_LINE + TEXT_END_LINE);
        }
        write(TEXT_ITALIC_END);
    };
    Checker.prototype.writeText = function (text) {
        ts.sys.write(text);
    };
    return Checker;
}());
exports.Checker = Checker;
