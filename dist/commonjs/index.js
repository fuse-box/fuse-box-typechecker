"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child = require("child_process");
var path = require("path");
var interfaces_1 = require("./interfaces");
var checker_1 = require("./checker");
var watch = require("watch");
var ts = require("typescript");
var chalk_1 = require("chalk");
require("./register.json5");
var TypeHelperClass = (function () {
    function TypeHelperClass(options) {
        this.checker = new checker_1.Checker();
        this.options = options;
        this.writeText(chalk_1.default.yellow('\n' + "Typechecker name: " + chalk_1.default.white("" + this.options.name + '\n')));
        this.options.basePath = options.basePath ? path.resolve(process.cwd(), options.basePath) : process.cwd();
        this.writeText(chalk_1.default.yellow("Typechecker basepath: " + chalk_1.default.white("" + this.options.basePath + '\n')));
        this.options.name = this.options.name ? ':' + this.options.name : '';
        this.options.shortenFilenames = !!this.options.shortenFilenames;
        var lintOp = this.options.lintoptions;
        this.options.lintoptions = lintOp ? lintOp : {};
        this.options.lintoptions = {
            fix: this.options.lintoptions.fix || false,
            formatter: 'json',
            formattersDirectory: this.options.lintoptions.formattersDirectory || null,
            rulesDirectory: this.options.lintoptions.rulesDirectory || null
        };
        if (options.tsConfig) {
            var tsconf = this.getPath(options.tsConfig);
            this.options.tsConfigJsonContent = require(tsconf);
            this.writeText(chalk_1.default.yellow("Typechecker tsconfig: " + chalk_1.default.white("" + tsconf + '\n')));
        }
        else {
            this.options.tsConfigJsonContent = { compilerOptions: {} };
            this.writeText(chalk_1.default.yellow("Typechecker tsconfig: " + chalk_1.default.white("undefined, using ts defaults" + '\n')));
        }
        if (options.tsConfigOverride) {
            var oldConfig = this.options.tsConfigJsonContent;
            for (var att in options.tsConfigOverride) {
                if (att === 'compilerOptions') {
                    if (oldConfig.compilerOptions) {
                        for (var attCom in options.tsConfigOverride.compilerOptions) {
                            if (attCom) {
                                oldConfig.compilerOptions[attCom] = options.tsConfigOverride.compilerOptions[attCom];
                            }
                        }
                    }
                    else {
                        oldConfig.compilerOptions = options.tsConfigOverride.compilerOptions;
                    }
                }
                else {
                    oldConfig[att] = options.tsConfigOverride[att];
                }
            }
        }
        if (options.tsLint) {
            var tsLint = this.getPath(options.tsLint);
            this.writeText(chalk_1.default.yellow("Typechecker tsLint: " + chalk_1.default.white("" + tsLint + '\n')));
        }
    }
    TypeHelperClass.prototype.runAsync = function (callback) {
        var options = Object.assign(this.options, { quit: true, type: interfaces_1.TypecheckerRunType.async });
        this.workerCallback = callback;
        this.createThread();
        this.inspectCodeWithWorker(options);
        this.printResultWithWorker();
    };
    TypeHelperClass.prototype.runSync = function () {
        var options = Object.assign(this.options, { quit: true, type: interfaces_1.TypecheckerRunType.sync });
        this.checker.inspectCode(options);
        return this.checker.printResult();
    };
    TypeHelperClass.prototype.runSilentSync = function () {
        var options = Object.assign(this.options, { quit: true, type: interfaces_1.TypecheckerRunType.sync });
        this.checker.inspectCode(options);
        return this.checker.getResultObj();
    };
    TypeHelperClass.prototype.runSilentPromise = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var options = Object.assign(_this.options, { quit: true, type: interfaces_1.TypecheckerRunType.promiseAsync });
                _this.workerCallback = function (errors) {
                    resolve(errors);
                };
                _this.createThread();
                _this.inspectCodeWithWorker(options);
                _this.getResultObjFromWorker();
            }
            catch (err) {
                reject(err);
            }
        });
    };
    TypeHelperClass.prototype.runPromise = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var options = Object.assign(_this.options, { quit: true, type: interfaces_1.TypecheckerRunType.promiseAsync });
                _this.workerCallback = function (errors) {
                    resolve(errors);
                };
                _this.createThread();
                _this.inspectCodeWithWorker(options);
                _this.printResultWithWorker();
            }
            catch (err) {
                reject(err);
            }
        });
    };
    TypeHelperClass.prototype.runWatch = function (pathToWatch, callback) {
        var _this = this;
        var options = Object.assign(this.options, { quit: false, type: interfaces_1.TypecheckerRunType.watch });
        var write = this.writeText;
        var END_LINE = '\n';
        this.workerCallback = function (errors) {
            if (callback) {
                callback('updated', errors);
            }
        };
        this.createThread();
        this.inspectCodeWithWorker(options);
        var basePath = this.getPath(pathToWatch);
        watch.createMonitor(basePath, function (monitor) {
            write(chalk_1.default.yellow("Typechecker watching: " + chalk_1.default.white("" + basePath + END_LINE)));
            monitor.on('created', function (f) {
                write(END_LINE + chalk_1.default.yellow("File created: " + f + END_LINE));
            });
            monitor.on('changed', function (f) {
                if (callback) {
                    callback('edit');
                }
                write(END_LINE + chalk_1.default.yellow("File changed: " + chalk_1.default.white("" + f + END_LINE)));
                write(chalk_1.default.grey("Calling typechecker" + END_LINE));
                clearTimeout(_this.watchTimeout);
                _this.watchTimeout = setTimeout(function () {
                    _this.inspectCodeWithWorker(options);
                    _this.printResultWithWorker();
                }, 500);
            });
            monitor.on('removed', function (f) {
                write(END_LINE + chalk_1.default.yellow("File removed: " + chalk_1.default.white("" + f + END_LINE)));
                write(chalk_1.default.grey("Calling typechecker" + END_LINE));
                clearTimeout(_this.watchTimeout);
                _this.watchTimeout = setTimeout(function () {
                    _this.inspectCodeWithWorker(options);
                    _this.printResultWithWorker();
                }, 500);
            });
            _this.monitor = monitor;
        });
        this.printResultWithWorker();
    };
    TypeHelperClass.prototype.killWorker = function () {
        if (this.worker) {
            this.worker.kill();
        }
        if (this.monitor) {
            this.monitor.stop();
        }
    };
    TypeHelperClass.prototype.startTreadAndWait = function () {
        this.createThread();
    };
    TypeHelperClass.prototype.useThreadAndTypecheck = function () {
        this.inspectCodeWithWorker(Object.assign(this.options, { quit: false, type: 'watch' }));
        this.printResultWithWorker();
    };
    TypeHelperClass.prototype.inspectCodeWithWorker = function (options) {
        this.worker.send({ type: interfaces_1.WorkerCommand.inspectCode, options: options });
        this.isWorkerInspectPreformed = true;
    };
    TypeHelperClass.prototype.printResultWithWorker = function () {
        if (this.isWorkerInspectPreformed) {
            this.worker.send({ type: interfaces_1.WorkerCommand.printResult, hasCallback: this.workerCallback != null });
        }
        else {
            this.writeText('You can not run print before you have inspected code first');
        }
    };
    TypeHelperClass.prototype.getResultObjFromWorker = function () {
        if (this.isWorkerInspectPreformed) {
            this.worker.send({ type: interfaces_1.WorkerCommand.getResultObj, hasCallback: this.workerCallback != null });
        }
        else {
            this.writeText('You can not run print before you have inspected code first');
        }
    };
    TypeHelperClass.prototype.createThread = function () {
        var _this = this;
        this.worker = child.fork(path.join(__dirname, 'worker.js'), []);
        this.worker.on('message', function (msg) {
            if (msg === 'error') {
                _this.writeText('error typechecker');
                process.exit(1);
            }
            else {
                if (_this.workerCallback && msg && typeof msg === 'object' && msg.type === 'result') {
                    _this.workerCallback(msg.result);
                }
                else {
                    _this.writeText('killing worker');
                    _this.killWorker();
                }
            }
        });
    };
    TypeHelperClass.prototype.writeText = function (text) {
        ts.sys.write(text);
    };
    TypeHelperClass.prototype.getPath = function (usePath) {
        return this.options.basePath ? path.resolve(this.options.basePath, usePath) : path.resolve(process.cwd(), usePath);
    };
    return TypeHelperClass;
}());
exports.TypeHelperClass = TypeHelperClass;
exports.TypeHelper = function (options) {
    return new TypeHelperClass(options);
};
exports.TypeChecker = function (options) {
    return new TypeHelperClass(options);
};
//# sourceMappingURL=index.js.map