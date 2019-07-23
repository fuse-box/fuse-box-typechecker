import * as TSLintTypes from 'tslint';
import { ITSLintError, ITypeCheckerOptions } from './interfaces';
export declare function processLintFiles(options: ITypeCheckerOptions, lintResults: TSLintTypes.LintResult[]): ITSLintError[];
