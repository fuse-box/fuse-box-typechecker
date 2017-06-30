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
        this.options.basePath = options.basePath ? path.resolve(process.cwd(), options.basePath) : null;
        this.writeText(chalk.yellow('\n' + "Typechecker basepath: " + chalk.white("" + this.options.basePath + '\n')));
        this.options.name = this.options.name ? ':' + this.options.name : '';
        var lintOp = this.options.lintoptions;
        this.options.lintoptions = lintOp ? lintOp : {};
        this.options.lintoptions = {
            fix: this.options.lintoptions.fix || null,
            formatter: 'json',
            formattersDirectory: this.options.lintoptions.formattersDirectory || null,
            rulesDirectory: this.options.lintoptions.rulesDirectory || null
        };
        var tsconf = this.options.basePath ? path.resolve(this.options.basePath, options.tsConfig) : path.resolve(process.cwd(), options.tsConfig);
        this.options.tsConfigObj = require(tsconf);
        this.writeText(chalk.yellow("Typechecker tsconfig: " + chalk.white("" + tsconf + '\n')));
        if (options.tsLint) {
            var tsLint = this.options.basePath ? path.resolve(this.options.basePath, options.tsLint) : path.resolve(process.cwd(), options.tsLint);
            this.writeText(chalk.yellow("Typechecker tsLint: " + chalk.white("" + tsLint + '\n')));
        }
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
        var basePath = this.options.basePath ? path.resolve(this.options.basePath, pathToWatch) : path.resolve(process.cwd(), pathToWatch);
        watch.createMonitor(basePath, function (monitor) {
            write(chalk.yellow("Typechecker watching: " + chalk.white("" + basePath + END_LINE)));
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
