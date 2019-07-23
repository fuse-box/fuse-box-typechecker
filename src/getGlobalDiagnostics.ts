import * as ts from 'typescript';
import { ITypeCheckerOptions } from './interfaces';

declare type tsError = ts.Diagnostic & { code: string };

export function getGlobalDiagnostics(
    options: ITypeCheckerOptions,
    program: ts.EmitAndSemanticDiagnosticsBuilderProgram
) {
    return program
        .getGlobalDiagnostics()
        .filter(errors => {
            if (
                options.skipTsErrors &&
                options.skipTsErrors.indexOf((<tsError>errors).code) !== -1
            ) {
                return false;
            } else {
                return true;
            }
        })
        .map(obj => {
            (<any>obj)._type = 'global';
            return obj;
        });
}
