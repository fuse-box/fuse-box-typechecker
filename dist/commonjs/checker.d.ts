import { IInternalTypeCheckerOptions } from './interfaces';
export declare class Checker {
    private options;
    private program;
    private elapsedInspectionTime;
    private tsDiagnostics;
    private lintFileResult;
    constructor();
    inspectCode(options: IInternalTypeCheckerOptions): void;
    printResult(isWorker?: boolean): number;
    private writeText;
    private processLintFiles;
    private processTsDiagnostics;
}
