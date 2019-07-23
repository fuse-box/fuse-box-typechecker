import * as ts from 'typescript';
import chalk from 'chalk';
import { END_LINE, ITypeCheckerOptions} from './interfaces';
import * as path from 'path';
import * as fs from 'fs';
import {print} from './printResult';


export function emit(options: ITypeCheckerOptions, program: ts.EmitAndSemanticDiagnosticsBuilderProgram) {
    if (options.emit) {
        print(chalk.grey(`Getting ready to emit files${END_LINE}`));
        try {
            if (options.clearOnEmit) {
                let outputFolder: any = program.getCompilerOptions().outDir;
                let deleteFolder = function(folder: string) {
                    folder = path.join(folder);
                    if (fs.existsSync(folder)) {
                        fs.readdirSync(folder).forEach(function(file: string) {
                            let curPath = folder + '/' + file;
                            if (fs.lstatSync(curPath).isDirectory()) {
                                // recurse
                                deleteFolder(curPath);
                            } else {
                                // delete file
                                fs.unlinkSync(curPath);
                            }
                        });
                        fs.rmdirSync(folder);
                    }
                };
                if (!outputFolder) {
                    console.warn('output folder missing');
                } else {
                    print(chalk.grey(`clearing output folder${END_LINE}`));
                    deleteFolder(outputFolder);
                    print(chalk.grey(`Output folder cleared${END_LINE}`));
                    program.emit();
                    print(chalk.grey(`Files emitted${END_LINE}`));
                }
            } else {
                program.emit();
                print(chalk.grey(`Files emitted${END_LINE}`));
            }
        } catch (error) {
            print(chalk.red(`emitting files failed${END_LINE}`));
        }
    } else {
        print(chalk.grey(`Skipping emit file${END_LINE}`));
    }
}
