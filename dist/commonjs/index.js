Object.defineProperty(exports, "__esModule", { value: true });
var child = require("child_process");
var path = require("path");
var interfaces_1 = require("./interfaces");
var checker_1 = require("./checker");
var watch = require("watch");
var ts = require("typescript");
var chalk = require("chalk");
var TypeHelperClass = (function () {
    function TypeHelperClass(options) {
        this.checker = new checker_1.Checker();
        this.options = options;
        this.options.basePath = options.basePath ? path.resolve(process.cwd(), options.basePath) : process.cwd();
        this.writeText(chalk.yellow('\n' + "Typechecker basepath: " + chalk.white("" + this.options.basePath + '\n')));
        this.options.name = this.options.name ? ':' + this.options.name : '';
        var lintOp = this.options.lintoptions;
        this.options.lintoptions = lintOp ? lintOp : {};
        this.options.lintoptions = {
            fix: this.options.lintoptions.fix || false,
            formatter: 'json',
            formattersDirectory: this.options.lintoptions.formattersDirectory || null,
            rulesDirectory: this.options.lintoptions.rulesDirectory || null
        };
        var tsconf = this.getPath(options.tsConfig);
        this.options.tsConfigJsonContent = require(tsconf);
        this.writeText(chalk.yellow("Typechecker tsconfig: " + chalk.white("" + tsconf + '\n')));
        if (options.tsLint) {
            var tsLint = this.getPath(options.tsLint);
            this.writeText(chalk.yellow("Typechecker tsLint: " + chalk.white("" + tsLint + '\n')));
        }
    }
    TypeHelperClass.prototype.runAsync = function () {
        var options = Object.assign(this.options, { quit: true, type: interfaces_1.TypecheckerRunType.async });
        this.createThread();
        this.inspectCodeWithWorker(options);
        this.printResultWithWorker();
    };
    TypeHelperClass.prototype.runSync = function () {
        var options = Object.assign(this.options, { quit: true, type: interfaces_1.TypecheckerRunType.sync });
        this.checker.inspectCode(options);
        return this.checker.printResult();
    };
    TypeHelperClass.prototype.runPromise = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var options = Object.assign(_this.options, { quit: true, type: interfaces_1.TypecheckerRunType.promiseSync });
                _this.checker.inspectCode(options);
                var errors = _this.checker.printResult();
                resolve(errors);
            }
            catch (err) {
                reject(err);
            }
        });
    };
    TypeHelperClass.prototype.runWatch = function (pathToWatch) {
        var _this = this;
        var options = Object.assign(this.options, { quit: false, type: interfaces_1.TypecheckerRunType.watch });
        var write = this.writeText;
        var END_LINE = '\n';
        this.createThread();
        this.inspectCodeWithWorker(options);
        var basePath = this.getPath(pathToWatch);
        watch.createMonitor(basePath, function (monitor) {
            write(chalk.yellow("Typechecker watching: " + chalk.white("" + basePath + END_LINE)));
            monitor.on('created', function (f) {
                write(END_LINE + chalk.yellow("File created: " + f + END_LINE));
            });
            monitor.on('changed', function (f) {
                write(END_LINE + chalk.yellow("File changed: " + chalk.white("" + f + END_LINE)));
                write(chalk.grey("Calling typechecker" + END_LINE));
                clearTimeout(_this.watchTimeout);
                _this.watchTimeout = setTimeout(function () {
                    _this.inspectCodeWithWorker(options);
                    _this.printResultWithWorker();
                }, 500);
            });
            monitor.on('removed', function (f) {
                write(END_LINE + chalk.yellow("File removed: " + chalk.white("" + f + END_LINE)));
                write(chalk.grey("Calling typechecker" + END_LINE));
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
    TypeHelperClass.prototype.inspectCodeWithWorker = function (options) {
        this.worker.send({ type: interfaces_1.WorkerCommand.inspectCode, options: options });
        this.isWorkerInspectPreformed = true;
    };
    TypeHelperClass.prototype.printResultWithWorker = function () {
        if (this.isWorkerInspectPreformed) {
            this.worker.send({ type: interfaces_1.WorkerCommand.printResult });
        }
        else {
            this.writeText('You can not run pront before you have inspected code first');
        }
    };
    TypeHelperClass.prototype.createThread = function () {
        var _this = this;
        this.worker = child.fork(path.join(__dirname, 'worker.js'), []);
        this.worker.on('message', function (err) {
            if (err === 'error') {
                _this.writeText('error typechecker');
                process.exit(1);
            }
            else {
                _this.writeText('killing worker');
                _this.killWorker();
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

//# sourceMappingURL=index.js.map
