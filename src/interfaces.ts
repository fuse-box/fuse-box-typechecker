// options they can use to create the typechecker
import * as ts from 'typescript';


export interface ITypeCheckerOptions {
    // base path
    basePath: string;

    // path to tsconfig file (from basepath)
    tsConfig: string;

    // path to tsconfig file (from basepath)
    tsConfigOverride?: Object;

    // throw options
 /*    throwOnSyntactic?: boolean;
    throwOnSemantic?: boolean;
    throwOnGlobal?: boolean;
    throwOnOptions?: boolean;
 */
    // color options
    yellowOnOptions?: boolean;
    yellowOnGlobal?: boolean;
    yellowOnSemantic?: boolean;
    yellowOnSyntactic?: boolean;

    // name that will be displayed on cmd echo
    name?: string;

    // use shortened filenames in order to make output less cluttered
    shortenFilenames?: boolean;


    // skip ts errors
    skipTsErrors?: SkipError;

    // internals
    tsConfigJsonContent: any;
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
