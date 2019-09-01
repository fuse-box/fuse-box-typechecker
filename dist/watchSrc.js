"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interfaces_1 = require("./interfaces");
var watch = require("watch");
var getPath_1 = require("./getPath");
var debugPrint_1 = require("./debugPrint");
var logger_1 = require("./logger");
var watchTimeout;
function watchSrc(pathToWatch, options, callback) {
    debugPrint_1.debugPrint('wwatchSrc' + pathToWatch);
    var basePath = getPath_1.getPath(pathToWatch, options);
    watch.createMonitor(basePath, function (monitor) {
        logger_1.Logger.echo(logger_1.Style.yellow("Typechecker watching: " + logger_1.Style.white("" + basePath + interfaces_1.END_LINE)));
        monitor.on('created', function (f) {
            logger_1.Logger.echo(interfaces_1.END_LINE + logger_1.Style.yellow("File created: " + f + interfaces_1.END_LINE));
            callback();
        });
        monitor.on('changed', function (f) {
            logger_1.Logger.echo(interfaces_1.END_LINE + logger_1.Style.yellow("File changed: " + logger_1.Style.white("" + f + interfaces_1.END_LINE)));
            logger_1.Logger.echo(logger_1.Style.grey("Calling typechecker" + interfaces_1.END_LINE));
            clearTimeout(watchTimeout);
            watchTimeout = setTimeout(function () {
                callback();
            }, 100);
        });
        monitor.on('removed', function (f) {
            logger_1.Logger.echo(interfaces_1.END_LINE + logger_1.Style.yellow("File removed: " + logger_1.Style.white("" + f + interfaces_1.END_LINE)));
            logger_1.Logger.echo(logger_1.Style.grey("Calling typechecker" + interfaces_1.END_LINE));
            clearTimeout(watchTimeout);
            watchTimeout = setTimeout(function () {
                callback();
            }, 100);
        });
    });
}
exports.watchSrc = watchSrc;
//# sourceMappingURL=watchSrc.js.map