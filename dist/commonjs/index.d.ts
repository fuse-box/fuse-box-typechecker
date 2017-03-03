export declare class TypeCheckPluginClass {
    private options;
    private firstRun;
    private tsConfig;
    private program;
    constructor(options: any);
    init(context: any): void;
    bundleEnd(): void;
    private executefirstRun();
    private writeText(text);
    private resetTextColor();
    private setRedTextColor();
    private setBlueTextColor();
    private setGreenTextColor();
}
export declare const TypeCheckPlugin: (options: any) => TypeCheckPluginClass;
