import { ITypeCheckerOptions } from './interfaces';
import * as ts from 'typescript';
import * as TSLintTypes from 'tslint';
export declare function getTsLintDiagnostics(options: ITypeCheckerOptions, program: ts.EmitAndSemanticDiagnosticsBuilderProgram): TSLintTypes.LintResult[];
