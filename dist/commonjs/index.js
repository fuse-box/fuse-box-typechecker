Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var TypeCheckPluginClass = (function () {
    function TypeCheckPluginClass(options) {
        this.options = options;
        this.firstRun = true;
    }
    TypeCheckPluginClass.prototype.init = function (context) {
        this.tsConfig = context.getTypeScriptConfig();
    };
    TypeCheckPluginClass.prototype.bundleEnd = function () {
        var write = this.writeText;
        var resetTextColor = this.resetTextColor;
        var setRedTextColor = this.setRedTextColor;
        var setBlueTextColor = this.setBlueTextColor;
        var setGreenTextColor = this.setGreenTextColor;
        setBlueTextColor();
        write('\nStarting type checking, please wait...\n\n');
        console.time('Typechecking time');
        this.executefirstRun();
        var diagnostics = ts.getPreEmitDiagnostics(this.program);
        setRedTextColor();
        if (diagnostics.length > 0) {
            var messages = diagnostics.map(function (diag) {
                var message = '└── ' + ts.DiagnosticCategory[diag.category];
                if (diag.file) {
                    var _a = diag.file.getLineAndCharacterOfPosition(diag.start), line = _a.line, character = _a.character;
                    message += ":TS" + diag.code + ":";
                    message += diag.file.fileName + ":(" + (line + 1) + ":" + (character + 1) + "):";
                }
                message += ' ' + ts.flattenDiagnosticMessageText(diag.messageText, '\n');
                return message;
            });
            write(messages.join('\n'));
        }
        setBlueTextColor();
        write('\n\n');
        var optionsErrors = this.program.getOptionsDiagnostics().length;
        var globalErrors = this.program.getGlobalDiagnostics().length;
        var syntacticErrors = this.program.getSyntacticDiagnostics().length;
        var semantic = this.program.getSemanticDiagnostics().length;
        var totals = optionsErrors + globalErrors + syntacticErrors + semantic;
        write("Errors:" + totals + "\n");
        setRedTextColor();
        write("\u2514\u2500\u2500 Options: " + optionsErrors + "\n");
        write("\u2514\u2500\u2500 Global: " + globalErrors + "\n");
        write("\u2514\u2500\u2500 Syntactic: " + syntacticErrors + "\n");
        write("\u2514\u2500\u2500 Semantic: " + semantic + "\n\n");
        if (totals) {
            setRedTextColor();
            if (this.firstRun) {
                write(':< looks like you have some work to do...\n\n');
            }
            else {
                write(':< still messed up...\n\n');
            }
        }
        else {
            setGreenTextColor();
            if (this.firstRun) {
                write(':> very nice!\n\n');
            }
            else {
                write(':> still perfect!\n\n');
            }
        }
        setBlueTextColor();
        console.timeEnd('Typechecking time');
        resetTextColor();
        write("\n");
        this.firstRun = false;
    };
    TypeCheckPluginClass.prototype.executefirstRun = function () {
        var parseConfigHost = {
            fileExists: ts.sys.fileExists,
            readDirectory: ts.sys.readDirectory,
            readFile: ts.sys.readFile,
            useCaseSensitiveFileNames: true
        };
        var parsed = ts.parseJsonConfigFileContent(this.tsConfig, parseConfigHost, '.', null, 'tsconfig.json');
        this.program = ts.createProgram(parsed.fileNames, parsed.options);
    };
    TypeCheckPluginClass.prototype.writeText = function (text) {
        ts.sys.write(text);
    };
    TypeCheckPluginClass.prototype.resetTextColor = function () {
        ts.sys.write('\x1b[0m');
    };
    TypeCheckPluginClass.prototype.setRedTextColor = function () {
        ts.sys.write('\x1b[91m');
    };
    TypeCheckPluginClass.prototype.setBlueTextColor = function () {
        ts.sys.write('\x1b[34m');
    };
    TypeCheckPluginClass.prototype.setGreenTextColor = function () {
        ts.sys.write('\x1b[32m');
    };
    return TypeCheckPluginClass;
}());
exports.TypeCheckPluginClass = TypeCheckPluginClass;
exports.TypeCheckPlugin = function (options) {
    return new TypeCheckPluginClass(options);
};
