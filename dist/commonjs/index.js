Object.defineProperty(exports, "__esModule", { value: true });
var child = require("child_process");
var path = require("path");
var TypeCheckPluginClass = (function () {
    function TypeCheckPluginClass(options) {
        this.countBundles = 0;
        this.countBundleEnd = 0;
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
        if (this.countBundles === 0) {
            var tsConfig = context.getTypeScriptConfig();
            switch (true) {
                case this.options.quit && this.firstRun:
                    this.slave.send({ type: 'tsconfig', data: tsConfig });
                    break;
                case !this.options.quit && this.firstRun:
                    this.slave.send({ type: 'tsconfig', data: tsConfig });
                    break;
                case !this.options.quit && !this.firstRun:
                    this.slave.send({ type: 'tsconfig', data: tsConfig });
                    break;
            }
        }
        this.countBundles++;
    };
    TypeCheckPluginClass.prototype.bundleEnd = function () {
        var _this = this;
        this.countBundleEnd++;
        if (this.countBundleEnd = this.countBundles) {
            setTimeout(function () {
                switch (true) {
                    case _this.options.quit && _this.firstRun:
                        _this.slave.send({ type: 'run', options: _this.options });
                        _this.firstRun = false;
                        break;
                    case !_this.options.quit && _this.firstRun:
                        _this.slave.send({ type: 'run', options: _this.options });
                        _this.firstRun = false;
                        break;
                    case !_this.options.quit && !_this.firstRun:
                        _this.slave.send({ type: 'run', options: _this.options });
                        _this.firstRun = false;
                }
            }, 100);
            this.countBundleEnd = 0;
            this.countBundles = 0;
        }
    };
    return TypeCheckPluginClass;
}());
exports.TypeCheckPluginClass = TypeCheckPluginClass;
exports.TypeCheckPlugin = function (options) {
    return new TypeCheckPluginClass(options);
};
