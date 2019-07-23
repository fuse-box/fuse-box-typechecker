import * as ts from 'typescript';
import * as TSLintTypes from 'tslint';
export interface ITypeCheckerOptions {
    basePath: string;
    tsConfig: string;
    tsConfigOverride?: Object;
    throwOnSyntactic?: boolean;
    throwOnSemantic?: boolean;
    throwOnTsLint?: boolean;
    throwOnGlobal?: boolean;
    throwOnOptions?: boolean;
    yellowOnLint?: boolean;
    yellowOnOptions?: boolean;
    yellowOnGlobal?: boolean;
    yellowOnSemantic?: boolean;
    yellowOnSyntactic?: boolean;
    tsLint?: string;
    name?: string;
    lintoptions?: ILintOptions;
    shortenFilenames?: boolean;
    emit?: boolean;
    clearOnEmit?: boolean;
    skipTsErrors?: SkipError;
    debug_projectReferences?: boolean;
    debug_parsedFileNames?: boolean;
    debug_parsedOptions?: boolean;
    debug_tsConfigJsonContent?: boolean;
    tsConfigJsonContent: any;
}
export interface ILintOptions {
    fix?: boolean;
    formatter?: string;
    formattersDirectory?: string | null;
    rulesDirectory?: string | null;
}
export declare type TotalErrorsFound = number;
export declare type SkipError = number[];
export declare type TypeCheckError = ITSLintError | ITSError;
export declare enum WorkerCommand {
    inspectCode = 0,
    printResult = 1,
    inspectCodeAndPrint = 2,
    watch = 3
}
export interface IWorkerOptions {
    options: ITypeCheckerOptions;
    watchSrc: string;
    type: WorkerCommand;
}
export declare enum TypecheckerRunType {
    sync,
    async,
    watch,
    promiseAsync
}
export interface ITSLintError {
    fileName: string;
    line: number;
    char: number;
    failure: string;
    color: string;
    ruleSeverity: string;
    ruleName: string;
}
export interface ITSError {
    fileName: string;
    line: number;
    char: number;
    message: string;
    color: string;
    category: string;
    code: string;
}
export interface IResults {
    oldProgram: ts.EmitAndSemanticDiagnosticsBuilderProgram;
    lintFileResult: TSLintTypes.LintResult[];
    optionsErrors: ts.Diagnostic[];
    globalErrors: ts.Diagnostic[];
    syntacticErrors: ts.Diagnostic[];
    semanticErrors: ts.Diagnostic[];
    elapsedInspectionTime: number;
}
export declare const END_LINE = "\n";
