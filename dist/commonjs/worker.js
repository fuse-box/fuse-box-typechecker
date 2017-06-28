Object.defineProperty(exports, "__esModule", { value: true });
var checker_1 = require("./checker");
var checker = new checker_1.Checker();
process.on('message', function (msg) {
    var type = msg.type;
    switch (type) {
        case 'configure':
            checker.configure(msg.options);
            break;
        case 'run':
            checker.typecheck();
            break;
    }
});
