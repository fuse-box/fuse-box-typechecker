import { IInternalTypeCheckerOptions, IResults } from './interfaces';
export declare class Checker {
    private options;
    private program;
    private elapsedInspectionTime;
    private tsDiagnostics;
    private lintFileResult;
    lastResults: any;
    constructor();
    inspectCode(options: IInternalTypeCheckerOptions): void;
    getResultObj(): IResults;
    printResult(isWorker?: boolean): number;
    private writeText;
    private processLintFiles;
    private processTsDiagnostics;
    private getOptionsDiagnostics;
    private getGlobalDiagnostics;
    private getSyntacticDiagnostics;
    private getSemanticDiagnostics;
}
