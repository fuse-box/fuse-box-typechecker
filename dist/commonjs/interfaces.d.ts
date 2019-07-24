import * as ts from 'typescript';
import * as TSLintTypes from 'tslint';
export interface ITypeCheckerOptions {
    basePath: string;
    tsConfig: string;
    tsConfigOverride?: Object;
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
    watch = 3,
    printSettings = 4
}
export interface IWorkerOptions {
    options: ITypeCheckerOptions;
    pathToWatch: string;
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
