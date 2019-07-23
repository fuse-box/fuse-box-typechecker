import * as TSLintTypes from 'tslint'; // Just use types
import { ITSLintError, ITypeCheckerOptions } from './interfaces';


export function processLintFiles(
    options: ITypeCheckerOptions,
    lintResults: TSLintTypes.LintResult[]
): ITSLintError[] {
    return lintResults
        .filter((fileResult: TSLintTypes.LintResult) => fileResult.failures)
        .map((fileResult: TSLintTypes.LintResult) =>
            fileResult.failures.map((failure: any) => ({
                fileName: failure.fileName,
                line: failure.startPosition.lineAndCharacter.line,
                char: failure.startPosition.lineAndCharacter.character,
                ruleSeverity:
                    failure.ruleSeverity.charAt(0).toUpperCase() + failure.ruleSeverity.slice(1),
                ruleName: failure.ruleName,
                color: options.yellowOnLint ? 'yellow' : 'red',
                failure: failure.failure
            }))
        )
        .reduce((acc, curr) => acc.concat(curr), []);
}
