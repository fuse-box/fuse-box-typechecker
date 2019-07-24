import * as ts from 'typescript';
import { IResults, ITypeCheckerOptions } from './interfaces';
export declare function inspectCode(options: ITypeCheckerOptions, oldProgram?: ts.EmitAndSemanticDiagnosticsBuilderProgram): IResults;
