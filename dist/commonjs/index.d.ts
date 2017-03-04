export declare class TypeCheckPluginClass {
    private options;
    private firstRun;
    private slave;
    constructor(options: any);
    init(context: any): void;
    bundleEnd(): void;
}
export declare const TypeCheckPlugin: (options: any) => TypeCheckPluginClass;
