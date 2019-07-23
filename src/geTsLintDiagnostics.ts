import { ITypeCheckerOptions } from './interfaces';
import chalk from 'chalk';
import * as path from 'path';
import * as ts from 'typescript';
import * as TSLintTypes from 'tslint'; // Just use types
import { print } from './printResult';
let tslint: typeof TSLintTypes | null;
try {
    tslint = require('tslint');
} catch {
    tslint = null;
}

export function getTsLintDiagnostics(
    options: ITypeCheckerOptions,
    program: ts.EmitAndSemanticDiagnosticsBuilderProgram
) {
    if (options.tsLint) {
        if (!tslint) {
            print(
                chalk.red(
                    `\nMake sure to have ${chalk.bgWhiteBright(
                        'tslint'
                    )} installed if you use the "tsLint" option:\n`
                ) + chalk.redBright('npm install --save-dev tslint\n\n')
            );
            throw new Error('tslint not installed');
        }

        let fullPath = path.resolve(options.basePath, options.tsLint);
        let files = tslint.Linter.getFileNames(program.getProgram());
        const tsLintConfiguration = tslint.Configuration.findConfiguration(
            fullPath,
            options.basePath
        ).results;

        // lint the files
        return files
            .map(file => {
                let fileContents: any = program.getSourceFile(file);
                fileContents = fileContents ? fileContents.getFullText() : '';

                const linter = new tslint!.Linter(
                    <TSLintTypes.ILinterOptions>options.lintoptions,
                    program.getProgram()
                );
                linter.lint(file, fileContents, tsLintConfiguration);
                return linter.getResult();
            })
            .filter(result => {
                return result.errorCount ? true : false;
            });
    } else {
        return [];
    }
}
