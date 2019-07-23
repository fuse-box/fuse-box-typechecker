"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function processLintFiles(options, lintResults) {
    return lintResults
        .filter(function (fileResult) { return fileResult.failures; })
        .map(function (fileResult) {
        return fileResult.failures.map(function (failure) { return ({
            fileName: failure.fileName,
            line: failure.startPosition.lineAndCharacter.line,
            char: failure.startPosition.lineAndCharacter.character,
            ruleSeverity: failure.ruleSeverity.charAt(0).toUpperCase() + failure.ruleSeverity.slice(1),
            ruleName: failure.ruleName,
            color: options.yellowOnLint ? 'yellow' : 'red',
            failure: failure.failure
        }); });
    })
        .reduce(function (acc, curr) { return acc.concat(curr); }, []);
}
exports.processLintFiles = processLintFiles;
//# sourceMappingURL=processLintErrors.js.map