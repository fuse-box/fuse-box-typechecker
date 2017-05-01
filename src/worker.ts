import * as ts from 'typescript';

let myClass: TypeCheckPluginClass = null;

interface OptionsInterface {
    quit?: boolean;
    bundles: string[];
    throwOnSyntactic?: boolean;
    throwOnSemantic?: boolean;
    throwOnGlobal?: boolean;
    throwOnOptions?: boolean;
}


interface MsgInterface {
    type?: string;
    options?: OptionsInterface;
    data?: any;
    bundle?: string;
}


class TypeCheckPluginClass {
    private tsConfig: any;
    private program: any;
    private elapsed: number;
    private diagnostics: any;


    constructor() {
        // nothing atm
    }



    public setTsConfig(tsConfig: any) {
        this.tsConfig = tsConfig;

        // parse it right away, no need to wait...
        const parseConfigHost: any = {
            fileExists: ts.sys.fileExists,
            readDirectory: ts.sys.readDirectory,
            readFile: ts.sys.readFile,
            useCaseSensitiveFileNames: true
        };

        // take the time and get program
        let start = new Date().getTime();
        const parsed = ts.parseJsonConfigFileContent(this.tsConfig, parseConfigHost, '.', null, 'tsconfig.json');
        this.program = ts.createProgram(parsed.fileNames, parsed.options, null, this.program);
        this.diagnostics = ts.getPreEmitDiagnostics(this.program);
        this.elapsed = new Date().getTime() - start;
    }



    public typecheck(options: OptionsInterface) {

        const write = this.writeText;
        const diagnostics = this.diagnostics;
        const program = this.program;


        const TEXT_WHITE = '\x1b[0m';
        const TEXT_RED = '\x1b[91m';
        const TEXT_UNDERLINE_START = '\x1B[4m';
        const TEXT_UNDERLINE_END = '\x1B[24m';
        const TEXT_BOLD_START = '\x1B[1m';
        const TEXT_BOLD_END = '\x1B[22m';
        const TEXT_INVERT_START = '\x1B[7m';
        const TEXT_INVERT_END = '\x1B[27m';
        const TEXT_ITALIC_START = '\x1b[90m';
        const TEXT_ITALIC_END = '\x1b[0m';
        const TEXT_END_LINE = '\n';


        write(`${TEXT_END_LINE}${TEXT_INVERT_START}${TEXT_BOLD_START}Typechecker plugin${TEXT_BOLD_END}${TEXT_INVERT_END}${TEXT_END_LINE}`);

        // loop diagnostics
        let messages = [];
        if (diagnostics.length > 0) {
            messages = diagnostics.map((diag: any) => {

                // get message type error, warn, info
                let message = `${TEXT_RED}└── `;

                // if file
                if (diag.file) {
                    const {
                        line,
                        character
                    } = diag.file.getLineAndCharacterOfPosition(diag.start);

                    message += `${diag.file.fileName}: (${line + 1}:${character + 1}):`;
                    message += TEXT_WHITE;
                    message += ts.DiagnosticCategory[diag.category];
                    message += ` TS${diag.code}:`;
                }

                // flatten error message
                message += ' ' + ts.flattenDiagnosticMessageText(diag.messageText, TEXT_END_LINE);

                // return message
                return message;
            });

            // write errors
            messages.unshift(`${TEXT_END_LINE}${TEXT_WHITE}${TEXT_UNDERLINE_START}File errors:${TEXT_UNDERLINE_END}`);
            write(messages.join('\n'));

        }


        write(TEXT_WHITE + TEXT_END_LINE + TEXT_END_LINE);

        let optionsErrors = program.getOptionsDiagnostics().length;
        let globalErrors = program.getGlobalDiagnostics().length;
        let syntacticErrors = program.getSyntacticDiagnostics().length;
        let semanticErrors = program.getSemanticDiagnostics().length;
        let totals = optionsErrors + globalErrors + syntacticErrors + semanticErrors;

        write(`${TEXT_UNDERLINE_START}Errors:${totals}${TEXT_UNDERLINE_END}${TEXT_END_LINE}`);
        if (totals) {

            write(`${optionsErrors ? TEXT_RED : TEXT_WHITE}└── Options: ${optionsErrors}${TEXT_END_LINE}`);
            write(`${globalErrors ? TEXT_RED : TEXT_WHITE}└── Global: ${globalErrors}${TEXT_END_LINE}`);
            write(`${syntacticErrors ? TEXT_RED : TEXT_WHITE}└── Syntactic: ${syntacticErrors}${TEXT_END_LINE}`);
            write(`${semanticErrors ? TEXT_RED : TEXT_WHITE}└── Semantic: ${semanticErrors}${TEXT_END_LINE}${TEXT_END_LINE}`);
        }
        write(TEXT_ITALIC_START);
        write(`${TEXT_WHITE}${TEXT_ITALIC_START}Typechecking time: ${this.elapsed}ms${TEXT_ITALIC_END}${TEXT_END_LINE}`);


        switch (true) {
            case options.throwOnGlobal && globalErrors > 0:
            case options.throwOnOptions && optionsErrors > 0:
            case options.throwOnSemantic && semanticErrors > 0:
            case options.throwOnSyntactic && syntacticErrors > 0:
                process.send('error');
                process.exit(0);
                break;
            case options.quit:
                write(`${TEXT_ITALIC_START}Quiting typechecker${TEXT_ITALIC_END}${TEXT_END_LINE}${TEXT_END_LINE}`);
                process.exit(0);
                break;
            default:
                write(`${TEXT_ITALIC_START}Keeping typechecker alive${TEXT_ITALIC_END}${TEXT_END_LINE}${TEXT_END_LINE}`);
        }
        write(TEXT_ITALIC_END);

    }


    private writeText(text: string) {
        ts.sys.write(text);
    }


}



myClass = new TypeCheckPluginClass();
process.on('message', function (msg: MsgInterface) {
    let type = msg.type;
    switch (type) {
        case 'tsconfig':
            myClass.setTsConfig(msg.data);
            break;
        case 'run':
            myClass.typecheck(msg.options);
            break;
    }
});
