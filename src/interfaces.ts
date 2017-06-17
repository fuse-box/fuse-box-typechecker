
export interface OptionsInterface {
    quit?: boolean;
    tsConfig: string;
    throwOnSyntactic?: boolean;
    throwOnSemantic?: boolean;
    throwOnGlobal?: boolean;
    throwOnOptions?: boolean;
    tsConfigObj: any;
    name: string;
}

export interface MsgInterface {
    type: string;
    options?: OptionsInterface;
}
