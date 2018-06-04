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
}
export interface ILintOptions {
    fix?: boolean;
    formatter?: string;
    formattersDirectory?: string | null;
    rulesDirectory?: string | null;
}
export interface IInternalTypeCheckerOptions extends ITypeCheckerOptions {
    type: TypecheckerRunType;
    tsConfigJsonContent?: any;
    quit?: boolean;
}
export interface IWorkerOptions {
    type: WorkerCommand;
    options?: IInternalTypeCheckerOptions;
    hasCallback?: boolean;
}
export declare enum WorkerCommand {
    inspectCode = 0,
    printResult = 1,
    getResultObj = 2
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
    lintErrors: ITSLintError[];
    optionsErrors: ITSError[];
    globalErrors: ITSError[];
    syntacticErrors: ITSError[];
    semanticErrors: ITSError[];
}
export declare const END_LINE = "\n";
