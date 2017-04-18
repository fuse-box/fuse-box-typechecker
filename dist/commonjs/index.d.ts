export declare class TypeCheckPluginClass {
    options: any;
    private firstRun;
    private slave;
    constructor(options: any);
    init(context: any): void;
    bundleEnd(context: any): void;
}
export declare const TypeCheckPlugin: (options: any) => TypeCheckPluginClass;
