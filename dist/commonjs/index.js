Object.defineProperty(exports, "__esModule", { value: true });
var child = require("child_process");
var path = require("path");
var checker_1 = require("./checker");
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
                _this.worker.kill();
            }
        });
    };
    return TypeHelperClass;
}());
exports.TypeHelperClass = TypeHelperClass;
exports.TypeHelper = function (options) {
    return new TypeHelperClass(options);
};
