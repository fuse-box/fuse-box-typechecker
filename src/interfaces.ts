
export interface LintOptions {
    fix?: boolean;
    formatter?: string;
    formattersDirectory?: string;
    rulesDirectory?: string;
}


export interface  TypeCheckerOptions  {
    quit?: boolean;
    tsConfig: string;
    throwOnSyntactic?: boolean;
    throwOnSemantic?: boolean;
    throwOnTsLint?:  boolean;
    throwOnGlobal?: boolean;
    throwOnOptions?: boolean;
    yellowOnLint?: boolean;
    yellowOnOptions?: boolean;
    yellowOnGlobal?: boolean;
    yellowOnSemantic?: boolean;
    yellowOnSyntactic?: boolean;
    tsLint?: string;
    tsConfigObj?: any;
    basePath: string;
    name?: string;
    type?: string;
    finished: boolean;
    lintOptions?: LintOptions;
}

export interface ICommand {
    type: CommandType;
    options?: TypeCheckerOptions;
}

export enum CommandType {
    configure,
    run
}
