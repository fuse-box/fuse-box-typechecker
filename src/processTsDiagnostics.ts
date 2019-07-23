import { END_LINE, ITypeCheckerOptions, ITSError, IResults } from './interfaces';
import * as ts from 'typescript';

export function processTsDiagnostics(options: ITypeCheckerOptions, errors: IResults): ITSError[] {
    return errors.globalErrors
        .concat(errors.semanticErrors)
        .concat(errors.syntacticErrors)
        .concat(errors.optionsErrors)
        .filter((diag: any) => diag.file)
        .map((diag: any) => {
            // set color from options
            let color: string;
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
            const { line, character } = diag.file.getLineAndCharacterOfPosition(diag.start);
            return {
                fileName: diag.file.fileName,
                line: line + 1, // `(${line + 1},${character + 1})`,
                message: ts.flattenDiagnosticMessageText(diag.messageText, END_LINE),
                char: character + 1,
                color: color,
                category: `${ts.DiagnosticCategory[diag.category]}:`,
                code: `TS${diag.code}`
            };
        });
}
