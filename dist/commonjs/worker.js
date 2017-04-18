Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var myClass = null;
var TypeCheckPluginClass = (function () {
    function TypeCheckPluginClass() {
        this.firstRun = true;
    }
    TypeCheckPluginClass.prototype.setTsConfig = function (tsConfig) {
        this.tsConfig = tsConfig;
    };
    TypeCheckPluginClass.prototype.typecheck = function (options, bundleName) {
        var write = this.writeText;
        var resetTextColor = this.resetTextColor;
        var setRedTextColor = this.setRedTextColor;
        var setBlueTextColor = this.setBlueTextColor;
        var setGreenTextColor = this.setGreenTextColor;
        var program = this.program;
        var tsConfig = this.tsConfig;
        setBlueTextColor();
        write("\nStarting type checking thread for bundle \"" + bundleName + "\", please wait...\n\n");
        resetTextColor();
        console.time("Typechecking time bundle: " + bundleName);
        var parseConfigHost = {
            fileExists: ts.sys.fileExists,
            readDirectory: ts.sys.readDirectory,
            readFile: ts.sys.readFile,
            useCaseSensitiveFileNames: true
        };
        var parsed = ts.parseJsonConfigFileContent(tsConfig, parseConfigHost, '.', null, 'tsconfig.json');
        program = ts.createProgram(parsed.fileNames, parsed.options, null, program);
        var diagnostics = ts.getPreEmitDiagnostics(program);
        var messages = [];
        if (diagnostics.length > 0) {
            messages = diagnostics.map(function (diag) {
                var message = '└── ' + ts.DiagnosticCategory[diag.category];
                if (diag.file) {
                    var _a = diag.file.getLineAndCharacterOfPosition(diag.start), line = _a.line, character = _a.character;
                    message += ":TS" + diag.code + ":";
                    message += diag.file.fileName + ":(" + (line + 1) + ":" + (character + 1) + "):";
                }
                message += ' ' + ts.flattenDiagnosticMessageText(diag.messageText, '\n');
                return message;
            });
            messages.unshift("\n\u001B[34mFile errors(" + bundleName + "):\u001B[91m");
            write(messages.join('\n'));
        }
        setBlueTextColor();
        write('\n\n');
        var optionsErrors = program.getOptionsDiagnostics().length;
        var globalErrors = program.getGlobalDiagnostics().length;
        var syntacticErrors = program.getSyntacticDiagnostics().length;
        var semanticErrors = program.getSemanticDiagnostics().length;
        var totals = optionsErrors + globalErrors + syntacticErrors + semanticErrors;
        if (totals) {
            write("Errors(" + bundleName + "):" + totals + "\n");
            setRedTextColor();
            write("\u2514\u2500\u2500 Options: " + optionsErrors + "\n");
            write("\u2514\u2500\u2500 Global: " + globalErrors + "\n");
            write("\u2514\u2500\u2500 Syntactic: " + syntacticErrors + "\n");
            write("\u2514\u2500\u2500 Semantic: " + semanticErrors + "\n\n");
        }
        if (totals) {
            setRedTextColor();
            write(":< looks like you have some work to do on bundle :\"" + bundleName + "\"\n\n");
        }
        else {
            setGreenTextColor();
            write(":> No errors while type checking bundle: \"" + bundleName + "\"\n\n");
        }
        setBlueTextColor();
        console.timeEnd("Typechecking time bundle: " + bundleName);
        resetTextColor();
        write("\n");
        this.firstRun = false;
        switch (true) {
            case options.throwOnGlobal && globalErrors > 0:
            case options.throwOnOptions && optionsErrors > 0:
            case options.throwOnSemantic && semanticErrors > 0:
            case options.throwOnSyntactic && syntacticErrors > 0:
                process.send('error');
                process.exit(0);
                break;
            case options.quit:
                write("Quiting typechecker\n");
                process.exit(0);
                break;
            default:
                write("Keeping typechecker alive\n");
        }
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
myClass = new TypeCheckPluginClass();
process.on('message', function (msg) {
    var type = msg.type;
    switch (type) {
        case 'tsconfig':
            myClass.setTsConfig(msg.data);
            break;
        case 'run':
            myClass.typecheck(msg.options, msg.bundle);
            break;
    }
});
