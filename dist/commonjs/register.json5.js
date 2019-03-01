"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var JSON5 = require("json5");
require.extensions['.json'] = function (module, filename) {
    var content = fs_1.readFileSync(filename, 'utf8');
    try {
        module.exports = JSON5.parse(content);
    }
    catch (err) {
        err.message = filename + ': ' + err.message;
        throw err;
    }
};
//# sourceMappingURL=register.json5.js.map