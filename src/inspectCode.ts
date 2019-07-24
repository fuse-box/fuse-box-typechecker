import * as ts from 'typescript';
import { IResults, ITypeCheckerOptions } from './interfaces';
import { getOptionsDiagnostics } from './getOptionsDiagnostics';
import { getGlobalDiagnostics } from './getGlobalDiagnostics';
import { getSyntacticDiagnostics } from './getSyntacticDiagnostics';
import { getSemanticDiagnostics } from './getSemanticDiagnostics';


export function inspectCode(
    options: ITypeCheckerOptions,
    oldProgram?: ts.EmitAndSemanticDiagnosticsBuilderProgram
): IResults {
    const parseConfigHost: any = {
        fileExists: ts.sys.fileExists,
        readDirectory: ts.sys.readDirectory,
        readFile: ts.sys.readFile,
        useCaseSensitiveFileNames: true
    };

    let inspectionTimeStart = new Date().getTime();

    const parsed = ts.parseJsonConfigFileContent(
        options.tsConfigJsonContent,
        parseConfigHost,
        options.basePath || '.',
        undefined
    );

    const host = (<any>ts).createIncrementalCompilerHost(parsed.options);

    const program = ts.createEmitAndSemanticDiagnosticsBuilderProgram(
        parsed.fileNames,
        parsed.options,
        host,
        oldProgram,
        undefined,
        parsed.projectReferences
    );

    return {
        oldProgram: program,
        optionsErrors: getOptionsDiagnostics(options, program),
        globalErrors: getGlobalDiagnostics(options, program),
        syntacticErrors: getSyntacticDiagnostics(options, program),
        semanticErrors: getSemanticDiagnostics(options, program),
        elapsedInspectionTime: new Date().getTime() - inspectionTimeStart
    };
}
