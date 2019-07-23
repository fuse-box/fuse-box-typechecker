import * as ts from 'typescript';
import { ITypeCheckerOptions } from './interfaces';
export declare function getOptionsDiagnostics(options: ITypeCheckerOptions, program: ts.EmitAndSemanticDiagnosticsBuilderProgram): ts.Diagnostic[];
