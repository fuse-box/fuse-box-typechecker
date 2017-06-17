export interface OptionsInterface {
    quit?: boolean;
    tsConfig: string;
    throwOnSyntactic?: boolean;
    throwOnSemantic?: boolean;
    throwOnGlobal?: boolean;
    throwOnOptions?: boolean;
    tsConfigObj: any;
}
export interface MsgInterface {
    type: string;
    options?: OptionsInterface;
}
