Object.defineProperty(exports, "__esModule", { value: true });
var child = require("child_process");
var path = require("path");
var checker_1 = require("./checker");
var watch = require("watch");
var ts = require("typescript");
var chalk = require("chalk");
var TypeHelperClass = (function () {
    function TypeHelperClass(options) {
        this.checker = new checker_1.Checker();
        this.options = options;
        this.options.name = this.options.name ? ':' + this.options.name : '';
        this.options.tsConfigObj = require(path.resolve(process.cwd(), options.tsConfig));
    }
    TypeHelperClass.prototype.runAsync = function () {
        var options = Object.assign(this.options, { quit: true, type: 'async' });
        this.createThread();
        this.configureWorker(options);
        this.runWorker();
    };
    TypeHelperClass.prototype.runSync = function () {
        var options = Object.assign(this.options, { finished: true, type: 'sync' });
        this.checker.configure(options);
        this.checker.typecheck();
    };
    TypeHelperClass.prototype.runWatch = function (pathToWatch) {
        var _this = this;
        var options = Object.assign(this.options, { quit: false, type: 'watch' });
        var write = this.writeText;
        var END_LINE = '\n';
        this.createThread();
        this.configureWorker(options);
        watch.createMonitor(path.resolve(process.cwd(), pathToWatch), function (monitor) {
            write(chalk.yellow("Stating watch on path: " + chalk.white("" + path.resolve(process.cwd(), pathToWatch) + END_LINE)));
            monitor.on('created', function (f) {
                write(END_LINE + chalk.yellow("File created: " + f + END_LINE));
            });
            monitor.on('changed', function (f) {
                write(END_LINE + chalk.yellow("File changed: " + chalk.white("" + f + END_LINE)));
                write(chalk.grey("Calling typechecker" + END_LINE));
                _this.configureWorker(options);
                _this.runWorker();
            });
            monitor.on('removed', function (f) {
                write(END_LINE + chalk.yellow("File removed: " + chalk.white("" + f + END_LINE)));
                write(chalk.grey("Calling typechecker" + END_LINE));
                _this.configureWorker(options);
                _this.runWorker();
            });
            _this.monitor = monitor;
        });
        this.runWorker();
    };
    TypeHelperClass.prototype.killWorker = function () {
        if (this.worker) {
            this.worker.kill();
        }
        if (this.monitor) {
            this.monitor.stop();
        }
    };
    TypeHelperClass.prototype.configureWorker = function (options) {
        this.worker.send({ type: 'configure', options: options });
    };
    TypeHelperClass.prototype.runWorker = function () {
        this.worker.send({ type: 'run' });
    };
    TypeHelperClass.prototype.createThread = function () {
        var _this = this;
        this.worker = child.fork(path.join(__dirname, 'worker.js'), [], this.options);
        this.worker.on('message', function (err) {
            if (err === 'error') {
                console.log('error typechecker');
                process.exit(1);
            }
            else {
                console.log('killing worker');
                _this.killWorker();
            }
        });
    };
    TypeHelperClass.prototype.writeText = function (text) {
        ts.sys.write(text);
    };
    return TypeHelperClass;
}());
exports.TypeHelperClass = TypeHelperClass;
exports.TypeHelper = function (options) {
    return new TypeHelperClass(options);
};
