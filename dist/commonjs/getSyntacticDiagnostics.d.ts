import * as ts from 'typescript';
import { ITypeCheckerOptions } from './interfaces';
export declare function getSyntacticDiagnostics(options: ITypeCheckerOptions, program: ts.EmitAndSemanticDiagnosticsBuilderProgram): ts.Diagnostic[];
