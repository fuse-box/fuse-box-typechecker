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
    TypeHelperClass.prototype.run = function () {
        this.createThread();
        this.configureWorker();
        this.runWorker();
    };
    TypeHelperClass.prototype.runSync = function () {
        var options = Object.assign(this.options, { quit: true });
        this.checker.configure(options);
        this.checker.typecheck();
    };
    TypeHelperClass.prototype.configureWorker = function () {
        this.worker.send({ type: 'configure', options: this.options });
    };
    TypeHelperClass.prototype.runWorker = function () {
        this.worker.send({ type: 'run' });
    };
    TypeHelperClass.prototype.createThread = function () {
        this.worker = child.fork(path.join(__dirname, 'worker.js'), [], this.options);
        this.worker.on('message', function (err) {
            if (err = 'error') {
                console.log('error typechecker');
                process.exit(1);
            }
        });
    };
    return TypeHelperClass;
}());
exports.TypeHelperClass = TypeHelperClass;
exports.TypeHelper = function (options) {
    return new TypeHelperClass(options);
};
