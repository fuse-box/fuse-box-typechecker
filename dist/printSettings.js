"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getPath_1 = require("./getPath");
var logger_1 = require("./logger");
function printSettings(options) {
    logger_1.Logger.info("Typechecker settings - name:", logger_1.Style.grey("" + options.name));
    logger_1.Logger.info("Typechecker settings - basepath:", logger_1.Style.grey("" + options.basePath));
    if (options.tsConfig) {
        var tsconf = getPath_1.getPath(options.tsConfig, options);
        logger_1.Logger.info("Typechecker settings - tsconfig:", logger_1.Style.grey("" + tsconf));
    }
    else {
        logger_1.Logger.info("Typechecker settings - tsconfig:", logger_1.Style.grey("undefined, using ts defaults/override if defined"));
    }
}
exports.printSettings = printSettings;
//# sourceMappingURL=printSettings.js.map