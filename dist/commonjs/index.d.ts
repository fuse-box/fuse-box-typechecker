import { ITypeCheckerOptions, IResults } from './interfaces';
export declare class TypeHelperClass {
    private options;
    private worker;
    private checker;
    private monitor;
    private watchTimeout;
    private isWorkerInspectPreformed;
    private workerCallback?;
    constructor(options: ITypeCheckerOptions);
    runAsync(callback?: (errors: number) => void): void;
    runSync(): number;
    runSilentSync(): IResults;
    runSilentPromise(): Promise<IResults>;
    runPromise(): Promise<number>;
    runWatch(pathToWatch: string): void;
    killWorker(): void;
    startTreadAndWait(): void;
    useThreadAndTypecheck(): void;
    private inspectCodeWithWorker;
    private printResultWithWorker;
    private getResultObjFromWorker;
    private createThread;
    private writeText;
    private getPath;
}
export declare const TypeHelper: (options: ITypeCheckerOptions) => TypeHelperClass;
export declare const TypeChecker: (options: ITypeCheckerOptions) => TypeHelperClass;
