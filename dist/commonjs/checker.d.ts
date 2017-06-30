export declare class Checker {
    private options;
    private tsConfig;
    private program;
    private elapsed;
    private diagnostics;
    private files;
    private lintResults;
    constructor();
    configure(options: any): void;
    typecheck(): any;
    private writeText(text);
}
