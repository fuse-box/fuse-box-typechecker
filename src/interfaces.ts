
// options they can use to create the typechecker
export interface ITypeCheckerOptions {
    // base path
    basePath: string;

    // path to tsconfig file (from basepath)
    tsConfig: string;

    // path to tsconfig file (from basepath)
    tsConfigOverride?: Object;

    // throw options
    throwOnSyntactic?: boolean;
    throwOnSemantic?: boolean;
    throwOnTsLint?: boolean;
    throwOnGlobal?: boolean;
    throwOnOptions?: boolean;

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
}

// lint options,this is the same as tsLint uses all paths will be from basepath
export interface ILintOptions {
    fix?: boolean;
    formatter?: string;
    formattersDirectory?: string | null;
    rulesDirectory?: string | null;
}

// extended internal options, needed for some internal usage
export interface IInternalTypeCheckerOptions extends ITypeCheckerOptions {
    type: TypecheckerRunType;
    tsConfigJsonContent?: any;
    quit?: boolean;
}

// params used when calling worker to tell it what to do
export interface IWorkerOptions {
    type: WorkerCommand;
    options?: IInternalTypeCheckerOptions;
    hasCallback?: boolean;
}

// run options for worker
export enum WorkerCommand {
    inspectCode,
    printResult,
    getResultObj
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
    lintErrors: ITSLintError[];
    optionsErrors: ITSError[];
    globalErrors: ITSError[];
    syntacticErrors: ITSError[];
    semanticErrors: ITSError[];
}

export const END_LINE = '\n';
