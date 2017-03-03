// mostly a little from compiler API, gulp-typescript, tslint and a lot of failing :-)

import * as ts from 'typescript';



export class TypeCheckPluginClass {
    private options: any;
    private firstRun: boolean;
    private tsConfig: any;
    private program: any;

    constructor(options: any) {
        this.options = options;
        this.firstRun = true;
    }

    public init(context: any) {
        this.tsConfig = context.getTypeScriptConfig();
    }


    public bundleEnd() {

        // shortcuts
        let write = this.writeText;
        let resetTextColor = this.resetTextColor;
        let setRedTextColor = this.setRedTextColor;
        let setBlueTextColor = this.setBlueTextColor;
        let setGreenTextColor = this.setGreenTextColor;


        // tell use we are starting type checking
        setBlueTextColor();
        write('\nStarting type checking, please wait...\n\n');

        // start timing
        // tslint:disable-next-line:no-console
        console.time('Typechecking time');


        // if first time we need to create ts program
        // if (this.firstRun) { <- cant, need it to update..
            this.executefirstRun();
        // }


        // get diagnostics
        const diagnostics = ts.getPreEmitDiagnostics(this.program);


        setRedTextColor();
        // loop diagnostics
        if (diagnostics.length > 0) {
            const messages = diagnostics.map((diag) => {

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
            write(messages.join('\n'));


        }

        setBlueTextColor();
        write('\n\n');

        let optionsErrors = this.program.getOptionsDiagnostics().length;
        let globalErrors = this.program.getGlobalDiagnostics().length;
        let syntacticErrors = this.program.getSyntacticDiagnostics().length;
        let semantic = this.program.getSemanticDiagnostics().length;
        let totals = optionsErrors + globalErrors + syntacticErrors + semantic;

        write(`Errors:${totals}\n`);
        setRedTextColor();
        write(`└── Options: ${optionsErrors}\n`);
        write(`└── Global: ${globalErrors}\n`);
        write(`└── Syntactic: ${syntacticErrors}\n`);
        write(`└── Semantic: ${semantic}\n\n`);


        if (totals) {
            setRedTextColor();
            if (this.firstRun) {
                write(':< looks like you have some work to do...\n\n');
            } else {
                write(':< still messed up...\n\n');
            }

        } else {
            setGreenTextColor();
            if (this.firstRun) {
                write(':> very nice!\n\n');
            } else {
                write(':> still perfect!\n\n');
            }
        }

        setBlueTextColor();
        // tslint:disable-next-line:no-console
        console.timeEnd('Typechecking time');
        resetTextColor();
        write(`\n`);

        this.firstRun = false;



    }



    private executefirstRun() {
        const parseConfigHost: any = {
            fileExists: ts.sys.fileExists,
            readDirectory: ts.sys.readDirectory,
            readFile: ts.sys.readFile,
            useCaseSensitiveFileNames: true
        };
        const parsed = ts.parseJsonConfigFileContent(this.tsConfig, parseConfigHost, '.', null, 'tsconfig.json');
        this.program = ts.createProgram(parsed.fileNames, parsed.options);
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



export const TypeCheckPlugin = (options: any) => {
    return new TypeCheckPluginClass(options);
};
