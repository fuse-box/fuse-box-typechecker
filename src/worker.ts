import * as ts from 'typescript';

let myClass: TypeCheckPluginClass = null;



class TypeCheckPluginClass {
    private tsConfig: any;
    private program: any;
    private firstRun: boolean;


    constructor() {
        this.firstRun = true; // need to know later
        // nothing atm
    }

    public setTsConfig(tsConfig: any) {
        this.tsConfig = tsConfig;
    }

    public typecheck(quit: boolean) {

        // shortcuts
        let write = this.writeText;
        let resetTextColor = this.resetTextColor;
        let setRedTextColor = this.setRedTextColor;
        let setBlueTextColor = this.setBlueTextColor;
        let setGreenTextColor = this.setGreenTextColor;
        let program = this.program;
        let tsConfig = this.tsConfig;


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

        const parsed = ts.parseJsonConfigFileContent(tsConfig, parseConfigHost, '.', null, 'tsconfig.json');
        program = ts.createProgram(parsed.fileNames, parsed.options, null, program);


        // get diagnostics
        const diagnostics = ts.getPreEmitDiagnostics(program);

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


        let optionsErrors = program.getOptionsDiagnostics().length;
        let globalErrors = program.getGlobalDiagnostics().length;
        let syntacticErrors = program.getSyntacticDiagnostics().length;
        let semantic = program.getSemanticDiagnostics().length;
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
            write(':> No errors while type checking!\n\n');
        }


        setBlueTextColor();
        // tslint:disable-next-line:no-console
        console.timeEnd('Typechecking time');
        resetTextColor();
        write(`\n`);


        this.firstRun = false; // need to know later

        if (quit) {
            write(`Quiting typechecker\n`);
            process.exit(1);
        } else {
            write(`Keeping typechecker alive\n`);
        }

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


myClass = new TypeCheckPluginClass();
process.on('message', function (msg: any) {
    let type = msg.type;
    switch (type) {
        case 'tsconfig':
            myClass.setTsConfig(msg.data);
            break;
        case 'run':
            myClass.typecheck(msg.quit);
            break;
    }
});
