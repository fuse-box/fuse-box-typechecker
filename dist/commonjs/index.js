"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child = require("child_process");
var path = require("path");
var interfaces_1 = require("./interfaces");
require("./register.json5");
var getPath_1 = require("./getPath");
var inspectCode_1 = require("./inspectCode");
var printResult_1 = require("./printResult");
var printSettings_1 = require("./printSettings");
var TypeHelperClass = (function () {
    function TypeHelperClass(options) {
        this.options = options;
        this.options.basePath = options.basePath
            ? path.resolve(process.cwd(), options.basePath)
            : process.cwd();
        this.options.name = this.options.name ? this.options.name : '';
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
            var tsconf = getPath_1.getPath(options.tsConfig, options);
            this.options.tsConfigJsonContent = require(tsconf);
        }
        else {
            this.options.tsConfigJsonContent = {
                compilerOptions: {}
            };
        }
        if (options.tsConfigOverride) {
            var oldConfig = this.options.tsConfigJsonContent;
            for (var att in options.tsConfigOverride) {
                if (att === 'compilerOptions') {
                    if (oldConfig.compilerOptions) {
                        for (var attCom in options.tsConfigOverride.compilerOptions) {
                            if (attCom) {
                                oldConfig.compilerOptions[attCom] = (options.tsConfigOverride).compilerOptions[attCom];
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
    }
    TypeHelperClass.prototype.printSettings = function () {
        printSettings_1.printSettings(this.options);
    };
    TypeHelperClass.prototype.inspectAndPrint = function () {
        var lastResult = inspectCode_1.inspectCode(this.options);
        return printResult_1.printResult(this.options, lastResult);
    };
    TypeHelperClass.prototype.inspectOnly = function (oldProgram) {
        return inspectCode_1.inspectCode(this.options, oldProgram);
    };
    TypeHelperClass.prototype.printOnly = function (errors) {
        return printResult_1.printResult(this.options, errors);
    };
    TypeHelperClass.prototype.worker_watch = function (pathToWatch) {
        this.startWorker();
        this.worker.send({
            quit: false,
            type: interfaces_1.WorkerCommand.watch,
            pathToWatch: pathToWatch,
            options: this.options
        });
    };
    TypeHelperClass.prototype.worker_kill = function () {
        if (this.worker) {
            this.worker.kill();
        }
    };
    TypeHelperClass.prototype.worker_inspect = function () {
        if (!this.worker) {
            this.startWorker();
        }
        this.worker.send({ type: interfaces_1.WorkerCommand.inspectCode, options: this.options });
    };
    TypeHelperClass.prototype.worker_PrintSettings = function () {
        if (!this.worker) {
            this.startWorker();
        }
        this.worker.send({ type: interfaces_1.WorkerCommand.printSettings, options: this.options });
    };
    TypeHelperClass.prototype.worker_print = function () {
        if (!this.worker) {
            printResult_1.print('Need to inspect code before printing first');
        }
        else {
            this.worker.send({ type: interfaces_1.WorkerCommand.printResult, options: this.options });
        }
    };
    TypeHelperClass.prototype.worker_inspectAndPrint = function () {
        if (!this.worker) {
            this.startWorker();
        }
        this.worker.send({ type: interfaces_1.WorkerCommand.inspectCodeAndPrint, options: this.options });
    };
    TypeHelperClass.prototype.startWorker = function () {
        var _this = this;
        this.worker = child.fork(path.join(__dirname, 'worker.js'), []);
        this.worker.on('message', function (msg) {
            if (msg === 'error') {
                printResult_1.print('error typechecker');
                process.exit(1);
            }
            else {
                printResult_1.print('killing worker');
                _this.worker_kill();
            }
        });
    };
    return TypeHelperClass;
}());
exports.TypeHelperClass = TypeHelperClass;
exports.TypeChecker = function (options) {
    return new TypeHelperClass(options);
};
//# sourceMappingURL=index.js.map