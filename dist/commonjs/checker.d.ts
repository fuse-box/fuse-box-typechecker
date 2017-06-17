export declare class Checker {
    private options;
    private tsConfig;
    private program;
    private elapsed;
    private diagnostics;
    constructor();
    configure(options: any): void;
    typecheck(): void;
    private writeText(text);
}
