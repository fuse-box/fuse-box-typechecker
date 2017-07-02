
// options they can use to create the typechecker
export interface TypeCheckerOptions {
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
    lintOptions?: LintOptions;
}

// lint options,this is the same as tsLint uses all paths will be from basepath
export interface LintOptions {
    fix?: boolean;
    formatter?: string;
    formattersDirectory?: string;
    rulesDirectory?: string;
}

// extended internal options, needed for some interal usage
export interface InternalTypeCheckerOptions extends TypeCheckerOptions {
    type?: TypecheckerRunType;
    tsConfigJsonContent?: any;
    quit?: boolean;
}

// params used when calling worker to tell it what to do
export interface IWorkerOptions {
    type: WorkerCommand;
    options?: InternalTypeCheckerOptions;
}

// run options for worker
export enum WorkerCommand {
    inspectCode,
    printResult
}

// checkers run types (when generating cmd print)
export enum TypecheckerRunType {
    sync,
    async,
    watch,
    promiseSync
}
