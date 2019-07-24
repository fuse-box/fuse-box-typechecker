// options they can use to create the typechecker
import * as ts from 'typescript';
import * as TSLintTypes from 'tslint';

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
    throwOnTsLint?: boolean;
    throwOnGlobal?: boolean;
    throwOnOptions?: boolean;
 */
    // color options
    yellowOnLint?: boolean;
    yellowOnOptions?: boolean;
    yellowOnGlobal?: boolean;
    yellowOnSemantic?: boolean;
    yellowOnSyntactic?: boolean;

    // path to tslint json (from basepath)
    tsLint?: string;

    // name that will be displayed on cmd echo
    name?: string;

    // lint options that can be passed in
    // todo: rename to lintOptions, but thats a breaking change, so will do that later
    lintoptions?: ILintOptions;

    // use shortened filenames in order to make output less cluttered
    shortenFilenames?: boolean;

    // emit files according to tsconfig file
    emit?: boolean;

    // output folder on emit
    clearOnEmit?: boolean;

    // skip ts errors
    skipTsErrors?: SkipError;

    // debug helpers for when it fails
    // this will help users supply better issues
    /* debug_projectReferences?: boolean;
    debug_parsedFileNames?: boolean;
    debug_parsedOptions?: boolean;
    debug_tsConfigJsonContent?: boolean; */

    // internals
    tsConfigJsonContent: any;
}

// lint options,this is the same as tsLint uses all paths will be from basepath
export interface ILintOptions {
    fix?: boolean;
    formatter?: string;
    formattersDirectory?: string | null;
    rulesDirectory?: string | null;
}

export type TotalErrorsFound = number;
export type SkipError = number[];
export type TypeCheckError = ITSLintError | ITSError;
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

// checkers run types (when generating cmd print)
export enum TypecheckerRunType {
    sync = 'syns' as any,
    async = 'async' as any,
    watch = 'watch' as any,
    promiseAsync = 'promisesync' as any
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

export const END_LINE = '\n';
