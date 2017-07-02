import { TypeCheckerOptions } from './interfaces';
export declare class TypeHelperClass {
    private options;
    private worker;
    private checker;
    private monitor;
    private watchTimeout;
    private isWorkerInspectPreformed;
    constructor(options: TypeCheckerOptions);
    runAsync(): void;
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
export declare const TypeHelper: (options: TypeCheckerOptions) => TypeHelperClass;
