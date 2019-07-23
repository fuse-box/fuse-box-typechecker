import { ITypeCheckerOptions, IResults } from './interfaces';
import * as ts from 'typescript';
import './register.json5';
export declare class TypeHelperClass {
    private options;
    private worker;
    constructor(options: ITypeCheckerOptions);
    printSettings(options: ITypeCheckerOptions): void;
    inspectAndPrint_local(): number;
    inspect_local(oldProgram: ts.EmitAndSemanticDiagnosticsBuilderProgram): IResults;
    print_local(errors: IResults): number;
    startWatch(pathToWatch: string): void;
    kill(): void;
    inspect_worker(): void;
    print_worker(): void;
    inspectAndPrint_worker(): void;
    private startWorker;
}
export declare const TypeChecker: (options: ITypeCheckerOptions) => TypeHelperClass;
