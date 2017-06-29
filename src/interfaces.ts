
export interface OptionsInterface {
    quit?: boolean;
    tsConfig: string;
    throwOnSyntactic?: boolean;
    throwOnSemantic?: boolean;
    throwOnGlobal?: boolean;
    throwOnOptions?: boolean;
    tsConfigObj: any;
    basePath: string;
    name?: string;
    type?: string;
    finished: boolean;
}

export interface MsgInterface {
    type: string;
    options?: OptionsInterface;
}
