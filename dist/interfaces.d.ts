import * as ts from 'typescript';
export interface ITypeCheckerOptions {
    basePath?: string;
    tsConfig?: string;
    tsConfigOverride?: Object;
    throwOnSyntactic?: boolean;
    throwOnSemantic?: boolean;
    throwOnGlobal?: boolean;
    throwOnOptions?: boolean;
    yellowOnOptions?: boolean;
    yellowOnGlobal?: boolean;
    yellowOnSemantic?: boolean;
    yellowOnSyntactic?: boolean;
    name?: string;
    shortenFilenames?: boolean;
    skipTsErrors?: SkipError;
    printFirstRun: boolean;
    print_summary?: boolean;
    print_runtime?: boolean;
    tsConfigJsonContent: any;
    isPlugin: boolean;
}
export declare type TotalErrorsFound = number;
export declare type SkipError = number[];
export declare type TypeCheckError = ITSError;
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
    optionsErrors: ts.Diagnostic[];
    globalErrors: ts.Diagnostic[];
    syntacticErrors: ts.Diagnostic[];
    semanticErrors: ts.Diagnostic[];
    elapsedInspectionTime: number;
}
export declare const END_LINE = "\n";
