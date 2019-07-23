"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child = require("child_process");
var path = require("path");
var interfaces_1 = require("./interfaces");
var chalk_1 = require("chalk");
require("./register.json5");
var getPath_1 = require("./getPath");
var inspectCode_1 = require("./inspectCode");
var printResult_1 = require("./printResult");
var TypeHelperClass = (function () {
    function TypeHelperClass(options) {
        this.options = options;
        this.options.basePath = options.basePath
            ? path.resolve(process.cwd(), options.basePath)
            : process.cwd();
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
    TypeHelperClass.prototype.printSettings = function (options) {
        printResult_1.print(chalk_1.default.yellow('\n' + "Typechecker name: " + chalk_1.default.white("" + options.name + '\n')));
        printResult_1.print(chalk_1.default.yellow("Typechecker basepath: " + chalk_1.default.white("" + options.basePath + '\n')));
        if (options.tsConfig) {
            var tsconf = getPath_1.getPath(options.tsConfig, options);
            printResult_1.print(chalk_1.default.yellow("Typechecker tsconfig: " + chalk_1.default.white("" + tsconf + '\n')));
        }
        else {
            printResult_1.print(chalk_1.default.yellow("Typechecker tsconfig: " + chalk_1.default.white("undefined, using ts defaults" + '\n')));
        }
        if (options.tsLint) {
            var tsLint = getPath_1.getPath(options.tsLint, options);
            printResult_1.print(chalk_1.default.yellow("Typechecker tsLint: " + chalk_1.default.white("" + tsLint + '\n')));
        }
    };
    TypeHelperClass.prototype.inspectAndPrint_local = function () {
        var lastResult = inspectCode_1.inspectCode(this.options);
        return printResult_1.printResult(this.options, lastResult);
    };
    TypeHelperClass.prototype.inspect_local = function (oldProgram) {
        return inspectCode_1.inspectCode(this.options, oldProgram);
    };
    TypeHelperClass.prototype.print_local = function (errors) {
        return printResult_1.printResult(this.options, errors);
    };
    TypeHelperClass.prototype.startWatch = function (pathToWatch) {
        this.startWorker();
        this.worker.send({
            quit: false,
            type: interfaces_1.TypecheckerRunType.watch,
            pathToWatch: pathToWatch,
            options: this.options
        });
    };
    TypeHelperClass.prototype.kill = function () {
        if (this.worker) {
            this.worker.kill();
        }
    };
    TypeHelperClass.prototype.inspect_worker = function () {
        if (!this.worker) {
            this.startWorker();
        }
        this.worker.send({ type: interfaces_1.WorkerCommand.inspectCode, options: this.options });
    };
    TypeHelperClass.prototype.print_worker = function () {
        if (!this.worker) {
            printResult_1.print('Need to inspect code before printing first');
        }
        else {
            this.worker.send({ type: interfaces_1.WorkerCommand.printResult, options: this.options });
        }
    };
    TypeHelperClass.prototype.inspectAndPrint_worker = function () {
        if (!this.worker) {
            printResult_1.print('Need to inspect code before printing first');
        }
        else {
            this.worker.send({ type: interfaces_1.WorkerCommand.printResult, options: this.options });
        }
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
                _this.kill();
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