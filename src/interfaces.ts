// options they can use to create the typechecker
import * as ts from 'typescript';

export interface ITypeCheckerOptions {
    // base path
    basePath?: string;

    // path to tsconfig file (from basepath)
    tsConfig?: string;

    // path to tsconfig file (from basepath)
    tsConfigOverride?: object;

    throwOnSyntactic?: boolean;
    throwOnSemantic?: boolean;
    throwOnGlobal?: boolean;
    throwOnOptions?: boolean;

    // name that will be displayed on cmd echo
    name?: string;

    // use shortened filenames in order to make output less cluttered
    shortenFilenames?: boolean; // default true

    // skip ts errors
    skipTsErrors?: SkipError;

    // plugin options
    printFirstRun?: boolean; // default true when used as plugin

    // print settings
    print_summary?: boolean; //default false
    print_runtime?: boolean; //default false

    // internals
    tsConfigJsonContent?: any;
    isPlugin?: boolean;
    basePathSetup?: string;
    homeDir?: string;
}

export type TotalErrorsFound = number;
export type SkipError = number[];
export type TypeCheckError = ITSError;
// extended internal options, needed for some internal usage

// run options for worker
export enum WorkerCommand {
    inspectCode,
    printResult,
    inspectCodeAndPrint,
    watch,
    printSettings
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

export const END_LINE = '\n';
