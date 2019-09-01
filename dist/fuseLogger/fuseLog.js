"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colors_1 = require("./colors");
function parseArguments(args) {
    var group;
    var message;
    var vars;
    if (args.length === 1)
        message = args[0];
    if (args.length === 2) {
        if (typeof args[1] === 'object') {
            message = args[0];
            vars = args[1];
        }
        if (typeof args[1] === 'string') {
            group = args[0];
            message = args[1];
        }
    }
    if (args.length === 3) {
        group = args[0];
        message = args[1];
        vars = args[2];
    }
    return { group: group, message: message, vars: vars };
}
var FuseLog = (function () {
    function FuseLog() {
        this.indent = '  ';
    }
    FuseLog.prototype.log = function (_type, result) {
        console.log(result);
    };
    FuseLog.prototype.getString = function (message, vars) {
        return colors_1.codeLog(message, vars);
    };
    FuseLog.prototype.echo = function (message, vars) {
        this.log('echo', this.getString(message, vars));
    };
    FuseLog.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = parseArguments(args), group = _a.group, message = _a.message, vars = _a.vars;
        var str = this.indent;
        if (group) {
            str += "<bold><cyan>" + group + "</cyan></bold> ";
        }
        str += "" + message;
        this.log('info', colors_1.codeLog(str, vars));
    };
    FuseLog.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = parseArguments(args), group = _a.group, message = _a.message, vars = _a.vars;
        var str = this.indent;
        if (group) {
            str += "<bold>@warning <yellow>" + group + "</yellow></bold> ";
            str += "<yellow>" + message + "</yellow>";
        }
        else {
            str += "<bold>@warning <yellow>" + message + "</yellow></bold> ";
        }
        this.log('warn', colors_1.codeLog(str, vars));
    };
    FuseLog.prototype.success = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = parseArguments(args), group = _a.group, message = _a.message, vars = _a.vars;
        var str = this.indent;
        if (group) {
            str += "<bold>@success <green>" + group + "</green></bold> ";
            str += "<green>" + message + "</green>";
        }
        else {
            str += "<bold>@success <green>" + message + "</green></bold> ";
        }
        this.log('success', colors_1.codeLog(str, vars));
    };
    FuseLog.prototype.meta = function (group, message, vars) {
        this.log('meta', colors_1.codeLog(this.indent + "<bold><dim><yellow>" + group + "</yellow> <cyan>" + message + "</cyan></dim></bold>", vars));
    };
    FuseLog.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = parseArguments(args), group = _a.group, message = _a.message, vars = _a.vars;
        var str = this.indent;
        if (group) {
            str += "<bold>@error <white><bgRed>" + group + "</bgRed></white></bold> ";
            str += "<red><bold>" + message + "</bold></red>";
        }
        else {
            str += "<bold>@error <red>" + message + "</red></bold> ";
        }
        this.log('error', colors_1.codeLog(str, vars));
    };
    return FuseLog;
}());
exports.FuseLog = FuseLog;
function createLog(_CustomLogger) {
    return new FuseLog();
}
exports.createLog = createLog;
//# sourceMappingURL=fuseLog.js.map