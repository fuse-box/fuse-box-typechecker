"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
function getPath(usePath, options) {
    return options.basePath
        ? path.resolve(options.basePath, usePath)
        : path.resolve(process.cwd(), usePath);
}
exports.getPath = getPath;
//# sourceMappingURL=getPath.js.map