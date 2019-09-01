"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var fuseLog_1 = require("./fuseLogger/fuseLog");
var _Logger = (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return class_1;
}(fuseLog_1.FuseLog));
var _logger = new _Logger();
var Style = (function () {
    function Style() {
    }
    Style.bold = function (text) {
        return "<bold>" + text + "</bold>";
    };
    Style.dim = function (text) {
        return "<dim>" + text + "</dim>";
    };
    Style.italic = function (text) {
        return "<italic>" + text + "</italic>";
    };
    Style.underline = function (text) {
        return "<underline>" + text + "</underline>";
    };
    Style.inverse = function (text) {
        return "<inverse>" + text + "</inverse>";
    };
    Style.hidden = function (text) {
        return "<hidden>" + text + "</hidden>";
    };
    Style.strikethrough = function (text) {
        return "<strikethrough>" + text + "</strikethrough>";
    };
    Style.grey = function (text) {
        return "<grey>" + text + "</grey>";
    };
    Style.gray = function (text) {
        return "<gray>" + text + "</gray>";
    };
    Style.white = function (text) {
        return "<white>" + text + "</strikethrowhiteugh>";
    };
    Style.cyan = function (text) {
        return "<cyan>" + text + "</cyan>";
    };
    Style.magenta = function (text) {
        return "<magenta>" + text + "</magenta>";
    };
    Style.blue = function (text) {
        return "<blue>" + text + "</blue>";
    };
    Style.yellow = function (text) {
        return "<yellow>" + text + "</yellow>";
    };
    Style.green = function (text) {
        return "<green>" + text + "</green>";
    };
    Style.red = function (text) {
        return "<red>" + text + "</red>";
    };
    Style.black = function (text) {
        return "<black>" + text + "</black>";
    };
    Style.bgBlack = function (text) {
        return "<bgBlack>" + text + "</bgBlack>";
    };
    Style.bgRed = function (text) {
        return "<bgRed>" + text + "</bgRed>";
    };
    Style.bgGreen = function (text) {
        return "<bgGreen>" + text + "</bgGreen>";
    };
    Style.bgYellow = function (text) {
        return "<bgYellow>" + text + "</bgYellow>";
    };
    Style.bgBlue = function (text) {
        return "<bgBlue>" + text + "</bgBlue>";
    };
    Style.bgMagenta = function (text) {
        return "<bgMagenta>" + text + "</bgMagenta>";
    };
    Style.bgCyan = function (text) {
        return "<bgCyan>" + text + "</bgCyan>";
    };
    Style.bgWhite = function (text) {
        return "<bgWhite>" + text + "</bgWhite>";
    };
    return Style;
}());
exports.Style = Style;
var Logger = (function () {
    function Logger() {
    }
    Logger.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        _logger.info.apply(_logger, args);
    };
    Logger.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        _logger.warn.apply(_logger, args);
    };
    Logger.success = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        _logger.success.apply(_logger, args);
    };
    Logger.meta = function (group, message, vars) {
        _logger.meta(group, message, vars);
    };
    Logger.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        _logger.error.apply(_logger, args);
    };
    Logger.echo = function (message, vars) {
        _logger.echo(message, vars);
    };
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map