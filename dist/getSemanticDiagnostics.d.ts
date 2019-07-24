import * as ts from 'typescript';
import { ITypeCheckerOptions } from './interfaces';
export declare function getSemanticDiagnostics(options: ITypeCheckerOptions, program: ts.EmitAndSemanticDiagnosticsBuilderProgram): ts.Diagnostic[];
