Object.defineProperty(exports, "__esModule", { value: true });
var child = require("child_process");
var path = require("path");
var TypeCheckPluginClass = (function () {
    function TypeCheckPluginClass(options) {
        this.options = options || {};
        this.options.bundles = this.options.bundles || [];
        this.slave = child.fork(path.join(__dirname, 'worker.js'), [], options);
        this.slave.on('message', function (err) {
            if (err = 'error') {
                console.log('error typechecker');
                process.exit(1);
            }
        });
        this.firstRun = true;
    }
    TypeCheckPluginClass.prototype.init = function (context) {
        if (this.options.bundles.indexOf(context.bundle.name) !== -1) {
            if (this.options.quit && this.firstRun) {
                var tsConfig = context.getTypeScriptConfig();
                this.slave.send({ type: 'tsconfig', data: tsConfig });
            }
            if (!this.options.quit && this.firstRun) {
                var tsConfig = context.getTypeScriptConfig();
                this.slave.send({ type: 'tsconfig', data: tsConfig });
            }
            if (!this.options.quit && !this.firstRun) {
                var tsConfig = context.getTypeScriptConfig();
                this.slave.send({ type: 'tsconfig', data: tsConfig });
            }
        }
    };
    TypeCheckPluginClass.prototype.bundleEnd = function (context) {
        if (this.options.bundles.indexOf(context.bundle.name) !== -1) {
            if (this.options.quit && this.firstRun) {
                this.slave.send({ type: 'run', options: this.options, bundle: context.bundle.name });
                this.firstRun = false;
            }
            if (!this.options.quit && this.firstRun) {
                this.slave.send({ type: 'run', options: this.options, bundle: context.bundle.name });
                this.firstRun = false;
            }
            if (!this.options.quit && !this.firstRun) {
                this.slave.send({ type: 'run', options: this.options, bundle: context.bundle.name });
                this.firstRun = false;
            }
        }
        if (this.options.bundles.length === 0) {
            console.warn("\n Typechecker \n No bundle selected, sample;\n TypeCheckPlugin({bundles:['app']})\n");
        }
    };
    return TypeCheckPluginClass;
}());
exports.TypeCheckPluginClass = TypeCheckPluginClass;
exports.TypeCheckPlugin = function (options) {
    return new TypeCheckPluginClass(options);
};
