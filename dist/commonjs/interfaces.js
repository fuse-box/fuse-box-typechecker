Object.defineProperty(exports, "__esModule", { value: true });
var WorkerCommand;
(function (WorkerCommand) {
    WorkerCommand[WorkerCommand["inspectCode"] = 0] = "inspectCode";
    WorkerCommand[WorkerCommand["printResult"] = 1] = "printResult";
})(WorkerCommand = exports.WorkerCommand || (exports.WorkerCommand = {}));
var TypecheckerRunType;
(function (TypecheckerRunType) {
    TypecheckerRunType["sync"] = "sync";
    TypecheckerRunType["async"] = "async";
    TypecheckerRunType["watch"] = "watch";
    TypecheckerRunType["promiseSync"] = "promisesync";
})(TypecheckerRunType = exports.TypecheckerRunType || (exports.TypecheckerRunType = {}));
