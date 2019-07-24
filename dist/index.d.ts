import { ITypeCheckerOptions, IResults } from './interfaces';
import * as ts from 'typescript';
import './register.json5';
export declare class TypeHelperClass {
    private options;
    private worker;
    constructor(options: ITypeCheckerOptions);
    printSettings(): void;
    inspectAndPrint(): number;
    inspectOnly(oldProgram: ts.EmitAndSemanticDiagnosticsBuilderProgram): IResults;
    printOnly(errors: IResults): number;
    worker_watch(pathToWatch: string): void;
    worker_kill(): void;
    worker_inspect(): void;
    worker_PrintSettings(): void;
    worker_print(): void;
    worker_inspectAndPrint(): void;
    private startWorker;
}
export declare const TypeChecker: (options: ITypeCheckerOptions) => TypeHelperClass;
export declare function pluginTypeChecker(opts: any): (ctx: any) => void;
