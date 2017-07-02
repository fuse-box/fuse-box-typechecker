import { InternalTypeCheckerOptions } from './interfaces';
export declare class Checker {
    private options;
    private program;
    private elapsedInspectionTime;
    private tsDiagnostics;
    private lintFileResult;
    private END_LINE;
    constructor();
    inspectCode(options: InternalTypeCheckerOptions): void;
    printResult(isWorker?: boolean): number;
    private writeText(text);
    private processLintFiles();
    private processTsDiagnostics();
}
