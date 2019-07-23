import { readFileSync } from 'fs';
import * as JSON5 from 'json5';

// JSON5 has a register for the .json5 extension
// however, it does not overide .json.
// This will just override our require for *.json files and use
// JSON5 to parse.
require.extensions['.json'] = function(module, filename) {
    const content = readFileSync(filename, 'utf8');
    try {
        module.exports = JSON5.parse(content);
    } catch (err) {
        err.message = filename + ': ' + err.message;
        throw err;
    }
};
