import { OptionsInterface } from './interfaces';
export declare class TypeHelperClass {
    private options;
    private worker;
    private checker;
    private monitor;
    constructor(options: OptionsInterface);
    runAsync(): void;
    runSync(): number;
    runWatch(pathToWatch: string): void;
    killWorker(): void;
    private configureWorker(options);
    private runWorker();
    private createThread();
    private writeText(text);
}
export declare const TypeHelper: (options: any) => TypeHelperClass;
