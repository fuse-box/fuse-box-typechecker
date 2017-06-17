import { OptionsInterface } from './interfaces';
export declare class TypeHelperClass {
    private options;
    private worker;
    private checker;
    constructor(options: OptionsInterface);
    runAsync(): void;
    runSync(): void;
    private configureWorker(options);
    private runWorker();
    private createThread();
}
export declare const TypeHelper: (options: any) => TypeHelperClass;
