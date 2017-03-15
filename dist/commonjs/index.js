Object.defineProperty(exports, "__esModule", { value: true });
var child = require("child_process");
var path = require("path");
var TypeCheckPluginClass = (function () {
    function TypeCheckPluginClass(options) {
        this.options = options || {};
        this.slave = child.fork(path.join(__dirname, 'worker.js'), [], options);
        this.firstRun = true;
    }
    TypeCheckPluginClass.prototype.init = function (context) {
        var tsConfig = context.getTypeScriptConfig();
        this.slave.send({ type: 'tsconfig', data: tsConfig });
    };
    TypeCheckPluginClass.prototype.bundleEnd = function () {
        this.slave.send({ type: 'run', quit: this.options.quit });
        this.firstRun = false;
    };
    return TypeCheckPluginClass;
}());
exports.TypeCheckPluginClass = TypeCheckPluginClass;
exports.TypeCheckPlugin = function (options) {
    return new TypeCheckPluginClass(options);
};
