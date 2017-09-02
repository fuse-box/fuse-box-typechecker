
// options they can use to create the typechecker
export interface ITypeCheckerOptions {
    // base path
    basePath: string;

    // path to tsconfig file (from basepath)
    tsConfig: string;

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
}

// lint options,this is the same as tsLint uses all paths will be from basepath
export interface ILintOptions {
    fix?: boolean;
    formatter?: string;
    formattersDirectory?: string | null;
    rulesDirectory?: string | null;
}

// extended internal options, needed for some interal usage
export interface IInternalTypeCheckerOptions extends ITypeCheckerOptions {
    type: TypecheckerRunType;
    tsConfigJsonContent?: any;
    quit?: boolean;
}

// params used when calling worker to tell it what to do
export interface IWorkerOptions {
    type: WorkerCommand;
    options?: IInternalTypeCheckerOptions;
}

// run options for worker
export enum WorkerCommand {
    inspectCode,
    printResult,
    pushResult
}



// checkers run types (when generating cmd print)
export enum TypecheckerRunType {
    sync = 'syns' as any,
    async = 'async'  as any,
    watch = 'watch'  as any,
    promiseSync = 'promisesync'  as any
}

export const END_LINE = '\n';
