
export interface Lintoptions {
    fix?: boolean;
    formatter?: string;
    formattersDirectory?: string;
    rulesDirectory?: string;
}


export interface  OptionsInterface  {
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
    lintoptions?: Lintoptions;
}

export interface MsgInterface {
    type: string;
    options?: OptionsInterface;
}
