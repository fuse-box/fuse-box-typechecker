export interface TypeCheckerOptions {
    basePath: string;
    tsConfig: string;
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
    lintoptions?: LintOptions;
}
export interface LintOptions {
    fix?: boolean;
    formatter?: string;
    formattersDirectory?: string;
    rulesDirectory?: string;
}
export interface InternalTypeCheckerOptions extends TypeCheckerOptions {
    type?: TypecheckerRunType;
    tsConfigJsonContent?: any;
    quit?: boolean;
}
export interface IWorkerOptions {
    type: WorkerCommand;
    options?: InternalTypeCheckerOptions;
}
export declare enum WorkerCommand {
    inspectCode = 0,
    printResult = 1,
}
export declare enum TypecheckerRunType {
    sync = "sync",
    async = "async",
    watch = "watch",
    promiseSync = "promisesync",
}
