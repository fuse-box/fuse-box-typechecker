"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var printResult_1 = require("./printResult");
var getPath_1 = require("./getPath");
function printSettings(options) {
    printResult_1.print(chalk_1.default.white('\n' + " Typechecker name: " + chalk_1.default.grey("" + options.name + '\n')));
    printResult_1.print(chalk_1.default.white(" Typechecker basepath: " + chalk_1.default.grey("" + options.basePath + '\n')));
    if (options.tsConfig) {
        var tsconf = getPath_1.getPath(options.tsConfig, options);
        printResult_1.print(chalk_1.default.white(" Typechecker tsconfig: " + chalk_1.default.grey("" + tsconf + '\n')));
    }
    else {
        printResult_1.print(chalk_1.default.white(" Typechecker tsconfig: " + chalk_1.default.grey("undefined, using ts defaults" + '\n')));
    }
}
exports.printSettings = printSettings;
//# sourceMappingURL=printSettings.js.map