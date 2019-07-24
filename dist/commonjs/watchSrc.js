"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var interfaces_1 = require("./interfaces");
var printResult_1 = require("./printResult");
var watch = require("watch");
var getPath_1 = require("./getPath");
var debugPrint_1 = require("./debugPrint");
var watchTimeout;
function watchSrc(pathToWatch, options, callback) {
    debugPrint_1.debugPrint('wwatchSrc' + pathToWatch);
    var basePath = getPath_1.getPath(pathToWatch, options);
    watch.createMonitor(basePath, function (monitor) {
        printResult_1.print(chalk_1.default.yellow("Typechecker watching: " + chalk_1.default.white("" + basePath + interfaces_1.END_LINE)));
        monitor.on('created', function (f) {
            printResult_1.print(interfaces_1.END_LINE + chalk_1.default.yellow("File created: " + f + interfaces_1.END_LINE));
            callback();
        });
        monitor.on('changed', function (f) {
            printResult_1.print(interfaces_1.END_LINE + chalk_1.default.yellow("File changed: " + chalk_1.default.white("" + f + interfaces_1.END_LINE)));
            printResult_1.print(chalk_1.default.grey("Calling typechecker" + interfaces_1.END_LINE));
            clearTimeout(watchTimeout);
            watchTimeout = setTimeout(function () {
                callback();
            }, 500);
        });
        monitor.on('removed', function (f) {
            printResult_1.print(interfaces_1.END_LINE + chalk_1.default.yellow("File removed: " + chalk_1.default.white("" + f + interfaces_1.END_LINE)));
            printResult_1.print(chalk_1.default.grey("Calling typechecker" + interfaces_1.END_LINE));
            clearTimeout(watchTimeout);
            watchTimeout = setTimeout(function () {
                callback();
            }, 500);
        });
    });
}
exports.watchSrc = watchSrc;
//# sourceMappingURL=watchSrc.js.map