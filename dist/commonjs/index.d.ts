export declare class TypeCheckPluginClass {
    options: any;
    private firstRun;
    private slave;
    private countBundles;
    private countBundleEnd;
    constructor(options: any);
    init(context: any): void;
    bundleEnd(): void;
}
export declare const TypeCheckPlugin: (options: any) => TypeCheckPluginClass;
