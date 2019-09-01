import { END_LINE, ITypeCheckerOptions, ITSError, IResults } from './interfaces';
import * as ts from 'typescript';

export function processTsDiagnostics(_options: ITypeCheckerOptions, errors: IResults): ITSError[] {
    return errors.globalErrors
        .concat(errors.semanticErrors)
        .concat(errors.syntacticErrors)
        .concat(errors.optionsErrors)
        .filter((diag: any) => diag.file)
        .map((diag: any) => {
            // set color from options
            const { line, character } = diag.file.getLineAndCharacterOfPosition(diag.start);
            return {
                fileName: diag.file.fileName,
                line: line + 1, // `(${line + 1},${character + 1})`,
                message: ts.flattenDiagnosticMessageText(diag.messageText, END_LINE),
                char: character + 1,
                color: 'red',
                category: `${ts.DiagnosticCategory[diag.category]}:`,
                code: `TS${diag.code}`
            };
        });
}
