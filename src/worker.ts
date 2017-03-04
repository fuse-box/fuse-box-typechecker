import * as ts from 'typescript';

let myClass: TypeCheckPluginClass = null;
let firstRun = true;

class TypeCheckPluginClass {
    private tsConfig: any;
    private program: any;


    constructor(tsConfig: any) {
        this.tsConfig = tsConfig;
    }


    public typecheck() {

        // shortcuts
        let write = this.writeText;
        let resetTextColor = this.resetTextColor;
        let setRedTextColor = this.setRedTextColor;
        let setBlueTextColor = this.setBlueTextColor;
        let setGreenTextColor = this.setGreenTextColor;


        // tell use we are starting type checking
        setBlueTextColor();
        write('\nStarting type checking thread, please wait...\n\n');

        // start timing
        // tslint:disable-next-line:no-console
        console.time('Typechecking time');

        const parseConfigHost: any = {
            fileExists: ts.sys.fileExists,
            readDirectory: ts.sys.readDirectory,
            readFile: ts.sys.readFile,
            useCaseSensitiveFileNames: true
        };

        const parsed = ts.parseJsonConfigFileContent(this.tsConfig, parseConfigHost, '.', null, 'tsconfig.json');
        this.program = ts.createProgram(parsed.fileNames, parsed.options, null, this.program);


        // get diagnostics
        const diagnostics = ts.getPreEmitDiagnostics(this.program);

        // loop diagnostics
        let messages = [];
        if (diagnostics.length > 0) {
            messages = diagnostics.map((diag) => {

                // get message type error, warn, info
                let message = '└── ' + ts.DiagnosticCategory[diag.category];

                // if file
                if (diag.file) {
                    const {
                        line,
                        character
                    } = diag.file.getLineAndCharacterOfPosition(diag.start);
                    message += `:TS${diag.code}:`;
                    message += `${diag.file.fileName}:(${line + 1}:${character + 1}):`;
                }

                // flatten error message
                message += ' ' + ts.flattenDiagnosticMessageText(diag.messageText, '\n');

                // return message
                return message;
            });

            // write errors
            messages.unshift('\n\x1b[34mFile errors:\x1b[91m');
            write(messages.join('\n'));


        }


        setBlueTextColor();
        write('\n\n');


        let optionsErrors = this.program.getOptionsDiagnostics().length;
        let globalErrors = this.program.getGlobalDiagnostics().length;
        let syntacticErrors = this.program.getSyntacticDiagnostics().length;
        let semantic = this.program.getSemanticDiagnostics().length;
        let totals = optionsErrors + globalErrors + syntacticErrors + semantic;


        if (totals) {
            write(`Errors:${totals}\n`);
            setRedTextColor();
            write(`└── Options: ${optionsErrors}\n`);
            write(`└── Global: ${globalErrors}\n`);
            write(`└── Syntactic: ${syntacticErrors}\n`);
            write(`└── Semantic: ${semantic}\n\n`);
        }


        if (totals) {
            setRedTextColor();
            write(':< looks like you have some work to do...\n\n');
        } else {
            setGreenTextColor();
            write(':> No errors!\n\n');
        }


        setBlueTextColor();
        // tslint:disable-next-line:no-console
        console.timeEnd('Typechecking time');
        resetTextColor();
        write(`\n`);


        firstRun = false;

    }


    private writeText(text: string) {
        ts.sys.write(text);
    }


    private resetTextColor() {
        ts.sys.write('\x1b[0m');
    }


    private setRedTextColor() {
        ts.sys.write('\x1b[91m');
    }


    private setBlueTextColor() {
        ts.sys.write('\x1b[34m');
    }


    private setGreenTextColor() {
        ts.sys.write('\x1b[32m');
    }

}



process.on('message', function (msg: any) {
    let type = msg.type;
    switch (type) {
        case 'tsconfig':
            myClass = new TypeCheckPluginClass(msg.data);
            break;
        case 'run':
            myClass.typecheck();
            break;
    }
});
