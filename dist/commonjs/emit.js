"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var interfaces_1 = require("./interfaces");
var path = require("path");
var fs = require("fs");
var printResult_1 = require("./printResult");
function emit(options, program) {
    if (options.emit) {
        printResult_1.print(chalk_1.default.grey("Getting ready to emit files" + interfaces_1.END_LINE));
        try {
            if (options.clearOnEmit) {
                var outputFolder = program.getCompilerOptions().outDir;
                var deleteFolder_1 = function (folder) {
                    folder = path.join(folder);
                    if (fs.existsSync(folder)) {
                        fs.readdirSync(folder).forEach(function (file) {
                            var curPath = folder + '/' + file;
                            if (fs.lstatSync(curPath).isDirectory()) {
                                deleteFolder_1(curPath);
                            }
                            else {
                                fs.unlinkSync(curPath);
                            }
                        });
                        fs.rmdirSync(folder);
                    }
                };
                if (!outputFolder) {
                    console.warn('output folder missing');
                }
                else {
                    printResult_1.print(chalk_1.default.grey("clearing output folder" + interfaces_1.END_LINE));
                    deleteFolder_1(outputFolder);
                    printResult_1.print(chalk_1.default.grey("Output folder cleared" + interfaces_1.END_LINE));
                    program.emit();
                    printResult_1.print(chalk_1.default.grey("Files emitted" + interfaces_1.END_LINE));
                }
            }
            else {
                program.emit();
                printResult_1.print(chalk_1.default.grey("Files emitted" + interfaces_1.END_LINE));
            }
        }
        catch (error) {
            printResult_1.print(chalk_1.default.red("emitting files failed" + interfaces_1.END_LINE));
        }
    }
    else {
        printResult_1.print(chalk_1.default.grey("Skipping emit file" + interfaces_1.END_LINE));
    }
}
exports.emit = emit;
//# sourceMappingURL=emit.js.map