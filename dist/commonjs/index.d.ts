import { ITypeCheckerOptions } from './interfaces';
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
    runPromise(): Promise<number>;
    runWatch(pathToWatch: string): void;
    killWorker(): void;
    private inspectCodeWithWorker(options);
    private printResultWithWorker();
    private createThread();
    private writeText(text);
    private getPath(usePath);
}
export declare const TypeHelper: (options: ITypeCheckerOptions) => TypeHelperClass;
